import * as child from 'child_process'
import fs from 'fs'
import path from 'path'
import express, {Express, Request} from 'express'
import cors from 'cors'
import ejs from 'ejs'

const CWD = process.cwd()
const WORK_DIR = process.env.WORK_DIR || `${CWD}/contracts`
const SIMPLE_COIN = `${CWD}/coin_template/simple_coin`

// templates
const TMoveToml = fs.readFileSync(`${SIMPLE_COIN}/Move.toml`, {
  encoding: 'utf-8',
})
const TCoin = fs.readFileSync(`${SIMPLE_COIN}/sources/simplecoin.move`, {
  encoding: 'utf-8',
})

const port = process.env.PORT || 3000
const app: Express = express()

app.use(express.json())
app.use(cors())
app.options('*', cors())

app.get('/', (req, res) => {
  return res.send({status: 'ok'}).json()
})

// TODO: use this properly, for type checking
interface ICreatePackageRequest {
  // creator's address
  address: string
  // package metadata
  packageName: string
  // coin metadata
  symbol: string // short name, usually five or fewer characters (uppercase)
  name?: string // longer name, optional, set to short name if not present
  description: string
  decimals: number
  icon_url?: string
}

app.post('/create', async (req: Request<{}, {}, ICreatePackageRequest>, res) => {
  if (valid(req.body)) {
    let r = createPackage(req.body)
    res.status(200).json({
      status: 'ok',
      ...r,
    })
  } else {
    res.status(400).json({
      error: 400,
      message: 'Missing data to create coin',
    })
  }
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

function valid(data: ICreatePackageRequest): boolean {
  const stringFields = ['packageName', 'symbol', 'description']

  for (const field of stringFields) {
    if (!(field in data)) {
      console.log(`missing field: ${field}`)
      return false
    }
  }

  if (data.decimals < 0 || data.decimals > 6) {
    console.log(`wrong number of decimals: ${data.decimals}`)
    return false
  }

  if (data.symbol == '' || data.symbol.length > 5) {
    console.log(`invalid symbol name: ${data.symbol}`)
    return false
  }

  const path = `${WORK_DIR}/${data.packageName}`
  if (fs.existsSync(path)) {
    console.log(`package directory already exists: ${data.packageName}`)
    return false
  }

  // TODO: add more checks

  return true
}

function createPackage(data: ICreatePackageRequest) {
  const packagePath = `${WORK_DIR}/${data.packageName}`

  let path = `${packagePath}/sources`
  fs.mkdirSync(path, {recursive: true})
  console.log(`created ${path}`)

  path = `${packagePath}/Move.toml`
  const move = ejs.render(TMoveToml, data)
  fs.writeFileSync(path, move)
  console.log(`wrote to ${path}`)

  path = `${packagePath}/sources/${data.packageName}.move`
  const coin = ejs.render(TCoin, data)
  fs.writeFileSync(path, coin)
  console.log(`wrote to ${path}`)

  // FIXME: this should be serialized
  const ret = child.execSync(`sui move build --dump-bytecode-as-base64`, {
    cwd: packagePath,
    encoding: 'utf-8',
  })

  const {modules, dependencies} = JSON.parse(ret)

  return {modules, dependencies}
}
