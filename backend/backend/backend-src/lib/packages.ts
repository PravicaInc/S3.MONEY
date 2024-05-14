/**
 * @file Handlers related to creating and fetching lists of packages.
 */

import * as child from 'child_process';
import ejs from 'ejs';
import { Request, Response } from 'express';
import fs from 'fs';
import { Zip } from 'zip-lib';

import * as dbPackages from '../db/packages';
import * as IFace from '../interfaces';
import { ErrorType, invalidAddressErrorDetail, invalidPackageErrorDetail, S3MoneyError } from '../interfaces/error';

import * as Checks from './checks';
import * as storage from './storage';
import { tickerToPackageName } from './utils';

/**
 * Create a package.
 *
 * @param {Request} req
 * @param {Response} res
 */
export async function handleCreate(req: Request, res: Response<IFace.PackageCreateResponse>) {
  const v = await Checks.validCreate(req.body);

  if (v.error === '') {
    const r = await createPackage(req.tokenPath, req.workDir, v.data! as IFace.ContractCreate);

    if (r.error === '') {
      res.status(200).json({
        status: 'ok',
        ...r,
      });
    }
    else {
      res.status(400).json({
        status: 'error',
        message: r.error,
      });
    }
  }
  else {
    res.status(400).json({
      status: 'error',
      message: v.error, // 'Missing data to create coin',
    });
  }
}

/**
 * If the user decides not to publish a package,
 * delete its files and related database entries.
 *
 * @param {Request} req
 * @param {Response} res
 */
export async function handleCancel(req: Request, res: Response<IFace.PackageCancelResponse>) {
  const v = await Checks.validCancel(req.body);

  if (v.error === '') {
    await deletePackage(req.workDir, v.data! as IFace.IPackageCreated);
    res.status(200).json({ status: 'ok', message: 'deleted' });
  }
  else {
    res.status(400).json({
      status: 'error',
      message: v.error,
    });
  }
}

/**
 * Called when the user successfully publishes a package.
 *
 * @param {Request} req
 * @param {Response} res
 */
export async function handlePublished(req: Request, res: Response) {
  const v = await Checks.validPublish(req.body);

  await savePackage(v.data! as IFace.IPackageCreated);
  res.status(200).json({ status: 'ok', message: 'saved' });
}

/**
 * Generate a presigned URL for the frontend to upload an icon to.
 *
 * @param {Request} req
 * @param {Response} res
 */
export async function handleIconUrlRequest(req: Request, res: Response) {
  const v = Checks.validIconRequest(req.body);
  const url = await storage.createPresignedUrlForIcon(v.data as IFace.IPackageIcon);

  res.status(200).json({ status: 'ok', url: url });
}

/**
 * Create a package.
 *
 * @param {string} tokenPath - path to the token template directory
 * @param {string} workDir - path to the working directory where we create token packages
 * @param {IFace.CreatePackageRequest} data - package creation request
 */
