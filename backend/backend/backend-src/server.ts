import * as child from 'child_process'
import fs from 'fs'
import express, {Express, Request} from 'express'
import cors from 'cors'
import ejs from 'ejs'

import * as IFace from './lib/interfaces'
import * as Checks from './lib/checks'
import * as AWS from './lib/aws'

const CWD = process.cwd()
const WORK_DIR = process.env.WORK_DIR || `${CWD}/contracts`

// simple token template
const TOKEN_SIMPLE = `${CWD}/coin_template/token1`
// supply-constrained token template
const TOKEN_SUPPLY = `${CWD}/coin_template/token2`

const port = process.env.PORT || 3000
const app: Express = express()

app.use(express.json())
app.use(cors())
app.options('*', cors())

app.get('/', (req, res) => {
  return res.send({status: 'ok'}).json()
})

app.post('/create', async (req: Request<{}, {}, IFace.ICreatePackageRequest>, res) => {
  const v = await Checks.validCreate(req.body)
  if (v.error === '') {
    let r = await createPackage(v.data! as IFace.ICreatePackageRequest)
    if (r.error === '') {
      res.status(200).json({
        status: 'ok',
        ...r,
      })
    } else {
      res.status(400).json({
        status: 'error',
        message: r.error,
      })
    }
  } else {
    res.status(400).json({
      error: 400,
      message: v.error, // 'Missing data to create coin',
    })
  }
})

app.post('/cancel', async (req: Request<{}, {}, IFace.IPackageCreated>, res) => {
  const v = await Checks.validCancel(req.body)
  if (v.error === '') {
    await deletePackage(v.data! as IFace.IPackageCreated)
    res.status(200).json({status: 'ok', message: 'deleted'})
  } else {
    res.status(400).json({
      status: 'error',
      message: v.error,
    })
  }
})

app.post('/published', async (req: Request<{}, {}, IFace.IPackageCreated>, res) => {
  const v = await Checks.validPublish(req.body)
  if (v.error === '') {
    await savePackage(v.data! as IFace.IPackageCreated)
    res.status(200).json({status: 'ok', message: 'saved'})
  } else {
    res.status(400).json({
      error: 400,
      message: v.error,
    })
  }
})

app.get('/packages/:address', async (req, res) => {
  const {address} = req.params
  const summary = 'summary' in req.query

  const v = Checks.validAddress(address)
  if (v.error === '') {
    res.status(200).json({status: 'ok', packages: await packageData(address, summary)})
  } else {
    res.status(400).json({
      error: 400,
      message: v.error,
    })
  }
})

// for dev/testing
app.get('/t/env', async (req, res) => {
  res.status(200).json({status: 'ok', env: JSON.stringify(process.env, null, 2)})
})

// 404 in json
app.use((_, res) => {
  res.status(404).json({
    error: 404,
    message: '404 Not Found',
  })
})

app.listen(port, () => {
  console.log(`[server]: Server is running at port ${port}`)
})

/* Operations */

async function createPackage(data: IFace.ICreatePackageRequest) {
  let token: string = TOKEN_SUPPLY

  const packagePath = `${WORK_DIR}/${data.address}/${data.packageName}`
  const TMoveToml = fs.readFileSync(`${token}/Move.toml`, {
    encoding: 'utf-8',
  })
  const TFiles = fs.readdirSync(`${token}/sources/`).filter(name => name.endsWith('.move'))

  let path = `${packagePath}/sources`
  fs.mkdirSync(path, {recursive: true})
  console.log(`created ${path}`)

  path = `${packagePath}/Move.toml`

  const move = ejs.render(TMoveToml, data)
  fs.writeFileSync(path, move)
  console.log(`wrote to ${path}`)

  for (const fname of TFiles) {
    const TIn = fs.readFileSync(`${token}/sources/${fname}`, {
      encoding: 'utf-8',
    })

    let TOut = `${packagePath}/sources/${fname}`

    // special case: token.move -> <packageName>.move
    // same with test
    if (fname === 'token.move') {
      TOut = `${packagePath}/sources/${data.packageName}.move`
    } else if (fname === 'token_tests.move') {
      TOut = `${packagePath}/sources/${data.packageName}_tests.move`
    }

    const merged = ejs.render(TIn, data)
    fs.writeFileSync(TOut, merged)
    console.log(`wrote to ${TOut}`)
  }

  // FIXME: this should be serialized
  let ret
  try {
    ret = child.execSync(`sui move build --dump-bytecode-as-base64`, {
      cwd: packagePath,
      encoding: 'utf-8',
    })
  } catch (e: any) {
    console.log(e)
    fs.rmSync(packagePath, {recursive: true})
    return {modules: '', dependencies: '', error: e.toString()}
  }

  const {modules, dependencies} = JSON.parse(ret)

  console.log('about to save to db')

  await AWS.savePackageDB(IFace.reqToCreated(data), IFace.PackageStatus.CREATED)

  return {modules, dependencies, error: ''}
}

async function deletePackage(data: IFace.IPackageCreated) {
  const path = `${WORK_DIR}/${data.address}/${data.packageName}`
  await fs.rmSync(path, {recursive: true})
  await AWS.deletePackageDB(data.address, data.packageName!)
}

async function savePackage(data: IFace.IPackageCreated) {
  await AWS.savePackageDB(data, IFace.PackageStatus.PUBLISHED)
}

async function packageData(address: string, summary: boolean) {
  return await AWS.listPackagesDB(address, summary)
}
