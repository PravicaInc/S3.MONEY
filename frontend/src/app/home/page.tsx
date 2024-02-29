'use client';

import { ConnectButton, useWallet } from '@suiet/wallet-kit';

export default function HomePage() {
  const wallet = useWallet();

  return (
    <div className="flex items-center justify-center h-full">
      {
        wallet.connected
          ? (
            <>
              Select Stablecoin
            </>
          )
          : (
            <div className="border-2 rounded-lg px-20 py-12">
              <div className="flex items-center justify-center gap-7">
                <div>
                  <u className="text-8xl">
                    S
                  </u>
                  <sup className="text-4xl relative -top-16">
                    3
                  </sup>
                </div>
                <p className="text-3xl">
                  <u>
                    S
                  </u>
                  tableCoin
                  <br />
                  <u>
                    S
                  </u>
                  tudio on
                  <br />
                  <u>
                    S
                  </u>
                  ui
                </p>
              </div>
              <p className="text-center">
                _____________________________
                <br />
                _____________________________
                <br />
                _____________________________
                <br />
                _____________________________
                <br />
                _____________________________
                <br />
                _____________________________
                <br />
              </p>
              <ConnectButton className="mt-14">
                Connect SUI Wallet
              </ConnectButton>
            </div>
          )
      }
    </div>
  );
}
