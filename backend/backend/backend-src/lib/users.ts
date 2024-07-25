import { verifyPersonalMessage } from '@mysten/sui.js/verify';
import { generateNonce, verifySignature } from './utils';
import { Request, Response } from 'express';
import { saveValue } from '../store/cache';

const nonceMap = new Map<string, string>();
function getNonceFomServer(address: string): string {
  const nonce = generateNonce(address);
  saveValue(nonce, address);
  return nonce;
}

export function handleGenerateNonce(req: Request, res: Response) {
  try {
    const { address } = req.params;
    const nonce = getNonceFomServer(address);
    res.status(200).json({
      status: 'ok',
      nonce,
    });
  } catch (error) {
    // Remove the type annotation from the catch clause variable.
    res.status(400).json({
      status: 'error',
      message: (error as Error).message,
    });
  }
}

export async function handleVerifySignature(req: Request, res: Response) {
  try {
    const { nonce, signature } = req.body;
    const result = await verifySignature(nonce, signature);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(400).json({
        status: 'error',
        message: 'invalid signature',
      });
    }
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: (error as Error).message,
    });
  }
}
