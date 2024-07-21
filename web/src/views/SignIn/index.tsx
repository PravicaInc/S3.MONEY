import { FC, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAutoConnectWallet } from '@mysten/dapp-kit';
import { Swiper as SwiperType } from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import SignInIcon from '../../assets/sign-in.svg?react';
import Pattern from '../../assets/sign-in-pattern.svg?react';
import { Button } from '../../components/Button';
import { Typography } from '../../components/Typography';
import { WalletConnectButton } from '../../components/WalletConnectButton';
import { PAGES_URLS } from '../../utils/const.ts';

import styles from './styles.module.css';

const SignIn: FC = () => {
  const navigate = useNavigate();
  const autoConnectionStatus = useAutoConnectWallet();

  const isLoading = useMemo(() => autoConnectionStatus === 'idle', [autoConnectionStatus]);

  return (
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
        <WalletConnectButton
          onConnectSuccess={() => {
            navigate(PAGES_URLS.home);
          }}
          disabled={isLoading}
          isLoading={isLoading}
        >
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
        {/* eslint-disable-next-line no-use-before-define */}
        <CustomSwiper />
      </div>
    </div>
  );
};

export default SignIn;

const CustomSwiper: FC = () => {
  const swiperRef = useRef<SwiperType>();

  return (
    <div className={styles.swiper}>
      <Swiper
        style={{
          width: '100%',
          height: '100%',
        }}
        pagination={{
          bulletActiveClass: styles.bulletActive,
          bulletClass: styles.bullet,
        }}
        onBeforeInit={swiper => {
          swiperRef.current = swiper;
        }}
        loop
        modules={[Navigation, Pagination]}
      >
        <SwiperSlide className={styles.slideWrapper}>
          <Typography type={'t_lg-500'}>
            Slide 1
          </Typography>
        </SwiperSlide>
        <SwiperSlide className={styles.slideWrapper}>
          <Typography type={'t_lg-500'}>
            Slide 2
          </Typography>
        </SwiperSlide>
        <SwiperSlide className={styles.slideWrapper}>
          <Typography type={'t_lg-500'}>
            Slide 3
          </Typography>
        </SwiperSlide>
        <SwiperSlide className={styles.slideWrapper}>
          <Typography type={'t_lg-500'}>
            Slide 4
          </Typography>
        </SwiperSlide>
      </Swiper>
      <Button variant={'secondary'} className={styles.previous} onClick={() => swiperRef.current?.slidePrev()}>
        <Typography type={'t_sm-600'}>
          Previous
        </Typography>
      </Button>
      <Button className={styles.next} onClick={() => swiperRef.current?.slideNext()}>
        <Typography type={'t_sm-600'}>
          Next
        </Typography>
      </Button>
    </div>
  );
};
