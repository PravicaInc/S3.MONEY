import { FC } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import FormIcon from '../../../assets/distributor.svg?react';

import AlertIcon from '../../../assets/alert_icon.svg?react';
import { REQUIRED_STRING } from '../../../utils/formValidation.ts';
import { Button } from '../../Button';
import { Select } from '../../Select';
import { Typography } from '../../Typography';
import { DistributorForm2Values } from '../types.ts';

import styles from './styles.module.css';

interface IProps {
  goNext: (data: DistributorForm2Values) => void;
  goBack: () => void;
  initialValue?: DistributorForm2Values;
}

const schema = yup
  .object({
    issuerId: REQUIRED_STRING,
    projectId: REQUIRED_STRING,
  }).required();

export const DistributorForm2: FC<IProps> = ({ goNext, goBack, initialValue }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DistributorForm2Values>({
    resolver: yupResolver<DistributorForm2Values>(schema),
    values: initialValue,
  });

  const onSubmit: SubmitHandler<DistributorForm2Values> = data => {
    goNext(data);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.text}>
          <Typography type={'d_xs-600'}>
            Level Up Your Distribution Network
          </Typography>
          <Typography type={'t_sm-400'} style={{ color: 'var(--gray_60)', lineHeight: 1.4 }}>
            Great job registering as a Stablecoin Distributor on S3.money!
            Now,
            let's explore how to leverage the platform to connect with potential Stablecoin issuers.
          </Typography>
        </div>
        <FormIcon style={{ color: 'var(--primary_100)', width: '6rem', height: '6rem' }} />
      </div>
      <div className={styles.info}>
        <AlertIcon style={{ width: '2rem', height: '2rem' }} />
        <Typography type={'t_xs-400'} style={{ color: 'var(--gray_60)', lineHeight: 1.4 }}>
          We'll let you know when your request is approved. Explore S3.money in the meantime!
        </Typography>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <Controller
          name="issuerId"
          control={control}
          render={({ field: { onChange, ...field } }) => (
            <Select
              {...field}
              error={errors?.issuerId?.message}
              height={'4.8rem'}
              label={'Connect to Issuer*'}
              placeholder={'Search Your Issuers'}
              handleChange={val => onChange(val.value)}
              value={field.value}
              showSearch
              data={[
                { value: 'chocolate', label: 'Chocolate' },
                { value: 'strawberry', label: 'Strawberry' },
                { value: 'vanilla', label: 'Vanilla' },
              ]}
            />
          )}
        />
        <Controller
          name="projectId"
          control={control}
          render={({ field: { onChange, ...field } }) => (
            <Select
              {...field}
              error={errors?.projectId?.message}
              height={'4.8rem'}
              label={'Token Project*'}
              placeholder={'Select Project'}
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
