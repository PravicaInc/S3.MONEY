import { FC } from 'react';
import { Link } from 'react-router-dom';
import { useSuiClientContext } from '@mysten/dapp-kit';

import LogoIcon from '../../assets/logo.svg?react';
import { PAGES_URLS } from '../../utils/const.ts';
import { Typography } from '../Typography';

import styles from './styles.module.css';

export const AppLogo: FC = () => {
  const suiClientContext = useSuiClientContext();

  return (
    <Link className={styles.container} to={PAGES_URLS.home}>
      <LogoIcon />
      {['testnet', 'devnet'].includes(suiClientContext.network) && (
        <Typography className={styles.text} style={{ color: 'var(--base)' }} type={'t_xss-700'}>
          {suiClientContext.network}
        </Typography>
      )}
    </Link>
  );
};
