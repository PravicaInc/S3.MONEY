import {Router} from 'express'
import {handleGetHoldings} from '../lib'
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
// eof
