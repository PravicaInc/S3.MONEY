import { FC, PropsWithChildren, ReactNode } from 'react';

import NotFoundIcon from '../../assets/not-found.svg?react';
import PlusIcon from '../../assets/plus.svg?react';
import { Button } from '../Button';
import { Typography } from '../Typography';

import styles from './styles.module.css';

interface IProps {
  title: string;
  message?: string;
  icon: ReactNode;
  onClick?: () => void;
  count?: number;
}

export const Table: FC<PropsWithChildren<IProps>> = ({ title, count = 0, children, icon, message, onClick }) => (
  <div className={styles.container}>
    <div className={styles.header}>
      {icon}
      <Typography type={'d_xs-600'}>
        {`${title} (${count})`}
      </Typography>
    </div>
    {children || (
      <div className={styles.body}>
        <NotFoundIcon style={{ marginBottom: '1.5rem' }} />
        <Typography type={'t_md-600'}>
          {`No ${title.toLowerCase()} Found`}
        </Typography>
        {message && (
          <Typography type={'t_sm-400'} className={styles.message}>
            {message}
          </Typography>
        )}
        {onClick && (
          <Button className={styles.btn}>
            <PlusIcon />
            <Typography type={'t_md-600'}>
              Create New Project
            </Typography>
          </Button>
        )}
      </div>
    )}
  </div>
);
