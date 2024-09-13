import { FC } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import FormIcon from '../../../assets/alert-file.svg?react';
import { OPTIONAL_STRING, REQUIRED_STRING } from '../../../utils/formValidation.ts';
import { AvatarField } from '../../AvatarField';
import { Button } from '../../Button';
import { InputField } from '../../InputField';
import { Select } from '../../Select';
import { Typography } from '../../Typography';
import { DistributorForm1Values } from '../types.ts';

import styles from './styles.module.css';

interface IProps {
  goNext: (data: DistributorForm1Values) => void;
  goBack: () => void;
  initialValue?: DistributorForm1Values;
}

const schema = yup
  .object({
    companyName: REQUIRED_STRING,
    country: REQUIRED_STRING,
    businessType: REQUIRED_STRING,
    logo: OPTIONAL_STRING,
  }).required();

export const DistributorForm1: FC<IProps> = ({ goNext, goBack, initialValue }) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DistributorForm1Values>({
    resolver: yupResolver<DistributorForm1Values>(schema),
    values: initialValue,
  });

  const onSubmit: SubmitHandler<DistributorForm1Values> = data => {
    goNext(data);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.text}>
          <Typography type={'d_xs-600'}>
            Expand Your Reach
          </Typography>
          <Typography type={'t_sm-400'} style={{ color: 'var(--gray_60)', lineHeight: 1.4 }}>
            By registering as a Stablecoin Distributor on S3.money,
            you'll gain access to a powerful platform that connects you with a growing network of issuers.
          </Typography>
        </div>
        <FormIcon style={{ color: 'var(--primary_100)' }} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <InputField
          register={register('companyName')}
          error={errors?.companyName?.message}
          label={'Full Registered Name*'}
          placeholder={'eg. Example LLC.'}
        />
        <Controller
          name="country"
          control={control}
          render={({ field: { onChange, ...field } }) => (
            <Select
              {...field}
              error={errors?.country?.message}
              height={'4.8rem'}
              label={'Registration Country*'}
              placeholder={'Select Country'}
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
          name="businessType"
          control={control}
          render={({ field: { onChange, ...field } }) => (
            <Select
              {...field}
              error={errors?.businessType?.message}
              height={'4.8rem'}
              label={'Business Type*'}
              placeholder={'Select Business Type'}
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
          name="logo"
          control={control}
          render={({ field: { onChange, ...field } }) => (
            <AvatarField
              {...field}
              error={errors?.logo?.message}
              setError={error => control.setError('logo', { message: error })}
              label={'Upload Logo'}
              handleChange={onChange}
            />
          )}
        />
        <div className={styles.footer}>
          <Button disabled variant={'secondary'} className={styles.previous} onClick={goBack}>
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
