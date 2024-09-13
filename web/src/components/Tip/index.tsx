import { FC } from 'react';

import TipIcon from '../../assets/tip.svg?react';
import { Typography } from '../Typography';

import styles from './styles.module.css';

interface IProps {
  title: string;
  className?: string;
  para: {text: string, className?: string}[];
}

export const Tip: FC<IProps> = ({ title, className: rootClassName, para }) => (
  <div className={`${styles.container} ${rootClassName}`} >
    <div className={styles.header}>
      <TipIcon />
      <Typography type={'t_lg-500'} style={{ lineHeight: 1.4 }}>
        {title}
      </Typography>
    </div>
    {para.map(({ text, className }) => (
      <Typography
        key={text}
        className={className}
        type={'t_sm-400'}
        style={{ color: 'var(--gray_60)', lineHeight: 1.4 }}
      >
        {text}
      </Typography>
    ))}
  </div>
);
