import { isValidSuiAddress, isValidSuiObjectId, isValidTransactionDigest } from '@mysten/sui.js/utils';
import fs from 'fs';

import { RESERVED_TICKERS } from '../constants';
import * as packageOps from '../db/packages';
import * as IFace from '../interfaces';
import { ErrorType, invalidAddressErrorDetail, missingFieldErrorDetail, S3MoneyError } from '../interfaces/error';

import { tickerToPackageName } from './utils';

const CWD = process.cwd();
const WORK_DIR = process.env.WORK_DIR || `${CWD}/contracts`;

const TICKER_REGEX = new RegExp(/^[-+_$\w\d]+$/);

export async function validCreate(data: IFace.ContractCreate): Promise<IFace.IValid> {
  const stringFields = ['ticker', 'name', 'decimals', 'address'];

  for (const field of stringFields) {
    if (!(field in data)) {
      console.log(`missing field: ${field}`);

      throw new S3MoneyError(ErrorType.BadRequest, missingFieldErrorDetail(field));
    }
  }

  if (!isValidAddress(data.address)) {
    console.log(`invalid address: ${data.address}`);

    throw new S3MoneyError(ErrorType.BadRequest, invalidAddressErrorDetail(data.address));
  }

  if (typeof data.decimals !== 'number') {
    data.decimals = parseInt(data.decimals, 10);
  }

  if (data.decimals < 0 || data.decimals > 16 || isNaN(data.decimals)) {
    console.log(`wrong number of decimals: ${data.decimals}`);

    throw new S3MoneyError(ErrorType.BadRequest, `wrong number of decimals: ${data.decimals}`);
  }

  // upcase the ticker
  data.ticker = data.ticker.toUpperCase().trim();

  const v = isValidTicker(data.ticker);

  if (v !== '') {
    console.log(v);

    return { error: v };
  }

  data.packageName = tickerToPackageName(data.ticker);
  data.description ??= data.name;

  data.initialSupply = data.initialSupply || '0';
  data.maxSupply = data.maxSupply || '0';

  const initialSupply = parseInt(data.initialSupply, 10);
  const maxSupply = parseInt(data.maxSupply, 10);

  if (isNaN(maxSupply) || isNaN(initialSupply)) {
    console.log(`invalid initialSupply or maxSupply: ${data.initialSupply}, ${data.maxSupply}`);

    throw new S3MoneyError(
      ErrorType.BadRequest,
      `invalid initialSupply or maxSupply: ${data.initialSupply}, ${data.maxSupply}`
    );
  }

  if (initialSupply < 0 || maxSupply < 0) {
    console.log(`initialSupply or maxSupply cannot be negative: ${data.initialSupply}, ${data.maxSupply}`);

    throw new S3MoneyError(
      ErrorType.BadRequest,
      `initialSupply or maxSupply cannot be negative: ${data.initialSupply}, ${data.maxSupply}`
    );
  }

  if (maxSupply > 0 && initialSupply >= maxSupply) {
    console.log(`initialSupply cannot be greater than maxSupply: ${data.initialSupply}, ${data.maxSupply}`);

    throw new S3MoneyError(
      ErrorType.BadRequest,
      `initialSupply cannot be greater than maxSupply: ${data.initialSupply}, ${data.maxSupply}`
    );
  }

  const path = `${WORK_DIR}/${data.address}/${data.packageName}`;

  if (fs.existsSync(path)) {
    fs.rmSync(path, { recursive: true });
  }

  // FIXME: can only deploy one package for each ticker
  const pkg = await packageOps.getPackage(data.address, data.packageName);

  if (pkg !== null && pkg.deploy_status == IFace.PackageStatus.PUBLISHED) {
    console.log(`package already published: ${data.address}/${data.packageName}`);

    throw new S3MoneyError(ErrorType.BadRequest, `package already published: ${data.address}/${data.packageName}`);
  }

  if (data.icon_url !== undefined) {
    data.icon_url = data.icon_url.trim();

    try {
      new URL(data.icon_url);
    }
    catch (e) {
      console.log(`invalid icon_url: ${data.icon_url}`);

      throw new S3MoneyError(ErrorType.BadRequest, `invalid icon_url: ${data.icon_url}`);
    }
    data.raw_icon_url = data.icon_url;
    data.icon_url = `option::some(url::new_unsafe_from_bytes(b"${data.icon_url}"))`;
  }
  else {
    data.icon_url = 'option::none()';
  }

  // if any roles are not sent, set them to the deployer's address
  const roleFields = Object.values(IFace.PackageRoles);
  const dataRoles = (data.roles as IFace.RoleMap) || {};

  for (const role of roleFields) {
    if (role in dataRoles && !isValidAddress(dataRoles[role])) {
      console.log(`invalid role address: ${dataRoles[role]}`);

      throw new S3MoneyError(ErrorType.BadRequest, `invalid role address: ${dataRoles[role]}`);
    }
    else if (!(role in dataRoles)) {
      dataRoles[role] = data.address;
    }
  }
  data.roles = dataRoles;

  // special case: mint and burn should be the same address
  if (data.roles['mint'] !== data.roles['burn']) {
    console.log(`mint and burn roles must be the same: ${data.roles['mint']}, ${data.roles['burn']}`);

    throw new S3MoneyError(
      ErrorType.BadRequest,
      `mint and burn roles must be the same: ${data.roles['mint']}, ${data.roles['burn']}`
    );
  }

  // special case: freeze and pause should be the same address
  if (data.roles['freeze'] !== data.roles['pause']) {
    console.log(`freeze and pause roles must be the same: ${data.roles['freeze']}, ${data.roles['pause']}`);

    throw new S3MoneyError(
      ErrorType.BadRequest,
      `freeze and pause roles must be the same: ${data.roles['freeze']}, ${data.roles['pause']}`
    );
  }

  // TODO: add more checks

  return { error: '', data: data };
}

