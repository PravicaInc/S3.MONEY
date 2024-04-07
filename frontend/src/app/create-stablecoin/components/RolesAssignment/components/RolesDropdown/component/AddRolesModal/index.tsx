import { FC, useCallback } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { isValidSuiAddress } from '@mysten/sui.js/utils';
import { twMerge } from 'tailwind-merge';
import * as yup from 'yup';

import BackgroundModalDecorativeIcon from '@/../public/images/background_modal_decorative_center.svg?jsx';
import PeopleWithPlusIcon from '@/../public/images/people_with_plus.svg?jsx';

import { Button } from '@/Components/Form/Button';
import { Input } from '@/Components/Form/Input';
import { Modal, ModalProps } from '@/Components/Modal';

export interface AddRolesModalData {
  address: string;
}

export interface AddRolesModalProps extends ModalProps {
  onConfirmClick: (value: string) => void;
  addedAddresses?: string[];
}

export const AddRolesModal: FC<AddRolesModalProps> = ({
  onClose,
  className,
  onConfirmClick,
  addedAddresses = [],
  ...props
}) => {
  const addRolesFormSchema = yup.object().shape({
    address: yup
      .string()
      .trim()
      .required('Wallet address is required.')
      .test({
        name: 'is-valid',
        test: isValidSuiAddress,
        message: 'Wallet address is incorrect.',
      })
      .test({
        name: 'is-exist',
        test: (value: string) => !addedAddresses.includes(value),
        message: 'Wallet address has already been added.',
      }),
  });
  const formMethods = useForm({
    resolver: yupResolver(addRolesFormSchema),
    defaultValues: {
      address: '',
    },
  });

  const onSubmit: SubmitHandler<AddRolesModalData> = useCallback(
    ({ address }) => {
      onConfirmClick(address);
      formMethods.reset();
    },
    [formMethods, onConfirmClick]
  );

  return (
    <Modal
      onClose={onClose}
      className={twMerge('relative p-6 w-[400px]', className)}
      {...props}
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-[-1]">
        <BackgroundModalDecorativeIcon />

        <div
          className="
          absolute top-6 left-1/2 -translate-x-1/2 w-12 h-12
          flex items-center justify-center rounded-full bg-[#FE63211A]
        "
        >
          <PeopleWithPlusIcon />
        </div>
      </div>
      <p className="text-primary text-lg font-semibold mt-[88px] text-center">
        Assign another account
      </p>
      <p className="mt-1 text-secondary text-center">
        This address will be granted permission to manage this functionality.
      </p>
      <FormProvider {...formMethods}>
        <form
          onSubmit={formMethods.handleSubmit(onSubmit)}
          className="mt-5"
        >
          <Input
            name="address"
            label="Address"
            placeholder="Address"
            maxLength={66}
            className="w-full"
          />
          <Button className="mt-8 w-full h-11" type="submit">
            Confirm
          </Button>
        </form>
      </FormProvider>
    </Modal>
  );
};
