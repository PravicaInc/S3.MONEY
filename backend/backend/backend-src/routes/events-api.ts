/**
 * @file Handlers related to events and balances.
 */

import {Router} from 'express'
import {handleGetAddressEvents, handleGetAllocations, handleGetBalances, handleGetPackageEvents} from '../lib'

export function createEventsRouter(): Router {
  const router = Router()

  router.get('/balances/:address', async (req, res, next) => {
    try {
      await handleGetBalances(req, res)
    } catch (error) {
      next(error)
    }
  })

  router.get('/:address/:ticker', async (req, res, next) => {
    try {
      await handleGetPackageEvents(req, res)
    } catch (error) {
      next(error)
    }
  })

  router.get('/:address', async (req, res, next) => {
    try {
      await handleGetAddressEvents(req, res)
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
// eof
