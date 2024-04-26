/**
 * @file Handlers related to balance holdings over time.
 */

import {Request, Response, Router} from 'express'
import * as Checks from './checks'
import * as dbHoldings from './db/holdings'
import {HOLDINGS_BUCKETS} from '../constants'
import {tickerToPackageName} from './utils'

export function createHoldingsRouter(): Router {
  const router = Router()
  router.get('/:address/:ticker', async (req, res, next) => {
    try {
      await handleGetHoldings(req, res)
    } catch (error) {
      next(error)
    }
  })
  return router
}

/**
 * Handler that returns a list of holdings by period.
 *
 * @param {Request} req
 * @param {Response} res
 */
export async function handleGetHoldings(req: Request, res: Response) {
  const {address, ticker} = req.params
  const {range} = req.query
  const a = Checks.isValidAddress(address)
  const r = Checks.isValidDateRange(range as string)
  if (a && r) {
    res.status(200).json({
      status: 'ok',
      addressPackage: `${address}::${tickerToPackageName(ticker)}`,
      fields: HOLDINGS_BUCKETS,
      holdings: await dbHoldings.getHoldings(address, ticker, range as string),
    })
  } else if (!a) {
    res.status(400).json({
      status: 'error',
      message: `invalid address: ${address}`,
    })
  } else {
    res.status(400).json({
      status: 'error',
      message: `invalid range: ${range}`,
    })
  }
}

// eof