export async function validCancel(data: IFace.IPackageCreated): Promise<IFace.IValid> {
  const stringFields = ['address', 'ticker'];

  for (const field of stringFields) {
    if (!(field in data)) {
      console.log(`missing field: ${field}`);

      throw new S3MoneyError(ErrorType.BadRequest, missingFieldErrorDetail(field));
    }
  }

  if (!isValidAddress(data.address)) {
    console.log(`invalid address: ${data.address}`);

    throw new S3MoneyError(ErrorType.BadRequest, invalidAddressErrorDetail(data.address));
  }

  if (!('created' in data) || typeof data.created !== 'boolean') {
    console.log('missing field: created');

    throw new S3MoneyError(ErrorType.BadRequest, missingFieldErrorDetail('created'));
  }

  if (data.created !== false) {
    console.log('created should be false');

    throw new S3MoneyError(ErrorType.BadRequest, 'created should be false');
  }

  const v = isValidTicker(data.ticker);

  if (v !== '') {
    console.log(v);

    return { error: v };
  }

  // downcase the package name and remove $
  data.packageName = tickerToPackageName(data.ticker);

  // cannot cancel a published package
  const pkg = await packageOps.getPackage(data.address, data.packageName);

  if (pkg !== null && pkg.deploy_status == IFace.PackageStatus.PUBLISHED) {
    console.log(`package already published: ${data.address}/${data.packageName}`);

    throw new S3MoneyError(ErrorType.BadRequest, `package already published: ${data.address}/${data.packageName}`);
  }

  return { error: '', data: data };
}

export async function validPublish(data: IFace.IPackageCreated): Promise<IFace.IValid> {
  const stringFields = ['address', 'ticker', 'txid', 'data'];

  for (const field of stringFields) {
    if (!(field in data)) {
      console.log(`missing field: ${field}`);

      throw new S3MoneyError(ErrorType.BadRequest, missingFieldErrorDetail(field));
    }
  }

  // if any roles are not sent, set them to the deployer's address
  const roleFields = Object.values(IFace.PackageRoles);
  const dataRoles = (data.packageRoles as IFace.RoleMap) || {};

  for (const role of roleFields) {
    if (role in dataRoles && !isValidAddress(dataRoles[role])) {
      console.log(`invalid role address: ${dataRoles[role]}`);

      throw new S3MoneyError(ErrorType.BadRequest, `invalid role address: ${dataRoles[role]}`);
    }
    else if (!(role in dataRoles)) {
      dataRoles[role] = data.address;
    }
  }
  data.packageRoles = dataRoles;

  if (!isValidAddress(data.address)) {
    console.log(`invalid address: ${data.address}`);

    throw new S3MoneyError(ErrorType.BadRequest, invalidAddressErrorDetail(data.address));
  }

  if (!('created' in data) || typeof data.created !== 'boolean') {
    console.log('missing field: created');

    throw new S3MoneyError(ErrorType.BadRequest, missingFieldErrorDetail('created'));
  }

  if (data.created !== true) {
    console.log('created should be true');

    throw new S3MoneyError(ErrorType.BadRequest, 'created should be true');
  }

  const v = isValidTicker(data.ticker);

  if (v !== '') {
    console.log(v);

    return { error: v };
  }

  // downcase the package name and remove $
  data.packageName = tickerToPackageName(data.ticker);

  const pkg = await packageOps.getPackage(data.address, data.packageName);

  if (pkg === null) {
    console.log(`package not created: ${data.address}/${data.packageName}`);

    throw new S3MoneyError(ErrorType.BadRequest, `package not created: ${data.address}/${data.packageName}`);
  }
  else if (pkg.deploy_status == IFace.PackageStatus.PUBLISHED) {
    console.log(`package already published: ${data.address}/${data.packageName}`);

    throw new S3MoneyError(ErrorType.BadRequest, `package already published: ${data.address}/${data.packageName}`);
  }

  if (typeof pkg.decimals !== 'number') {
    data.decimals = parseInt(pkg.decimals, 10);

    if (isNaN(data.decimals)) {
      console.log(`invalid decimals: ${pkg.decimals}`);

      throw new S3MoneyError(ErrorType.BadRequest, `invalid decimals: ${pkg.decimals}`);
    }
  }
  else {
    data.decimals = pkg.decimals;
  }

  data.initialSupply = pkg.initialSupply;
  data.maxSupply = pkg.maxSupply;

  return { error: '', data: data };
}

