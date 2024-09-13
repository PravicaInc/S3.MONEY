import { FC } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import AlertIcon from '../../../assets/alert_icon.svg?react';
import FormIcon from '../../../assets/bank.svg?react';
import CryptoIcon from '../../../assets/crypto.svg?react';
import FiatIcon from '../../../assets/fiat.svg?react';
import { REQUIRED_BALANCE, REQUIRED_STRING } from '../../../utils/formValidation.ts';
import { Button } from '../../Button';
import { InputField } from '../../InputField';
import { Select } from '../../Select';
import { Typography } from '../../Typography';
import { StablecoinIssuerForm2Values } from '../types.ts';

import styles from './styles.module.css';

interface IProps {
  goNext: (data: StablecoinIssuerForm2Values) => void;
  goBack: () => void;
  initialValue?: StablecoinIssuerForm2Values;
}

const schema = yup
  .object({
    reserveBank: REQUIRED_STRING,
    reserveCurrency: REQUIRED_STRING,
    reserveBalance: REQUIRED_BALANCE,
  }).required();

export const StablecoinIssuerForm2: FC<IProps> = ({ goNext, goBack, initialValue }) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<StablecoinIssuerForm2Values>({
    resolver: yupResolver<StablecoinIssuerForm2Values>(schema),
    values: initialValue,
  });

  const onSubmit: SubmitHandler<StablecoinIssuerForm2Values> = data => {
    goNext(data);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.text}>
          <Typography type={'d_xs-600'}>
            Sync Bank Reserve
          </Typography>
          <Typography type={'t_sm-400'} style={{ color: 'var(--gray_60)', lineHeight: 1.4 }}>
            This allows you to connect your Stablecoin reserve
            held at a bank with S3.money (currently in testnet phase).
          </Typography>
        </div>
        <FormIcon style={{ color: 'var(--primary_100)' }} />
      </div>
      <div className={styles.cards}>
        <div className={`${styles.card} ${styles.active}`} >
          <FiatIcon style={{ height: '2rem' }} />
          <Typography style={{ color: 'inherit' }} type={'t_xs-400'}>
            Backed By Fiat
          </Typography>
        </div>
        <div className={styles.card} >
          <div className={styles.soon}>
            <Typography style={{ color: 'var(--base)' }} type={'t_xss-600'}>
              Coming Soon
            </Typography>
          </div>
          <CryptoIcon style={{ height: '2rem' }} />
          <Typography style={{ color: 'inherit' }} type={'t_xs-400'}>
            Backed By Crypto
          </Typography>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <Controller
          name="reserveBank"
          control={control}
          render={({ field: { onChange, ...field } }) => (
            <Select
              {...field}
              error={errors?.reserveBank?.message}
              height={'4.8rem'}
              label={'Reserve Bank*'}
              placeholder={'Select Bank'}
              handleChange={val => onChange(val.value)}
              value={field.value}
              data={[
                { value: 'chocolate', label: 'Chocolate' },
                { value: 'strawberry', label: 'Strawberry' },
                { value: 'vanilla', label: 'Vanilla' },
              ]}
            />
          )}
        />
        <Controller
          name="reserveCurrency"
          control={control}
          render={({ field: { onChange, ...field } }) => (
            <Select
              {...field}
              error={errors?.reserveCurrency?.message}
              height={'4.8rem'}
              label={'Reserve Currency*'}
              placeholder={'Select Currency'}
              handleChange={val => onChange(val.value)}
              value={field.value}
              data={[
                { value: 'chocolate', label: 'Chocolate' },
                { value: 'strawberry', label: 'Strawberry' },
                { value: 'vanilla', label: 'Vanilla' },
              ]}
            />
          )}
        />
        <InputField
          register={register('reserveBalance')}
          error={errors?.reserveBalance?.message}
          label={'Reserve Balance*'}
          placeholder={'00.00'}
          type={'number'}
          icon={
            <Typography type={'t_md-400'} style={{ color: 'var(--gray_40)' }}>
              USD
            </Typography>
          }
        />
        <div className={styles.info}>
          <AlertIcon />
          <Typography type={'t_xs-400'} style={{ color: 'var(--gray_60)' }}>
            For the testnet phase, entering a balance is for simulation purposes only.
          </Typography>
        </div>
        <div className={styles.footer}>
          <Button variant={'secondary'} className={styles.previous} onClick={goBack}>
            <Typography type={'t_sm-600'}>
              Previous
            </Typography>
          </Button>
          <Button className={styles.next} type={'submit'}>
            <Typography type={'t_sm-600'}>
              Next
            </Typography>
          </Button>
        </div>
      </form>
    </div>
  );
};
