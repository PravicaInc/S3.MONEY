import { FC } from 'react';

import SignInIcon from '../../assets/sign-in.svg?react';
import Pattern from '../../assets/sign-in-pattern.svg?react';
import { Button } from '../../components/Button';
import { Typography } from '../../components/Typography';
import { WalletConnectButton } from '../../components/WalletConnectButton';

import { Swiper } from './Swiper';

import styles from './styles.module.css';

const SignIn: FC = () => (
  <div className={styles.container}>
    <Pattern className={styles.pattern1} />
    <Pattern className={styles.pattern2} />
    <div style={{ width: '40%', zIndex: 10 }}>
      <Typography type={'d_xl-700'} searchWords={['S3!']} highlightClassName={styles.s3}>
        Welcome to S3!
      </Typography>
      <div style={{ marginTop: '2rem', marginBottom: '4rem' }}>
        <Typography type={'d_xs-500'}>
          Your Gateway to Code-Free Stablecoin and CBDC Creation and Circulation Management
        </Typography>
      </div>
      <WalletConnectButton >
        <Typography type={'t_sm-600'}>
          Sign In with Sui Wallet
        </Typography>
        <SignInIcon />
      </WalletConnectButton>
      <div style={{ marginBottom: '2rem', marginTop: '4rem' }}>
        <Typography type={'t_md-400'} color={'var(--gray_50)'} style={{ textAlign: 'center' }}>
          Don’t have Sui Wallet extension installed?
        </Typography>
      </div>
      <Button
        variant={'secondary'}
        onClick={() => window.open(
          'https://chromewebstore.google.com/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil',
          '_blank'
        )}
      >
        <Typography type={'t_sm-600'}>
          Install Extension
        </Typography>
        <SignInIcon className={styles.icon} />
      </Button>
    </div>
    <div className={styles.swiperWrapper}>
      <Swiper />
    </div>
  </div>
);

export default SignIn;
