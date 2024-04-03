/**
 * @file Handlers related to events and balances.
 */

import {Request, Response} from 'express'
import * as Checks from './checks'
import * as dbEvents from './db/events'

export async function handleGetBalances(req: Request, res: Response) {
  const {address} = req.params
  if (Checks.isValidAddress(address)) {
    res.status(200).json({
      status: 'ok',
      balances: await dbEvents.getBalances(address),
    })
  } else {
    res.status(400).json({
      status: 'error',
      message: `invalid address: ${address}`,
    })
  }
}

export async function HandleGetPackageEvents(req: Request, res: Response) {
  const {address, ticker} = req.params
  if (Checks.isValidPackage(address)) {
    res.status(200).json({
      status: 'ok',
      events: await dbEvents.getPackageEvents(address, ticker),
    })
  } else {
    res.status(400).json({
      status: 'error',
      message: `invalid address: ${address}`,
    })
  }
}

export async function handleGetAddressEvents(req: Request, res: Response) {
  const {address} = req.params
  if (Checks.isValidAddress(address)) {
    res.status(200).json({
      status: 'ok',
      events: await dbEvents.getAddressEvents(address),
    })
  } else {
    res.status(400).json({
      status: 'error',
      message: `invalid address: ${address}`,
    })
  }
}

// eof
