'use client';

import { FC, HTMLAttributes, useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Skeleton from 'react-loading-skeleton';
import { twMerge } from 'tailwind-merge';

import PauseIcon from '@/../public/images/pause.svg?jsx';
import PlayIcon from '@/../public/images/play.svg?jsx';

import { BalanceErrorModal } from '@/Components/BalanceErrorModal';
import { Button, BUTTON_VIEWS } from '@/Components/Form/Button';
import { Checkbox, CHECKBOX_VIEWS } from '@/Components/Form/Checkbox';
import { Loader } from '@/Components/Loader';
import { WalletTransactionConfirmModal } from '@/Components/WalletTransactionConfirmModal';
import { WalletTransactionSuccessfulModal } from '@/Components/WalletTransactionSuccessfulModal';

import { useIsSystemPaused, usePauseSystem, usePlaySystem } from '@/hooks/usePlayPauseSystem';
import { StableCoin } from '@/hooks/useStableCoinsList';

export interface PauseFormProps extends Omit<HTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  stableCoin: StableCoin;
}

export const PlayPauseForm: FC<PauseFormProps> = ({
  className,
  stableCoin,
  ...props
}) => {
  const { data: isPaused, isLoading: isPausedLoading } = useIsSystemPaused(stableCoin.deploy_addresses.pauser);
  const pauseSystem = usePauseSystem();
  const playSystem = usePlaySystem();

  const [showWalletTransactionConfirmModal, setShowWalletTransactionConfirmModal] = useState<boolean>(false);
  const [showWalletTransactionSuccessfulModal, setShowWalletTransactionSuccessfulModal] = useState<boolean>(false);
  const [showBalanceErrorModal, setShowBalanceErrorModal] = useState<boolean>(false);
  const [lastPauseTXID, setLastPauseTXID] = useState<string>();
  const [lastPlayTXID, setLastPlayTXID] = useState<string>();

  const formMethods = useForm({
    defaultValues: {
      approve: false,
    },
  });

  const isApprove = formMethods.watch('approve');

  const onSubmit = useCallback(
    async () => {
      try {
        setLastPauseTXID('');
        setLastPlayTXID('');

        if (isPaused) {
          const { digest } = await playSystem.mutateAsync({
            pauser: stableCoin.deploy_addresses.pauser,
            packageName: stableCoin.package_name,
            packageId: stableCoin.deploy_addresses.packageId,
            tokenPolicyCap: stableCoin.deploy_addresses.token_policy_cap,
            tokenPolicy: stableCoin.deploy_addresses.token_policy,
          });

          setLastPlayTXID(digest);
        }
        else {
          const { digest } = await pauseSystem.mutateAsync({
            pauser: stableCoin.deploy_addresses.pauser,
            packageName: stableCoin.package_name,
            packageId: stableCoin.deploy_addresses.packageId,
            tokenPolicyCap: stableCoin.deploy_addresses.token_policy_cap,
            tokenPolicy: stableCoin.deploy_addresses.token_policy,
          });

          setLastPauseTXID(digest);
        }

        setShowWalletTransactionConfirmModal(false);
        setShowWalletTransactionSuccessfulModal(true);
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

      formMethods.reset();
    },
    [isPaused, pauseSystem, playSystem, stableCoin, formMethods]
  );

  useEffect(
    () => {
      formMethods.reset();
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
        onSubmit={formMethods.handleSubmit(() => setShowWalletTransactionConfirmModal(true))}
        {...props}
      >
        <div>
          <div className="flex items-center gap-4">
            <div
              className="bg-antiqueWhite min-w-10 min-h-10 flex items-center justify-center rounded-full shadow-operationIcon"
            >
              {
                isPausedLoading || formMethods.formState.isSubmitting
                  ? <Loader className="h-5" />
                  : (
                    isPaused
                      ? <PlayIcon />
                      : <PauseIcon />
                  )
              }
            </div>
            <p className="text-primary text-xl font-semibold w-full">
              {
                isPausedLoading
                  ? <Skeleton className="w-1/2" />
                  : (
                    isPaused
                      ? 'Restart System'
                      : 'Pause System'
                  )
              }
            </p>
          </div>
          <p className="text-mistBlue mt-6">
            {
              isPausedLoading
                ? <Skeleton count={2} />
                : (
                  isPaused
                    ? `
                      By confirming this, all operations of the system will be started again i.e
                      transfers, burn, mint...etc
                    `
                    : `
                      By confirming this, all operations of the system will be paused temporarily such:
                      transfers, burn, mint...etc
                    `
                )
            }
          </p>
        </div>
        <div>
          <Checkbox
            name="approve"
            label={
              isPausedLoading
                ? <Skeleton className="w-1/2" />
                : (
                  isPaused
                    ? 'Yes, I want to restart the system again.'
                    : 'I am aware about this action circumstances.'
                )
            }
            disabled={isPausedLoading}
            view={CHECKBOX_VIEWS.rounded}
          />
          <Button
            view={BUTTON_VIEWS.secondary}
            className="h-12 w-full mt-6"
            type="submit"
            disabled={
              formMethods.formState.isSubmitting
                || !isApprove
                || isPausedLoading
                || pauseSystem.isPending
                || playSystem.isPending
            }
            isLoading={formMethods.formState.isSubmitting || pauseSystem.isPending || playSystem.isPending}
          >
            {
              isPaused
                ? 'Restart'
                : 'Pause'
            }
          </Button>
        </div>
      </form>
      <WalletTransactionConfirmModal
        visible={showWalletTransactionConfirmModal}
        view="alert"
        onClose={() => setShowWalletTransactionConfirmModal(false)}
        header={
          isPaused
            ? 'Are you sure to restart the system?'
            : 'Are you sure to pause the system temporarily?'
        }
        description={
          isPaused
            ? 'By confirming this, all operations of the system will be restarted such: transfers, burn, mint...etc'
            : `
              By confirming this, all operations of the system will be paused
              temporarily such: transfers, burn, mint...etc
            `
        }
        onProceed={onSubmit}
        inProcess={pauseSystem.isPending || playSystem.isPending}
        additionContent={(
          <div className="border border-borderPrimary p-4 rounded-xl mt-5">
            <div className="flex items-center gap-[2px]">
              <p className="text-primary font-semibold">
                {stableCoin.ticker}
              </p>
              <p className="text-mistBlue text-sm">
                {stableCoin.name}
              </p>
            </div>
            <p className="text-xs font-semibold text-actionPrimary">
              {stableCoin.txid}
            </p>
          </div>
        )}
        processButtonText={isPaused ? 'Restart' : 'Pause'}
        processButtonView={isPaused ? BUTTON_VIEWS.primary : BUTTON_VIEWS.red}
      />
      <WalletTransactionSuccessfulModal
        visible={showWalletTransactionSuccessfulModal}
        onClose={() => {
          setShowWalletTransactionSuccessfulModal(false);
        }}
        header={
          lastPlayTXID
            ? 'Restart successful'
            : 'Pause successful'
        }
        description={
          lastPlayTXID
            ? `
              You have successfully restart this stablecoin.
              To view the transaction for this operation, please click on the button below
            `
            : `
              You have successfully pause this stablecoin.
              To view the transaction for this operation, please click on the button below
            `
        }
        txid={lastPauseTXID || lastPlayTXID}
      />
      <BalanceErrorModal
        visible={showBalanceErrorModal}
        onClose={() => setShowBalanceErrorModal(false)}
      />
    </FormProvider>
  );
};
