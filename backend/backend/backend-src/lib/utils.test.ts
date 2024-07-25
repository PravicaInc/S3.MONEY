import { Ed25519Keypair as Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { generateNonce, getPublicKeyFromSignedMessage } from './utils';

describe('users signature verification', () => {
  it('verify signature', async () => {
    const keypair = Keypair.generate();
    const suiAddress = keypair.getPublicKey().toSuiAddress();
    const nonce = generateNonce(suiAddress);
    const message = new TextEncoder().encode(nonce);
    const { signature } = await keypair.signPersonalMessage(message);
    const result = await getPublicKeyFromSignedMessage(nonce, signature);
    expect(result).toBe(suiAddress);
  });
});
