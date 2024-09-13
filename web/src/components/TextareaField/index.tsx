import { FC, ReactNode, TextareaHTMLAttributes } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

import AlertIcon from '../../assets/alert_icon.svg?react';
import { Typography } from '../Typography';

import styles from './styles.module.css';

interface IProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  icon?: ReactNode;
  error?: string;
  register?:UseFormRegisterReturn<string>;
}

export const TextareaField: FC<IProps> = ({ className, icon, error, register, label, ...props }) => (
  <div className={`${styles.container} ${className}`}>
    {label && (
      <label className={styles.label}>
        <Typography type={'t_sm-500'} style={{ color: 'var(--gray_60)' }}>
          {label}
        </Typography>
      </label>
    )}
    <textarea className={`${styles.input} ${error && styles.inputError}`} {...props} {...register} />
    {error && (
      <div className={styles.error}>
        <AlertIcon className={styles.errorIcon} />
        <Typography type={'t_sm-400'} style={{ color: 'var(--error_100)' }}>
          {error}
        </Typography>
      </div>
    )}
    {icon && (
      <div className={styles.icon}>
        {icon}
      </div>
    )}
  </div>
);
