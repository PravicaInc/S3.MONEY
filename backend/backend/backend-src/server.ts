/**
 * @file Entry point for the API server.
 */

import cors from 'cors'
import express, {Express, Request} from 'express'

import {TOKEN_SUPPLY_PATH} from './constants'
import * as events from './lib/events'
import * as packages from './lib/packages'
import * as relations from './lib/relations'

const PORT = process.env.PORT || 3000
const app: Express = express()

const CWD = process.cwd()
const TOKEN_PATH = `${CWD}/${TOKEN_SUPPLY_PATH}`
const WORK_DIR = process.env.WORK_DIR || `${CWD}/contracts`

declare module 'express-serve-static-core' {
  export interface Request {
    tokenPath: string
    workDir: string
  }
}

app.use(express.json())
app.use(cors())
app.options('*', cors())

app.use((req: Request, res, next) => {
  req.tokenPath = TOKEN_PATH
  req.workDir = WORK_DIR
  next()
})

app.get('/', (req, res) => {
  return res.send({status: 'ok'}).json()
})

// creating packages
app.post('/create', packages.handleCreate)
app.post('/cancel', packages.handleCancel)
app.post('/published', packages.handlePublished)
app.post('/generateIconURL', packages.handleIconUrlRequest)

// getting packages
app.get('/packages/:address', packages.handleGetPackages)
app.get('/packages/:address/:param', packages.handleGetFilteredPackages)

// creating wallet relationships
app.get('/related/:pkgAddress', relations.handleGetRelations)
app.post('/related/:pkgAddress', relations.handleCreateRelation)
app.delete('/related/:pkgAddress/:slug', relations.handleDeleteRelation)
app.patch('/related/:pkgAddress/:slug', relations.handleRenameRelation)

// events and balances
app.get('/package-events/:address/:ticker', events.handleGetPackageEvents)
app.get('/address-events/:address', events.handleGetAddressEvents)
app.get('/balances/:address', events.handleGetBalances)

// for dev/testing and as a heartbeat
app.get('/t/env', async (req, res) => {
  res.status(200).json({
    status: 'ok',
    env: JSON.stringify(process.env, null, 2),
  })
})

// 404 in json
app.use((_, res) => {
  res.status(404).json({
    error: 404,
    message: '404 Not Found',
  })
})

app.listen(PORT, () => {
  console.log(`[server]: Server is running at port ${PORT}`)
})
