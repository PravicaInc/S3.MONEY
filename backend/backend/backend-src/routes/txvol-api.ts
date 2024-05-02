import {Router} from 'express'
import { handleGetTxVol } from '../lib'

export function createTxVolRouter(): Router {
  const router = Router()
  router.get('/:address/:ticker', async (req, res, next) => {
    try {
      await handleGetTxVol(req, res)
    } catch (error) {
      next(error)
    }
  })
  return router
}

// eof
