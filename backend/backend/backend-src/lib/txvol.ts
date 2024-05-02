/**
 * @file Handlers related to transaction volumes.
 */

import {Request, Response} from 'express'
import * as Checks from './checks'
import * as dbTxVol from '../db/txvol'
import {tickerToPackageName} from './utils'

/**
 * Handler that returns a list of transaction volumes by period.
 *
 * @param {Request} req
 * @param {Response} res
 */
export async function handleGetTxVol(req: Request, res: Response) {
  const {address, ticker} = req.params
  const {range} = req.query
  const a = Checks.isValidAddress(address)
  const r = Checks.isValidDateRange(range as string)
  if (a && r) {
    res.status(200).json({
      status: 'ok',
      addressPackage: `${address}::${tickerToPackageName(ticker)}`,
      volumes: await dbTxVol.getTxVol(address, ticker, range as string),
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
