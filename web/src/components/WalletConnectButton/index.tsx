import { ButtonHTMLAttributes, FC, useCallback } from "react";
import { useConnectWallet, useWallets } from "@mysten/dapp-kit";
import { WALLETS } from "../../utils/const.ts";
import { Button } from "../Button";

export interface WalletConnectButton extends ButtonHTMLAttributes<HTMLButtonElement> {
  onConnectSuccess?: (walletName: string) => void;
  onConnectError?: (error: unknown) => void;
  isLoading: boolean;
}

export const WalletConnectButton: FC<WalletConnectButton> = ({ onConnectSuccess, onConnectError, ...props }) => {
  const wallets = useWallets();
  const connectWallet = useConnectWallet();

  const onConnect = useCallback(async () => {
    try {
      const suiWallet = wallets.find(({ name }) => name === WALLETS.SuiWallet);

      if (suiWallet) {
        await connectWallet.mutateAsync({
          wallet: suiWallet,
        });

        if (onConnectSuccess) {
          onConnectSuccess(suiWallet?.name);
        }
      }
    } catch (err) {
      if (onConnectError) {
        onConnectError(err);
      }
    }
  }, [connectWallet, wallets, onConnectSuccess, onConnectError]);

  return <Button onClick={onConnect} {...props} />;
};
