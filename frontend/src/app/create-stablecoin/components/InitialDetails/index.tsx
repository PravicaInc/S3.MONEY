'use client';

import { FC, HTMLAttributes } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';
import * as yup from 'yup';

import { Button, BUTTON_VIEWS } from '@/Components/Form/Button';
import { Input } from '@/Components/Form/Input';

import { PAGES_URLS } from '@/utils/const';

export interface InitialStableCoinData {
  name: string;
  ticker: string;
  icon?: string;
}

export interface InitialDetailsProps extends Omit<HTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  onSubmit: (data: InitialStableCoinData) => unknown;
}

export const InitialDetails: FC<InitialDetailsProps> = ({ className, onSubmit, ...props }) => {
  const initialDetailsFormSchema = yup.object().shape({
    name: yup
      .string()
      .trim()
      .required('Stablecoin name is required.'),
    ticker: yup
      .string()
      .trim()
      .required('Stablecoin ticker is required.')
      .test(
        'is-required',
        'Stablecoin ticker is required.',
        value => value
          ? !!value.replace(/^\$/, '').length
          : false
      ),
    icon: yup
      .string(),
  });

  const formMethods = useForm({
    resolver: yupResolver(initialDetailsFormSchema),
    defaultValues: {
      icon: '',
    },
  });

  const icon = formMethods.watch('icon');

  return (
    <FormProvider {...formMethods}>
      <form
        className={twMerge('', className)}
        onSubmit={formMethods.handleSubmit(onSubmit)}
        {...props}
      >
        <p className="text-primary text-lg font-semibold">
          Initial Details
        </p>
        <div className="mt-10 space-y-4">
          <div>
            <Input
              name="name"
              label="Stablecoin Name"
              isRequired
              placeholder="Stablecoin Name"
              className="w-full"
              maxLength={28}
            />
          </div>
          <div>
            <Input
              name="ticker"
              label="Stablecoin Ticker"
              isRequired
              placeholder="Stablecoin Ticker"
              className="w-full"
              onChange={({ target }) => {
                target.value = `$${
                  target.value
                    .replace(/^\$/, '')
                    .replace(/[\W\d]+/g, '')
                    .toUpperCase()
                }`;
              }}
              maxLength={6}
            />
          </div>
          <div>
            {
              icon
                ? (
                  <div className="flex items-center gap-5">
                    <div
                      className="w-[100px] h-[100px] rounded-xl bg-no-repeat bg-center bg-cover"
                      style={{
                        backgroundImage: `url(${icon})`,
                      }}
                    />
                    <button type="button" className="text-error text-sm" onClick={removeIcon}>
                      Remove
                    </button>
                  </div>
                )
                : (
                  <Input
                    name="icon"
                    type="file"
                    label="Stablecoin Symbol"
                    description="JPG or PNG. 1MB max"
                    onChange={({ target: { files } }) => {
                      if (files?.[0]) {
                        readImage(files[0]);
                      }
                    }}
                  />
                )
            }
          </div>
        </div>
        <div className="flex items-center justify-between gap-6 mt-10">
          <Link href={PAGES_URLS.home} className="w-full rounded-xl">
            <Button
              view={BUTTON_VIEWS.secondary}
              className="h-14 w-full"
            >
              Cancel
            </Button>
          </Link>
          <Button
            className="h-14 w-full"
            type="submit"
          >
            Next
          </Button>
        </div>
      </form>
    </FormProvider>
  );

  function readImage(file: File) {
    const reader = new FileReader();

    reader.onload = function() {
      formMethods.setValue('icon', reader.result as string);
    };

    reader.readAsDataURL(file);
  }

  function removeIcon() {
    formMethods.setValue('icon', '');
  }
};
