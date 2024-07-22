import { FC, useRef } from 'react';
import { Swiper as SwiperType } from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper as LibSwiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Button } from '../../../components/Button';
import { Typography } from '../../../components/Typography';

import { SLIDER_INFO } from './data.tsx';

import styles from './styles.module.css';

export const Swiper: FC = () => {
  const swiperRef = useRef<SwiperType>();

  return (
    <div className={styles.swiper}>
      <LibSwiper
        style={{
          width: '100%',
          height: '100%',
        }}
        pagination
        onBeforeInit={swiper => {
          swiperRef.current = swiper;
        }}
        className={styles.swiperMain}
        loop
        modules={[Navigation, Pagination]}
      >
        {SLIDER_INFO.map(
          info => (
            <SwiperSlide key={info.title} className={styles.slideWrapper}>
              <div className={styles.sliderImg}>
                {info.image}
              </div>
              <Typography type={'t_xl-600'} style={{ color: 'var(--gray_90)' }}>
                {info.title}
              </Typography>
              <Typography style={{ marginTop: '0.8rem', color: 'var(--gray_60)', width: '80%' }} type={'t_md-400'}>
                {info.para}
              </Typography>
            </SwiperSlide>
          )
        )}
      </LibSwiper>
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
