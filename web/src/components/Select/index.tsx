import React, { FC, ReactNode, useEffect, useState } from 'react';
import { Select as AntSelect, SelectProps, Space } from 'antd';

import AlertIcon from '../../assets/alert_icon.svg?react';
import ChevronIcon from '../../assets/chevron.svg?react';
import { IOption } from '../../types';
import { Typography } from '../Typography';

import styles from './styles.module.css';

interface IProps extends SelectProps {
  data: IOption[];
  handleChange: (q: IOption) => void;
  height?: string;
  error?: string;
  label?: string;
  value: string;
}

export const Select: FC<IProps> = ({
  handleChange,
  data,
  style,
  value,
  height,
  label,
  disabled,
  error,
  ...rest
}) => {
  const valueObj = data.find(item => item.value === value);

  return (
    <div className={styles.container}>
      {label && (
        <label>
          <Typography type={'t_sm-500'} style={{ color: 'var(--gray_60)' }}>
            {label}
          </Typography>
        </label>
      )}
      <AntSelect
        onClick={e => e.stopPropagation()}
        options={data}
        className={`${styles.select} ${error && styles.selectError}`}
        popupClassName={styles.popup}
        style={{
          width: '100%',
          height: height || '6rem',
          ...style,
        }}
        onChange={(_, option) => {
          handleChange(option as IOption);
        }}
        suffixIcon={disabled ? null : <ChevronIcon />}
        optionRender={option => (
          <RenderOption option={option.data as IOption} />
        )}
        labelRender={() => (<RenderOption option={valueObj as IOption} />)}
        value={valueObj}
        disabled={disabled}
        {...rest}
      />
      {error && (
        <div className={styles.error}>
          <AlertIcon className={styles.errorIcon} />
          <Typography type={'t_sm-400'} style={{ color: 'var(--error_100)' }}>
            {error}
          </Typography>
        </div>
      )}
    </div>
  );
};

const RenderOption: FC<{option: IOption;}> = ({ option }) => {
  const [Icon, setIcon] = useState<ReactNode>(option.icon);

  const image = typeof option.icon === 'string'
    ? `../../assets/${option.icon.split(' ').join('_')
      .toLowerCase()}.svg?react`
    : undefined;

  useEffect(() => {
    if (image) {
      import(/* @vite-ignore */ image)
        .then(icon => {
          setIcon(icon.default);
        })
        .catch(error => console.error('Error while loading the icon: ', error));
    }
  }, [image]);

  return (
    <Space className={styles.option}>
      {Icon && (
        <div className={styles.icon}>
          {Icon}
        </div>
      )}
      {option.label}
    </Space>
  );
};
