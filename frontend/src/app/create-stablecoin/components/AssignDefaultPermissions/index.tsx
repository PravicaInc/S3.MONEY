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
import { Tooltip } from '@/Components/Tooltip';

import { PAGES_URLS } from '@/utils/const';

export interface PermissionsStableCoinData {
  defaultPermissions: boolean;
}

interface PermissionsStableCoinFormData {
  defaultPermissions: string[];
}

export interface InitialDetailsProps extends Omit<HTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  onSubmit: (data: PermissionsStableCoinData) => unknown;
  defaultValues?: Partial<PermissionsStableCoinFormData>;
}

export const AssignDefaultPermissions: FC<InitialDetailsProps> = ({ className, onSubmit, defaultValues, ...props }) => {
  const formMethods = useForm({
    defaultValues: {
      defaultPermissions: ['on'],
      ...defaultValues,
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
          <Tooltip
            placement="top"
            trigger={['hover']}
            overlay="Editing to permissions will be available soon."
          >
            <div>
              <Checkbox
                name="defaultPermissions"
                view={CHECKBOX_VIEWS.switch}
                disabled
              />
            </div>
          </Tooltip>
        </div>
        <div className="mt-10 space-y-4">
          {
            [
              // 'Wipe - S3-Token-Manager Smart Contract',
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
            disabled={formMethods.formState.isSubmitting}
            isLoading={formMethods.formState.isSubmitting}
          >
            Create
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
