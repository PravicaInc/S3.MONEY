import * as child from 'child_process'
import fs from 'fs'
import path from 'path'
import express, {Express, Request} from 'express'
import cors from 'cors'
import ejs from 'ejs'

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

// TODO: use this properly, for type checking
interface ICreatePackageRequest {
  // creator's address
  address: string
  // coin metadata
  ticker: string // short name, usually five or fewer characters (uppercase)
  decimals: number
  name: string
  icon_url?: string
  // for supply-constrainted contracts
  initialSupply?: string // can be "0"
  maxSupply?: string // can be "0"
  // set internally
  packageName?: string
  description?: string
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
  const stringFields = ['ticker', 'name', 'decimals'] // , "address"];

  for (const field of stringFields) {
    if (!(field in data)) {
      console.log(`missing field: ${field}`)
      return false
    }
  }

  if (data.decimals < 0 || data.decimals > 8) {
    console.log(`wrong number of decimals: ${data.decimals}`)
    return false
  }

  // upcase the ticker
  data.ticker = data.ticker.toUpperCase().trim()

  if (data.ticker == '' || data.ticker == '$' || data.ticker.length > 6) {
    console.log(`invalid ticker name: ${data.ticker}`)
    return false
  }

  if (!data.ticker.startsWith('$')) {
    console.log(`ticker must start with $: ${data.ticker}`)
    return false
  }

  // downcase the package name and remove $
  data.packageName = data.ticker.toLowerCase().trim().substring(1)
  data.description = data.name

  data.initialSupply = data.initialSupply || '0'
  data.maxSupply = data.maxSupply || '0'

  const path = `${WORK_DIR}/${data.packageName}`
  if (fs.existsSync(path)) {
    console.log(`package directory already exists: ${data.packageName}`)
    return false
  }

  // TODO: add more checks

  return true
}

function createPackage(data: ICreatePackageRequest) {
  let token: string = TOKEN_SUPPLY

  const packagePath = `${WORK_DIR}/${data.packageName}`
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
    } else if (fname === 'token_test.move') {
      TOut = `${packagePath}/sources/${data.packageName}_test.move`
    }

    const merged = ejs.render(TIn, data)
    fs.writeFileSync(TOut, merged)
    console.log(`wrote to ${TOut}`)
  }

  // FIXME: this should be serialized
  const ret = child.execSync(`sui move build --dump-bytecode-as-base64`, {
    cwd: packagePath,
    encoding: 'utf-8',
  })

  const {modules, dependencies} = JSON.parse(ret)

  return {modules, dependencies}
}
