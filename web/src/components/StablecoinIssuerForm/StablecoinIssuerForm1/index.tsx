import { FC } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import FormIcon from '../../../assets/form.svg?react';
import { REQUIRED_STRING } from '../../../utils/formValidation.ts';
import { Button } from '../../Button';
import { InputField } from '../../InputField';
import { Select } from '../../Select';
import { Typography } from '../../Typography';
import { StablecoinIssuerForm1Values } from '../types.ts';

import styles from './styles.module.css';

interface IProps {
  goNext: (data: StablecoinIssuerForm1Values) => void;
  goBack: () => void;
  initialValue?: StablecoinIssuerForm1Values;
}

const schema = yup
  .object({
    companyName: REQUIRED_STRING,
    industryDomain: REQUIRED_STRING,
    companyLocation: REQUIRED_STRING,
  }).required();

export const StablecoinIssuerForm1: FC<IProps> = ({ goNext, goBack, initialValue }) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<StablecoinIssuerForm1Values>({
    resolver: yupResolver<StablecoinIssuerForm1Values>(schema),
    values: initialValue,
  });

  const onSubmit: SubmitHandler<StablecoinIssuerForm1Values> = data => {
    goNext(data);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.text}>
          <Typography type={'d_xs-600'}>
            Company Info
          </Typography>
          <Typography type={'t_sm-400'} style={{ color: 'var(--gray_60)', lineHeight: 1.4 }}>
            By registering your company, you can leverage the platform's
            functionalities designed specifically for your needs and those of your distributors.
          </Typography>
        </div>
        <FormIcon style={{ color: 'var(--primary_100)' }} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <InputField
          register={register('companyName')}
          error={errors?.companyName?.message}
          label={'Company Name*'}
          placeholder={'Provide your legal business name precisely'}
        />
        <Controller
          name="companyLocation"
          control={control}
          render={({ field: { onChange, ...field } }) => (
            <Select
              {...field}
              error={errors?.companyLocation?.message}
              height={'4.8rem'}
              label={'Company Location*'}
              placeholder={'Specify your headquarter.'}
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
          register={register('industryDomain')}
          error={errors?.industryDomain?.message}
          label={'Industry Domain*'}
          placeholder={'DeFi, Gaming, Real Estate'}
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
