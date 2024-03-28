'use client';

import { FC, HTMLAttributes, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCurrentAccount } from '@mysten/dapp-kit';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';
import * as yup from 'yup';

import { Button, BUTTON_VIEWS } from '@/Components/Form/Button';
import { Input } from '@/Components/Form/Input';
import { Loader } from '@/Components/Loader';

import { PAGES_URLS } from '@/utils/const';

import { useUploadImage } from '@/hooks/useUploadImage';

export interface InitialStableCoinData {
  name: string;
  ticker: string;
  icon?: string;
}

export interface InitialDetailsProps extends Omit<HTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  onSubmit: (data: InitialStableCoinData) => unknown;
  defaultValues?: Partial<InitialStableCoinData>;
  excludeTickerNames?: string[];
}

export const InitialDetails: FC<InitialDetailsProps> = ({
  className,
  onSubmit,
  defaultValues,
  excludeTickerNames,
  ...props
}) => {
  const account = useCurrentAccount();

  const uploadImage = useUploadImage(account?.address);

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
          : true
      )
      .test(
        'is-exist',
        'A stablecoin with such a ticker has already been created.',
        value => value && excludeTickerNames
          ? !excludeTickerNames.includes(value)
          : true
      ),
    icon: yup
      .string(),
  });

  const formMethods = useForm({
    resolver: yupResolver(initialDetailsFormSchema),
    mode: defaultValues ? 'all' : 'onChange',
    defaultValues: {
      icon: '',
      ...defaultValues,
    },
  });

  const icon = formMethods.watch('icon');

  useEffect(
    () => {
      if (defaultValues && excludeTickerNames?.includes(formMethods.getValues().ticker)) {
        formMethods.setError(
          'ticker',
          {
            message: 'A stablecoin with such a ticker has already been created.',
            type: 'is-exist',
          }
        );
      }
    },
    [defaultValues, excludeTickerNames, formMethods]
  );

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
              restrictionLabel="28 max symbols"
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
              restrictionLabel="5 max symbols"
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
              icon || uploadImage.isPending
                ? (
                  <div className="flex items-center gap-5">
                    {
                      uploadImage.isPending
                        ? (
                          <div
                            className="
                              w-[100px] h-[100px] flex items-center justify-center
                              border border-borderPrimary rounded-xl
                            "
                          >
                            <Loader className="h-5 w-5" />
                          </div>
                        )
                        : (
                          <>
                            <div
                              className="
                                w-[100px] h-[100px] border border-borderPrimary rounded-xl
                                bg-no-repeat bg-center bg-cover
                              "
                              style={{
                                backgroundImage: `url(${icon})`,
                              }}
                            />
                            <button type="button" className="text-error text-sm" onClick={removeIcon}>
                              Remove
                            </button>
                          </>
                        )
                    }
                  </div>
                )
                : (
                  <Input
                    name="icon"
                    type="file"
                    label="Stablecoin Symbol"
                    description="JPG or PNG. 1MB max. 300x300 max"
                    accept="image/png,image/jpeg"
                    onChange={({ target }) => {
                      const selectedFile = target.files?.[0];

                      if (selectedFile) {
                        if (selectedFile.size < 1 * 1024 * 1024) {
                          const img = new Image();
                          const objectUrl = URL.createObjectURL(selectedFile);

                          img.addEventListener('load', () => {
                            if (img.width <= 300 && img.height <= 300) {
                              uploadIcon(selectedFile);
                            }
                            else {
                              toast.error('The width and hight of the image cannot be more than 300px.');
                            }
                          });

                          img.src = objectUrl;
                        }
                        else {
                          toast.error('The size of the image cannot be more than 1MB.');
                        }

                        formMethods.setValue('icon', '');
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

  async function uploadIcon(file: File) {
    formMethods.setValue('icon', await uploadImage.mutateAsync(file));
  }

  function removeIcon() {
    formMethods.setValue('icon', '');
  }
};
