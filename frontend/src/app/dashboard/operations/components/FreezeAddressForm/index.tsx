'use client';

import { FC, HTMLAttributes, useCallback, useEffect, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSuiClient } from '@mysten/dapp-kit';
import { isValidSuiAddress } from '@mysten/sui.js/utils';
import { twMerge } from 'tailwind-merge';
import * as yup from 'yup';

import LockIcon from '@/../public/images/lock.svg?jsx';

import { BalanceErrorModal } from '@/Components/BalanceErrorModal';
import { Button, BUTTON_VIEWS } from '@/Components/Form/Button';
import { Input } from '@/Components/Form/Input';
import { WalletTransactionConfirmModal } from '@/Components/WalletTransactionConfirmModal';
import { WalletTransactionSuccessfulModal } from '@/Components/WalletTransactionSuccessfulModal';

import { getShortAccountAddress } from '@/utils/string_formats';

import { isFrozenAccount, useFreezeAddress } from '@/hooks/useFreezeAddress';
import { StableCoin } from '@/hooks/useStableCoinsList';

export interface FreezeAddressFormData {
  address: string;
}

export interface FreezeAddressFormProps extends Omit<HTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  stableCoin: StableCoin;
  isPaused?: boolean;
}

export const FreezeAddressForm: FC<FreezeAddressFormProps> = ({
  className,
  stableCoin,
  isPaused,
  ...props
}) => {
  const freezeAddress = useFreezeAddress();
  const suiClient = useSuiClient();

  const [showFreezeAddressConfirm, setShowFreezeAddressConfirm] = useState<boolean>(false);
  const [showWalletTransactionSuccessfulModal, setShowWalletTransactionSuccessfulModal] = useState<boolean>(false);
  const [showBalanceErrorModal, setShowBalanceErrorModal] = useState<boolean>(false);
  const [lastTXID, setLastTXID] = useState<string>();
  const [isCheckFrozenAccountInProgress, setIsCheckFrozenAccountInProgress] = useState<boolean>(false);

  const freezeAddressFormSchema = yup.object().shape({
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
        name: 'is-frozen',
        test: async value => {
          try {
            setIsCheckFrozenAccountInProgress(true);

            return !(await isFrozenAccount(suiClient, stableCoin, value));
          }
          finally {
            setIsCheckFrozenAccountInProgress(false);
          }
        },
        message: 'This account is frozen',
      }),
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
        const { digest } = await freezeAddress.mutateAsync({
          walletAddress: address,
          packageName: stableCoin.package_name,
          packageId: stableCoin.deploy_addresses.packageId,
          tokenPolicyCap: stableCoin.deploy_addresses.token_policy_cap,
          tokenPolicy: stableCoin.deploy_addresses.token_policy,
        });

        formMethods.reset();
        setLastTXID(digest);
        setShowWalletTransactionSuccessfulModal(true);
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

  useEffect(
    () => {
      formMethods.reset();
      setShowFreezeAddressConfirm(false);
      setShowBalanceErrorModal(false);
    },
    [formMethods, stableCoin]
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
          <p className="text-mistBlue mt-4">
            You can freeze the transactions for your token of this particular address.
          </p>
          <div className="mt-4">
            <Input
              name="address"
              placeholder="Wallet address"
              maxLength={66}
              className="w-full !bg-transparent"
              disabled={isPaused}
              isLoading={isCheckFrozenAccountInProgress}
            />
          </div>
        </div>
        <Button
          className="h-[48px] w-full"
          type="submit"
          disabled={formMethods.formState.isSubmitting || isPaused}
          isLoading={formMethods.formState.isSubmitting}
          view={BUTTON_VIEWS.secondary}
        >
          Freeze This Address
        </Button>
      </form>
      <WalletTransactionConfirmModal
        view="alert"
        visible={showFreezeAddressConfirm}
        onClose={() => {
          setShowFreezeAddressConfirm(false);
          freezeAddress.reset();
        }}
        header="Are you sure to freeze this account?"
        description="This actions will block this account from sending and receiving tokens."
        onProceed={() => freezeWalletAddress({ address: walletAddress })}
        inProcess={freezeAddress.isPending}
        additionContent={(
          <div className="border border-borderPrimary p-4 rounded-xl mt-5">
            <div className="flex items-center gap-[2px]">
              <p className="text-primary font-semibold">
                Freeze this account
              </p>
            </div>
            <p className="text-xs font-semibold text-actionPrimary">
              {getShortAccountAddress(walletAddress, 25)}
            </p>
          </div>
        )}
      />
      <WalletTransactionSuccessfulModal
        visible={showWalletTransactionSuccessfulModal}
        onClose={() => {
          setShowWalletTransactionSuccessfulModal(false);
        }}
        header="Freeze successful"
        description="
          You have successfully freeze this wallet.
          To view the transaction for this operation, please click on the button below
        "
        txid={lastTXID}
      />
      <BalanceErrorModal
        visible={showBalanceErrorModal}
        onClose={() => setShowBalanceErrorModal(false)}
      />
    </FormProvider>
  );
};
