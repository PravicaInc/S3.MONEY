import { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { twMerge } from 'tailwind-merge';
import * as yup from 'yup';

import BackgroundModalDecorativeIcon from '@/../public/images/background_modal_decorative_left.svg?jsx';
import PlusWithCircleIcon from '@/../public/images/plus_with_circle.svg?jsx';

import { Button, BUTTON_VIEWS } from '@/Components/Form/Button';
import { Input } from '@/Components/Form/Input';
import { Modal, ModalProps } from '@/Components/Modal';

import { suiAddressRegExp } from '@/utils/validators';

export interface CreateRelationFormData {
  label: string;
  walletAddress: string;
}

export interface CreateRelationModalProps extends ModalProps {
  onProceed: ({ label, walletAddress }: CreateRelationFormData) => void;
  inProcess?: boolean;
  excludeNames?: string[];
}

export const CreateRelationModal: FC<CreateRelationModalProps> = ({
  onClose,
  className,
  onProceed,
  inProcess,
  excludeNames,
  ...props
}) => {
  const createRelationFormSchema = yup.object().shape({
    label: yup
      .string()
      .required('Name is required.')
      .test(
        'is-exist',
        'A relation with such name has already been created.',
        value => value && excludeNames
          ? !excludeNames.includes(value.toLowerCase())
          : true
      ),
    walletAddress: yup
      .string()
      .matches(suiAddressRegExp, 'Wallet address is incorrect.')
      .required('Wallet address is required.'),
  });
  const formMethods = useForm({
    resolver: yupResolver(createRelationFormSchema),
  });

  return (
    <Modal
      onClose={onClose}
      className={twMerge('relative p-6 w-[480px]', className)}
      {...props}
    >
      <FormProvider {...formMethods}>
        <form
          onSubmit={formMethods.handleSubmit(onProceed)}
        >
          <div className="absolute top-0 left-0 z-[-1]">
            <BackgroundModalDecorativeIcon />

            <div
              className="
                absolute top-6 left-6 w-12 h-12 flex items-center justify-center rounded-full
                border border-borderPrimary shadow-backgroundModalDecorative
              "
            >
              <PlusWithCircleIcon />
            </div>
          </div>
          <p className="text-primary text-lg font-semibold mt-16">
            Add new relationship
          </p>
          <p className="mt-1 text-tuna">
            This actions will start add a new wallet relationship
          </p>
          <div className="space-y-5 mt-5">
            <div>
              <Input
                name="label"
                label="Name"
                isRequired
                placeholder="Name"
                className="w-full appearance-none"
                maxLength={14}
              />
            </div>
            <div>
              <Input
                name="walletAddress"
                label="Address"
                placeholder="Address"
                className="w-full appearance-none"
                isRequired
                maxLength={66}
              />
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              className="w-56 h-[56px]"
              view={BUTTON_VIEWS.secondary}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              className="w-56 h-[56px]"
              type="submit"
              isLoading={inProcess}
              disabled={inProcess}
            >
              Confirm
            </Button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};
