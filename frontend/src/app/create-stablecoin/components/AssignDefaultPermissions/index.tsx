'use client';

import { FC, HTMLAttributes } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

import CheckedIcon from '@/../public/images/checked.svg?jsx';

import { Button, BUTTON_VIEWS } from '@/Components/Form/Button';
import { Checkbox, CHECKBOX_VIEWS } from '@/Components/Form/Checkbox';

import { PAGES_URLS } from '@/utils/const';

export interface PermissionsStableCoinData {
  defaultPermissions: boolean;
}

interface PermissionsStableCoinFormData {
  defaultPermissions: string[];
}

export interface InitialDetailsProps extends Omit<HTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  onSubmit: (data: PermissionsStableCoinData) => unknown;
}

export const AssignDefaultPermissions: FC<InitialDetailsProps> = ({ className, onSubmit, ...props }) => {
  const formMethods = useForm({
    defaultValues: {
      defaultPermissions: ['on'],
    },
  });

  const hasDefaultPermissions = !!formMethods.watch('defaultPermissions').length;

  const onFormSubmit: SubmitHandler<PermissionsStableCoinFormData> = async permissionsStableCoinData => onSubmit({
    ...permissionsStableCoinData,
    defaultPermissions: !!permissionsStableCoinData.defaultPermissions.length,
  });

  return (
    <FormProvider {...formMethods}>
      <form
        className={twMerge('', className)}
        onSubmit={formMethods.handleSubmit(onFormSubmit)}
        {...props}
      >
        <div className="text-primary text-lg font-semibold flex items-center justify-between">
          Assign Default Permissions
          <Checkbox
            name="defaultPermissions"
            view={CHECKBOX_VIEWS.switch}
          />
        </div>
        <div className="mt-10 space-y-4">
          {
            [
              'Wipe - S3-Token-Manager Smart Contract',
              'Freeze - S3-Token-Manager Smart Contract',
              'Pause - S3-Token-Manager Smart Contract',
            ].map(permission => (
              <div
                key={permission}
                className="flex items-center gap-[10px] text-primary"
              >
                <div
                  className={twMerge(
                    'w-6 h-6 flex items-center justify-center rounded-full',
                    hasDefaultPermissions ? 'bg-[#EFFEFA]' : 'bg-red-100'
                  )}
                >
                  {
                    hasDefaultPermissions
                      ? <CheckedIcon className="[&>path]:stroke-[#287F6E]" />
                      : <FontAwesomeIcon icon={faXmark} className="text-red-400" />
                  }
                </div>
                {permission}
              </div>
            ))
          }
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
            Create StableCoin
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