export async function validRelatedCreate(data: IFace.IRelationCreate): Promise<IFace.IValid> {
  const stringFields = ['label', 'address'];

  for (const field of stringFields) {
    if (!(field in data)) {
      console.log(`missing field: ${field}`);

      throw new S3MoneyError(ErrorType.BadRequest, missingFieldErrorDetail(field));
    }
  }

  if (data.label.trim() == '') {
    console.log('missing field: label');

    throw new S3MoneyError(ErrorType.BadRequest, missingFieldErrorDetail('label'));
  }

  if (!isValidAddress(data.address)) {
    console.log(`invalid address: ${data.address}`);

    throw new S3MoneyError(ErrorType.BadRequest, invalidAddressErrorDetail(data.address));
  }

  return { error: '', data: data };
}

export async function validRelatedDelete(data: IFace.IRelationDelete): Promise<IFace.IValid> {
  if (!('label' in data) || data.label == '') {
    console.log('missing field: label');

    throw new S3MoneyError(ErrorType.BadRequest, missingFieldErrorDetail('label'));
  }

  return { error: '', data: data };
}

export async function validRelatedModify(data: IFace.IRelationRename): Promise<IFace.IValid> {
  const stringFields = ['label', 'new_label'];

  if (!('label' in data) || data.label.trim() == '') {
    console.log('missing field: label');

    throw new S3MoneyError(ErrorType.BadRequest, missingFieldErrorDetail('label'));
  }

  return { error: '', data: data };
}

export function validIconRequest(data: IFace.IPackageIcon): IFace.IValid {
  const stringFields = ['address', 'fileName'];

  for (const field of stringFields) {
    if (!(field in data)) {
      console.log(`missing field: ${field}`);

      throw new S3MoneyError(ErrorType.BadRequest, missingFieldErrorDetail(field));
    }
  }

  if (!isValidAddress(data.address)) {
    console.log(`invalid address: ${data.address}`);

    throw new S3MoneyError(ErrorType.BadRequest, invalidAddressErrorDetail(data.address));
  }

  return { error: '', data: data };
}

export function isValidAddress(address: string): boolean {
  if (!isValidSuiAddress(address)) {
    return false;
  }

  // check for all zeros -- 0x0, etc.
  const allzeros = /^0+$/;

  if (allzeros.test(address)) {
    return false;
  }

  return true;
}

export function isValidPackage(objectId: string): boolean {
  return isValidSuiObjectId(objectId);
}

export function isValidTicker(ticker: string): string {
  if (ticker == '' || ticker == '$' || ticker.length > 6) {
    return `invalid ticker name: ${ticker}`;
  }

  if (!ticker.startsWith('$')) {
    return `ticker must start with $: ${ticker}`;
  }

  // check for invalid characters
  if (!TICKER_REGEX.test(ticker.substring(1))) {
    return `ticker must be alphanumeric with no special characters: ${ticker}`;
  }

  if (RESERVED_TICKERS.includes(ticker)) {
    return `ticker name cannot be ${ticker}`;
  }

  return '';
}

export function isValidDigest(digest: string): boolean {
  return isValidTransactionDigest(digest);
}

export function isValidDateRange(range: string): boolean {
  const validSuffixes = ['d', 'm', 'y'];
  const maxNums: Record<string, number> = { d: 31, m: 12, y: 10 }; // revisit if needed

  if (range === undefined || range === null) {
    return false;
  }

  range = range.toLowerCase().trim();

  if (range === '') {
    return false;
  }

  const suffix = range.slice(-1);

  if (!validSuffixes.includes(suffix)) {
    return false;
  }

  const num = parseInt(range.slice(0, -1), 10);

  if (isNaN(num)) {
    return false;
  }

  if (num < 1 || num > maxNums[suffix]) {
    return false;
  }

  return true;
}
