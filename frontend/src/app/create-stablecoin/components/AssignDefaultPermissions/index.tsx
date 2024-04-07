'use client';

import { FC, HTMLAttributes } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { twMerge } from 'tailwind-merge';

import CheckedIcon from '@/../public/images/checked.svg?jsx';

import { Button, BUTTON_VIEWS } from '@/Components/Form/Button';
import { Checkbox, CHECKBOX_VIEWS } from '@/Components/Form/Checkbox';
import { Tooltip } from '@/Components/Tooltip';

export interface PermissionsStableCoinData {
  permissions: {
    value: string;
    label: string;
    isActive: boolean;
  }[];
}

export interface AssignDefaultPermissionsProps extends Omit<HTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  onSubmit: (data: PermissionsStableCoinData) => unknown;
  onBack: () => void;
  defaultValues?: Partial<PermissionsStableCoinData>;
}

export const AssignDefaultPermissions: FC<AssignDefaultPermissionsProps> = ({
  className,
  onSubmit,
  onBack,
  defaultValues,
  ...props
}) => {
  const formMethods = useForm({
    defaultValues: {
      defaultPermissions: ['on'],
      permissions: [
        {
          value: 'pause',
          label: 'Pause - Current Account',
          isActive: true,
        },
        {
          value: 'freeze',
          label: 'Freeze - Current Account',
          isActive: true,
        },
        {
          value: 'mint',
          label: 'Mint - Current Account',
          isActive: true,
        },
        {
          value: 'cashIn',
          label: 'Cash In - Current Account',
          isActive: true,
        },
        {
          value: 'burn',
          label: 'Burn - Current Account',
          isActive: true,
        },
      ],
      ...defaultValues,
    },
  });

  const permissions = formMethods.watch('permissions');

  return (
    <FormProvider {...formMethods}>
      <form
        className={twMerge('', className)}
        onSubmit={formMethods.handleSubmit(onSubmit)}
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
            permissions.map(({ value, label, isActive }) => (
              <div
                key={value}
                className="flex items-center gap-[10px] text-primary"
              >
                <div
                  className={twMerge(
                    'w-6 h-6 flex items-center justify-center rounded-full',
                    isActive ? 'bg-[#EFFEFA]' : 'bg-red-100'
                  )}
                >
                  {
                    isActive
                      ? <CheckedIcon className="[&>path]:stroke-[#287F6E]" />
                      : <FontAwesomeIcon icon={faXmark} className="text-red-400" />
                  }
                </div>
                {label}
              </div>
            ))
          }
        </div>
        <div className="flex items-center justify-between gap-6 mt-10">
          <Button
            view={BUTTON_VIEWS.secondary}
            className="h-14 w-full"
            onClick={onBack}
            type="button"
          >
            Back
          </Button>
          <Button
            className="h-14 w-full"
            type="submit"
            disabled={formMethods.formState.isSubmitting}
            isLoading={formMethods.formState.isSubmitting}
          >
            Next
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
