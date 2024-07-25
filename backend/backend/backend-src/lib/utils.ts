import { createHmac, randomBytes } from 'crypto';
import { getValue } from '../store/cache';
import { verifyPersonalMessage } from '@mysten/sui.js/verify';
import jwt from 'jsonwebtoken';
import { stat } from 'fs';

/**
 * Convert smart contract ticker to package name.
 *
 * @param {string} ticker - smart contract ticker, e.g. $SUI
 * @returns {string} - package name, e.g. sui
 */
export function tickerToPackageName(ticker: string): string {
  return ticker.toLowerCase().trim().slice(1);
}

export function generateNonce(address: string): string {
  const serverSecrect = process.env.SERVER_SECRET;
  if (serverSecrect === undefined) {
    throw new Error('SERVER_SECRET is not set');
  }
  const buffer = randomBytes(16);
  const nonce = createHmac('sha256', serverSecrect)
    .update(buffer)
    .digest('hex');
  return nonce;
}

export async function getPublicKeyFromSignedMessage(
  nonce: string,
  signature: string
) {
  const message = new TextEncoder().encode(nonce);
  const publicKey = await verifyPersonalMessage(message, signature);
  return publicKey.toSuiAddress();
}

export async function verifySignature(nonce: string, signature: string) {
  const address = getValue(nonce);
  if (!address) {
    throw new Error('Nonce not found');
  }
  const publicKey = await getPublicKeyFromSignedMessage(nonce, signature);
  if (publicKey === address) {
    const jwtSecret = process.env.JWT_SECRET;
    if (jwtSecret === undefined) {
      throw new Error('JWT_SECRET is not set');
    }
    return { status: 'ok', token: jwt.sign({ address }, jwtSecret) };
  } else {
    throw new Error('Invalid signature');
  }
}

// eof
