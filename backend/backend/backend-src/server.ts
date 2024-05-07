/**
 * @file Entry point for the API server.
 */

import cors from 'cors';
import express, { Express, Request } from 'express';
import swaggerUi from 'swagger-ui-express';

import { TOKEN_SUPPLY_PATH } from './constants';
import * as events from './lib/events';
import docs from './docs';
import { S3MoneyError } from './interfaces/error';
import * as holdings from './lib/holdings';
import * as packages from './lib/packages';
import * as relations from './lib/relations';
import * as txvol from './lib/txvol';
import {
  createEventsRouter,
  createHoldingsRouter,
  createPackagesRouter,
  createRelationsRouter,
  createTxVolRouter,
} from './routes';

const PORT = process.env.PORT || 3000;
const app: Express = express();

const CWD = process.cwd();
const TOKEN_PATH = `${CWD}/${TOKEN_SUPPLY_PATH}`;
const WORK_DIR = process.env.WORK_DIR || `${CWD}/contracts`;

declare module 'express-serve-static-core' {
  export interface Request {
    tokenPath: string
    workDir: string
  }
}

app.use(express.json());
app.use(cors());
app.options('*', cors());

app.use((req: Request, res, next) => {
  req.tokenPath = TOKEN_PATH;
  req.workDir = WORK_DIR;
  next();
});

app.get('/', (req, res) => res.redirect('/status'));

app.get('/status', (req, res) => res.send({ status: 'ok' }).json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(docs));

app.use(
  '/v2',
  (() => {
    const router = express.Router();

    router.use('/packages', createPackagesRouter());
    router.use('/related', createRelationsRouter());
    router.use('/events', createEventsRouter());
    router.use('/txvol', createTxVolRouter());
    router.use('/holdings', createHoldingsRouter());

    return router;
  })()
);

// creating packages
app.post('/create', packages.handleCreate);
app.post('/cancel', packages.handleCancel);
app.post('/published', packages.handlePublished);
app.post('/generateIconURL', packages.handleIconUrlRequest);

// getting packages
app.get('/packages/:address', packages.handleGetPackages);
app.get('/packages/:address/:param', packages.handleGetFilteredPackages);

// creating wallet relationships
app.get('/related/:pkgAddress', relations.handleGetRelations);
app.post('/related/:pkgAddress', relations.handleCreateRelation);
// implemented, but not part of the current deliverable
// app.delete('/related/:pkgAddress/:slug', relations.handleDeleteRelation)
app.patch('/related/:pkgAddress/:slug', relations.handleRenameRelation);

// events and balances
app.get('/package-events/:address/:ticker', events.handleGetPackageEvents);
app.get('/address-events/:address', events.handleGetAddressEvents);
app.get('/balances/:address', events.handleGetBalances);
app.get('/allocations/:address/:ticker', events.handleGetAllocations);

// balances in buckets (0-1k, etc.) over time
app.get('/holdings/:address/:ticker', holdings.handleGetHoldings);

// transaction volumes
app.get('/txvol/:address/:ticker', txvol.handleGetTxVol);

// for dev/testing and as a heartbeat
app.get('/t/env', async (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// 404 in json
app.use((_, res) => {
  res.status(404).json({
    error: 404,
    message: '404 Not Found',
  });
});

// Error handling middleware
app.use(((error, req, res, next) => {
  if (error instanceof S3MoneyError) {
    res.status(error.errorCode);
    res.json({ error: error.errorMessage, detail: error.details }).end();
  }
  else {
    res.status(500);
    res.json({ error: error.toString(), stack: (error as Error).stack }).end();
  }
}) as express.ErrorRequestHandler);

app.listen(PORT, () => {
  console.log(`[server]: Server is running at port ${PORT}`);
});
