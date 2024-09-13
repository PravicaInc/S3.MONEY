import { ButtonHTMLAttributes, FC, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAutoConnectWallet, useConnectWallet, useDisconnectWallet, useWallets } from '@mysten/dapp-kit';

import { PAGES_URLS, WALLETS } from '../../utils/const.ts';
import { Button } from '../Button';

import { SignInModal } from './SignInModal';

export const WalletConnectButton: FC<ButtonHTMLAttributes<HTMLButtonElement>> = props => {
  const [error, setError] = useState<string>();
  const navigate = useNavigate();
  const wallets = useWallets();
  const connectWallet = useConnectWallet();
  const disconnectWallet = useDisconnectWallet();
  const autoConnectionStatus = useAutoConnectWallet();

  const isLoading = useMemo(() => autoConnectionStatus === 'idle', [autoConnectionStatus]);

  const onConnect = async () => {
    const suiWallet = wallets.find(({ name }) => name === WALLETS.SuiWallet);

    if (suiWallet) {
      const connectedAccounts = await connectWallet.mutateAsync({
        wallet: suiWallet,
      });

      if (connectedAccounts.accounts.length > 1 || (connectedAccounts.accounts[0].label || '').length > 0) {
        const errorMessage = 'Whoops! Looks like you\'re trying to connect with a ZK wallet.'
            + ' S3.money currently works only with Passphrase wallets. Try Again!';

        setError(errorMessage as string);
        await disconnectWallet.mutateAsync();

        throw errorMessage;
      }
      navigate(PAGES_URLS.home);
    }
  };

  return (
    <SignInModal error={error} inProcess={isLoading} onProceed={onConnect}>
      {({ showModal }) => (
        <Button onClick={showModal} disabled={props.disabled || isLoading} {...props} />
      )}
    </SignInModal>);
};
