import { FC, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { twMerge } from 'tailwind-merge';
import * as yup from 'yup';

import BackgroundModalDecorativeIcon from '@/../public/images/background_modal_decorative.svg?jsx';
import PlusWithCircleIcon from '@/../public/images/plus_with_circle.svg?jsx';

import { Button, BUTTON_VIEWS } from '@/Components/Form/Button';
import { Input } from '@/Components/Form/Input';
import { Modal, ModalProps } from '@/Components/Modal';

export interface EditRelationFormData {
  label: string;
}

export interface EditRelationModalProps extends ModalProps {
  onProceed: ({ label }: EditRelationFormData) => void;
  inProcess?: boolean;
  excludeNames?: string[];
  defaultValues?: EditRelationFormData;
}

export const EditRelationModal: FC<EditRelationModalProps> = ({
  visible,
  onClose,
  className,
  onProceed,
  inProcess,
  excludeNames,
  defaultValues,
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
  });
  const formMethods = useForm({
    resolver: yupResolver(createRelationFormSchema),
    defaultValues,
  });

  useEffect(
    () => {
      if (visible) {
        formMethods.reset(defaultValues);
      }
    },
    [visible, defaultValues, formMethods]
  );

  return (
    <Modal
      visible={visible}
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
          <p className="text-primary text-lg font-semibold mt-[88px]">
            Edit name
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
