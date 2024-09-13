import { FC } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import FormIcon from '../../../assets/cbdc_issuer.svg?react';
import { OPTIONAL_STRING, REQUIRED_EMAIL, REQUIRED_STRING } from '../../../utils/formValidation.ts';
import { Button } from '../../Button';
import { InputField } from '../../InputField';
import { Select } from '../../Select';
import { TextareaField } from '../../TextareaField';
import { Typography } from '../../Typography';
import { CBDCIssuerFormValues } from '../types.ts';

import styles from './styles.module.css';

interface IProps {
  goNext: (data: CBDCIssuerFormValues) => void;
  initialValue?: CBDCIssuerFormValues;
}

const schema = yup
  .object({
    country: REQUIRED_STRING,
    email: REQUIRED_EMAIL,
    moreInfo: OPTIONAL_STRING,
  }).required();

export const CBDCIssuerForm1: FC<IProps> = ({ goNext, initialValue }) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CBDCIssuerFormValues>({
    resolver: yupResolver<CBDCIssuerFormValues>(schema),
    values: initialValue,
  });

  const onSubmit: SubmitHandler<CBDCIssuerFormValues> = data => {
    goNext(data);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.text}>
          <Typography type={'d_xs-600'}>
            Register Now!
          </Typography>
          <Typography type={'t_sm-400'} style={{ color: 'var(--gray_60)', lineHeight: 1.4 }}>
            The registration process is quick and easy. Simply fill out the form
            below and a representative will be in touch to answer any questions you may have.
          </Typography>
        </div>
        <FormIcon style={{ color: 'var(--primary_100)', width: '6rem', height: '6rem' }} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <Controller
          name="country"
          control={control}
          render={({ field: { onChange, ...field } }) => (
            <Select
              {...field}
              error={errors?.country?.message}
              height={'4.8rem'}
              label={'Country*'}
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
        <InputField
          register={register('email')}
          error={errors?.email?.message}
          label={'Contact Email*'}
          placeholder={'Enter Business Email Address'}
          type={'email'}
        />
        <TextareaField
          register={register('moreInfo')}
          error={errors?.moreInfo?.message}
          label={'Tell us anything you want'}
          placeholder={'I\'m interested in how this platform could help with...'}
        />
        <Button className={styles.next} type={'submit'}>
          <Typography type={'t_sm-600'}>
            Submit
          </Typography>
        </Button>
      </form>
    </div>
  );
};
