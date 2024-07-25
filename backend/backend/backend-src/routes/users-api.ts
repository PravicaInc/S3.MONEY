import { Router } from 'express';

import { handleGenerateNonce, handleVerifySignature } from '../lib';
import { Ed25519Keypair as Keypair } from '@mysten/sui.js/keypairs/ed25519';

export function createUsersRouter(): Router {
  const router = Router();
  router.get('/getNonce/:address', async (req, res, next) => {
    try {
      handleGenerateNonce(req, res);
    } catch (error) {
      next(error);
    }
  });

  router.post('/authenticate', async (req, res, next) => {
    try {
      handleVerifySignature(req, res);
    } catch (error) {
      next(error);
    }
  });

  // These endpoints are for testing purposes only.
  let keypair: Keypair | null = null;
  router.get('/keypair', async (req, res, next) => {
    try {
      keypair = Keypair.generate();
      res
        .json({ publicKey: keypair.getPublicKey().toSuiAddress() })
        .status(200);
    } catch (error) {
      next(error);
    }
  });

  router.get('/sign/:nonce', async (req, res, next) => {
    try {
      const { nonce } = req.params;
      const message = new TextEncoder().encode(nonce);
      if (keypair === null) {
        res
          .status(400)
          .json({
            status: 'error',
            message: 'No keypair generated, call /keypair first',
          });
      }
      const { signature } = await keypair!.signPersonalMessage(message);
      res.json({ signature }).status(200);
    } catch (error) {
      next(error);
    }
  });

  return router;
}