async function createPackage(tokenPath: string, workDir: string, data: IFace.CreatePackageRequest) {
  const token: string = tokenPath;

  const packagePath = `${workDir}/${data.address}/${data.packageName}`;
  const TMoveToml = fs.readFileSync(`${token}/Move.toml`, {
    encoding: 'utf-8',
  });
  const TFiles = fs.readdirSync(`${token}/sources/`).filter(name => name.endsWith('.move'));

  let path = `${packagePath}/sources`;

  fs.mkdirSync(path, { recursive: true });
  console.log(`created ${path}`);

  path = `${packagePath}/Move.toml`;

  const move = ejs.render(TMoveToml, data);

  fs.writeFileSync(path, move);
  console.log(`wrote to ${path}`);

  for (const fname of TFiles) {
    const TIn = fs.readFileSync(`${token}/sources/${fname}`, {
      encoding: 'utf-8',
    });

    let TOut = `${packagePath}/sources/${fname}`;

    // special case: token_.move -> <packageName>.move
    // same with test
    if (fname === 'token_.move') {
      TOut = `${packagePath}/sources/${data.packageName}.move`;
    }
    else if (fname === 'token_tests.move') {
      TOut = `${packagePath}/sources/${data.packageName}_tests.move`;
    }

    const merged = ejs.render(TIn, data);

    fs.writeFileSync(TOut, merged);
    console.log(`wrote to ${TOut}`);
  }

  // FIXME: look into this
  let version;
  let ret;

  try {
    version = child.execSync('sui --version', { encoding: 'utf-8' });
    fs.writeFileSync(`${packagePath}/.built_with_sui`, version);

    ret = child.execSync('sui move build --dump-bytecode-as-base64', {
      cwd: packagePath,
      encoding: 'utf-8',
    });

    const zip = new Zip();

    zip.addFolder(packagePath, data.packageName!);
    await zip.archive(`/tmp/${packagePath}.zip`);
  }
  catch (e: unknown) {
    console.log(e);

    // fs.rmSync(packagePath, {recursive: true})
    return { modules: [], dependencies: [], error: e.toString() };
  }

  const package_zip_key = await storage.uploadPackageZip(data.address, data.packageName!, `/tmp/${packagePath}.zip`);

  const { modules, dependencies } = JSON.parse(ret);

  // clear any existing roles
  await dbPackages.deleteRoles(data.address, data.packageName!);

  await dbPackages.savePackage(IFace.reqToCreated(data, package_zip_key), IFace.PackageStatus.CREATED);

  return { modules, dependencies, error: '' };
}

/**
 * Get a list of packages for a given address.
 *
 * All packages that the address has a role against will be returned,
 * including unpublished ones (created, but not published).
 *
 * @param {Request} req
 * @param {Response} res
 */
export async function handleGetPackages(req: Request, res: Response) {
  const { address } = req.params;
  const summary = 'summary' in req.query;

  if (Checks.isValidPackage(address)) {
    res.status(200).json({
      status: 'ok',
      packages: await packageData(address, undefined, summary),
    });
  }
  else {
    throw new S3MoneyError(ErrorType.BadRequest, invalidPackageErrorDetail(address));
  }
}

/**
 * Get a filtered list of packages for a given address.
 *
 * The filter parameter can be a ticker (like $SUI) or a digest (txid).
 *
 * @param {Request} req
 * @param {Response} res
 */
export async function handleGetFilteredPackages(req: Request, res: Response) {
  const { address, param } = req.params;
  const summary = 'summary' in req.query;

  // extra can be a ticker or a digest (txid)

  const addressCheck = Checks.isValidAddress(address);
  const tickerCheck = Checks.isValidTicker(param);
  const digestCheck = Checks.isValidDigest(param);

  if (!addressCheck) {
    throw new S3MoneyError(ErrorType.BadRequest, invalidAddressErrorDetail(address));
  }

  if (tickerCheck !== '' && !digestCheck) {
    throw new S3MoneyError(ErrorType.BadRequest, `invalid field: ${param}`);
  }

  const filter: IFace.PackageFilter = { digest: '', packageName: '' };

  if (digestCheck) {
    filter.digest = param;
  }
  else if (tickerCheck === '') {
    filter.packageName = tickerToPackageName(param);
  }

  res.status(200).json({
    status: 'ok',
    packages: await packageData(address, filter, summary),
  });
}

async function deletePackage(workDir: string, data: IFace.IPackageCreated) {
  const path = `${workDir}/${data.address}/${data.packageName}`;

  if (fs.existsSync(path)) {
    await fs.rmSync(path, { recursive: true });
  }
  await storage.deletePackageZip(data.address, data.packageName!);
  await dbPackages.deletePackage(data.address, data.packageName!);
}

async function savePackage(data: IFace.IPackageCreated) {
  const pkg = await dbPackages.getPackage(data.address, data.packageName!);

  // at this point, we've already checked to see if pkg exists in the db
  data.icon_url = pkg!.icon_url;
  data.ticker_name = pkg!.ticker_name;
  data.packageRoles = pkg!.package_roles;
  data.package_zip = pkg!.package_zip;
  await dbPackages.savePackage(data, IFace.PackageStatus.PUBLISHED);
}

export async function packageData(address: string, filter: IFace.PackageFilter | undefined, summary: boolean) {
  return await dbPackages.getPackages(address, filter, summary);
}
