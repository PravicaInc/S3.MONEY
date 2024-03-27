'use client';

import { FC, HTMLAttributes, useCallback, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import { twMerge } from 'tailwind-merge';
import * as yup from 'yup';

import LockIcon from '@/../public/images/lock.svg?jsx';

import { BalanceErrorModal } from '@/Components/BalanceErrorModal';
import { Button } from '@/Components/Form/Button';
import { Input } from '@/Components/Form/Input';

import { useFreezeAddress } from '@/hooks/useFreezeAddress';
import { StableCoin } from '@/hooks/useStableCoinsList';

import { FreezeAddressConfirm } from './components/FreezeAddressConfirm';

export interface FreezeAddressFormData {
  address: string;
}

export interface FreezeAddressFormProps extends Omit<HTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  stableCoin: StableCoin;
}

export const FreezeAddressForm: FC<FreezeAddressFormProps> = ({
  className,
  stableCoin,
  ...props
}) => {
  const freezeAddress = useFreezeAddress();

  const [showFreezeAddressConfirm, setShowFreezeAddressConfirm] = useState<boolean>(false);
  const [showBalanceErrorModal, setShowBalanceErrorModal] = useState<boolean>(false);

  const freezeAddressFormSchema = yup.object().shape({
    address: yup
      .string()
      .trim()
      .required('Wallet address is required.')
      .matches(/^0[xX][a-fA-F0-9]{64}$/, 'Wallet address is incorrect.'),
  });
  const formMethods = useForm({
    resolver: yupResolver(freezeAddressFormSchema),
    defaultValues: {
      address: '',
    },
  });
  const walletAddress = formMethods.watch('address');

  const freezeWalletAddress: SubmitHandler<FreezeAddressFormData> = useCallback(
    async ({ address }) => {
      try {
        await freezeAddress.mutateAsync({
          walletAddress: address,
          packageName: stableCoin.package_name,
          packageId: stableCoin.deploy_data.packageId,
          tokenPolicyCap: stableCoin.deploy_data.token_policy_cap,
          tokenPolicy: stableCoin.deploy_data.token_policy,
        });

        formMethods.reset();
        toast.success(
          `You successfully block this account ${address} from sending and receiving tokens`,
          {
            className: 'w-[400px]',
          }
        );
        setShowFreezeAddressConfirm(false);
      }
      catch (error) {
        if (
          error instanceof Error && (
            error.message.includes('GasBalanceTooLow')
              || error.message.includes('No valid gas coins found for the transaction')
          )
        ) {
          setShowBalanceErrorModal(true);
        }
        else {
          throw error;
        }
      }
    },
    [freezeAddress, stableCoin, formMethods]
  );

  return (
    <FormProvider {...formMethods}>
      <form
        className={twMerge(
          'border border-borderPrimary rounded-xl bg-white p-5 flex flex-col justify-between gap-3',
          className
        )}
        onSubmit={formMethods.handleSubmit(() => setShowFreezeAddressConfirm(true))}
        {...props}
      >
        <div>
          <div className="flex items-center gap-4">
            <div
              className="bg-antiqueWhite min-w-10 min-h-10 flex items-center justify-center rounded-full shadow-operationIcon"
            >
              <LockIcon />
            </div>
            <p className="text-primary text-xl font-semibold">
              Freeze Address
            </p>
          </div>
          <p className="text-grayText mt-4">
            You can freeze the transactions for your token of this particular address.
          </p>
          <Input
            name="address"
            placeholder="Wallet Address"
            maxLength={66}
            className="w-full mt-4"
          />
        </div>
        <Button
          className="h-[48px] w-full"
          type="submit"
          disabled={formMethods.formState.isSubmitting}
          isLoading={formMethods.formState.isSubmitting}
        >
          Freeze Account
        </Button>
      </form>
      <FreezeAddressConfirm
        visible={showFreezeAddressConfirm}
        onClose={() => setShowFreezeAddressConfirm(false)}
        walletAddress={walletAddress}
        onProceed={() => freezeWalletAddress({ address: walletAddress })}
        inProcess={freezeAddress.isPending}
      />
      <BalanceErrorModal
        visible={showBalanceErrorModal}
        onClose={() => setShowBalanceErrorModal(false)}
      />
    </FormProvider>
  );
};
