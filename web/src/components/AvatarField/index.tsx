import React, { FC } from 'react';
import { GetProp, Upload, UploadProps } from 'antd';

import AlertIcon from '../../assets/alert_icon.svg?react';
import PlusIcon from '../../assets/plus.svg?react';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

import ImgCrop from 'antd-img-crop';

import { readFileAsBase64 } from '../../utils/helpers';
import { Typography } from '../Typography';

import styles from './styles.module.css';

interface IProps extends UploadProps {
  error?: string;
  label?: string;
  value?: string;
  setError?: (msg: string) => void;
  handleChange: (img: string) => void;
}

export const AvatarField: FC<IProps> = ({ handleChange, error, setError, label, ...rest }) => {
  const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    let errorMsg = '';

    if (!isJpgOrPng) {
      errorMsg = 'You can only upload JPG/PNG file!';
    }
    const isLt5M = file.size / 1024 / 1024 < 5;

    if (!isLt5M) {
      errorMsg = 'Image must smaller than 5MB!';
    }
    if (errorMsg.length === 0) {
      readFileAsBase64(file).then(url => {
        handleChange(url);
      });
    }
    setError && setError(errorMsg);

    return false;
  };

  return (
    <div className={styles.container}>
      {label && (
        <label>
          <Typography type={'t_sm-500'} style={{ color: 'var(--gray_60)' }}>
            {label}
          </Typography>
        </label>
      )}
      <ImgCrop rotationSlider>
        <Upload
          listType="picture-circle"
          beforeUpload={beforeUpload}
          showUploadList={false}
          onChange={e => beforeUpload(e.file as FileType)}
          {...rest}
        >
          {rest.value
            ? <img src={rest.value} alt="avatar" className={styles.img} />
            : (
              <button className={styles.btn} type="button">
                <PlusIcon style={{ color: 'var(--primary_100)' }} />
                <Typography type={'t_sm-400'} style={{ color: 'var(--gray_50)' }}>
                  Upload
                </Typography>
              </button>
            )}
        </Upload>
      </ImgCrop>
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
