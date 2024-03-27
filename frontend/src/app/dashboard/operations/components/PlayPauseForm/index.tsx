'use client';

import { FC, HTMLAttributes, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Skeleton from 'react-loading-skeleton';
import { twMerge } from 'tailwind-merge';

import PauseIcon from '@/../public/images/pause.svg?jsx';
import PlayIcon from '@/../public/images/play.svg?jsx';

import { Button } from '@/Components/Form/Button';
import { Checkbox, CHECKBOX_VIEWS } from '@/Components/Form/Checkbox';
import { Loader } from '@/Components/Loader';

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
  const { data: isPaused, isLoading: isPausedLoading } = useIsSystemPaused(stableCoin.deploy_data.pauser);
  const pauseSystem = usePauseSystem();
  const playSystem = usePlaySystem();

  const formMethods = useForm({
    defaultValues: {
      approve: false,
    },
  });

  const isApprove = formMethods.watch('approve');

  const onSubmit = useCallback(
    async () => {
      if (isPaused) {
        await playSystem.mutateAsync({
          pauser: stableCoin.deploy_data.pauser,
          packageName: stableCoin.package_name,
          packageId: stableCoin.deploy_data.packageId,
          tokenPolicyCap: stableCoin.deploy_data.token_policy_cap,
          tokenPolicy: stableCoin.deploy_data.token_policy,
        });
      }
      else {
        await pauseSystem.mutateAsync({
          pauser: stableCoin.deploy_data.pauser,
          packageName: stableCoin.package_name,
          packageId: stableCoin.deploy_data.packageId,
          tokenPolicyCap: stableCoin.deploy_data.token_policy_cap,
          tokenPolicy: stableCoin.deploy_data.token_policy,
        });
      }

      formMethods.reset();
    },
    [isPaused, pauseSystem, playSystem, stableCoin, formMethods]
  );

  return (
    <FormProvider {...formMethods}>
      <form
        className={twMerge(
          'border border-borderPrimary rounded-xl bg-white p-5 flex flex-col justify-between gap-3',
          className
        )}
        onSubmit={formMethods.handleSubmit(onSubmit)}
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
          <p className="text-grayText mt-6">
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
            className="h-12 w-full mt-6"
            type="submit"
            disabled={formMethods.formState.isSubmitting || !isApprove || isPausedLoading}
            isLoading={formMethods.formState.isSubmitting}
          >
            {
              isPaused
                ? 'Restart'
                : 'Pause'
            }
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
