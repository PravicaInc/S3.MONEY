import { ButtonHTMLAttributes, FC, useCallback } from 'react';
import { useCurrentAccount, useCurrentWallet, useDisconnectWallet } from '@mysten/dapp-kit';

import LogoutIcon from '../../assets/logout.svg?react';
import { useShortAccountAddress } from '../../hooks/useShortAccountAddress.ts';
import { Avatar } from '../Avatar';
import { Typography } from '../Typography';

import { LogoutModal } from './LogoutModal';

import styles from './styles.module.css';

export const LogoutButton: FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({ className, ...props }) => {
  const account = useCurrentAccount();
  const { currentWallet, connectionStatus } = useCurrentWallet();
  const shortAccountAddress = useShortAccountAddress();
  const disconnectWallet = useDisconnectWallet();

  const disconnect = useCallback(async () => {
    await disconnectWallet.mutateAsync();
  }, [disconnectWallet]);

  return (
    <>
      {shortAccountAddress && (
        <LogoutModal inProcess={connectionStatus === 'disconnected'} onProceed={disconnect}>
          {({ showModal }) => (
            <button className={`${styles.button} ${className}`} onClick={showModal} {...props}>
              <Avatar
                src={account?.icon || currentWallet?.icon}
                initials={{ text: account?.label || shortAccountAddress }}
              />
              <Typography style={{ color: 'inherit' }} type={'t_sm-500'}>
                {account?.label || shortAccountAddress}
              </Typography>
              <LogoutIcon />
            </button>
          )}
        </LogoutModal>
      )}
    </>
  );
};
