/**
 * @file Handlers related to events and balances.
 */

import {Request, Response, Router} from 'express'
import * as Checks from './checks'
import * as dbEvents from './db/events'

export function createEventsRouter(): Router {
  const router = Router()
  router.get('/:address/:ticker', async (req, res, next) => {
    try {
      await handleGetPackageEvents(req, res)
    } catch (error) {
      next(error)
    }
  })
  router.get('/:address/:ticker', handleGetPackageEvents)
  router.get('/:address', async (req, res, next) => {
    try {
      await handleGetAddressEvents(req, res)
    } catch (error) {
      next(error)
    }
  })
  router.get('/balances/:address', async (req, res, next) => {
    try {
      await handleGetBalances(req, res)
    } catch (error) {
      next(error)
    }
  })
  router.get('/allocations/:address/:ticker', async (req, res, next) => {
    try {
      await handleGetAllocations(req, res)
    } catch (error) {
      next(error)
    }
  })

  return router
}

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

export async function handleGetAllocations(req: Request, res: Response) {
  const {address, ticker} = req.params
  if (Checks.isValidPackage(address)) {
    res.status(200).json({
      status: 'ok',
      events: await dbEvents.getAllocations(address, ticker),
    })
  } else {
    res.status(400).json({
      status: 'error',
      message: `invalid address: ${address}`,
    })
  }
}

export async function handleGetPackageEvents(req: Request, res: Response) {
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
