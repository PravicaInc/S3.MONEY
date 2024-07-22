import { FC, HTMLAttributes } from 'react';
import { useCurrentWallet } from '@mysten/dapp-kit';

import { useShortAccountAddress } from '../../hooks/useShortAccountAddress.ts';
import { AppLogo } from '../Logo';
import { LogoutButton } from '../LogoutButton';

import styles from './styles.module.css';

export const AppHeader: FC<HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  const shortAccountAddress = useShortAccountAddress();
  const { isConnected } = useCurrentWallet();

  return (
    <div
      className={`${styles.container} ${className}`}
      style={{ justifyContent: isConnected ? 'space-between' : 'center' }}
      {...props}
    >
      <AppLogo />
      {shortAccountAddress && <LogoutButton />}
    </div>
  );
};
