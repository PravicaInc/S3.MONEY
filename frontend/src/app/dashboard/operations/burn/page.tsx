'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAutoConnectWallet, useCurrentAccount } from '@mysten/dapp-kit';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import qs from 'qs';
import { twMerge } from 'tailwind-merge';
import * as yup from 'yup';

import { BalanceErrorModal } from '@/Components/BalanceErrorModal';
import { Button, BUTTON_VIEWS } from '@/Components/Form/Button';
import { Input } from '@/Components/Form/Input';
import { Loader } from '@/Components/Loader';
import { Tips } from '@/Components/Tips';

import { PAGES_URLS } from '@/utils/const';
import { numberFormat, numberNormalize } from '@/utils/string_formats';

import { useCurrentStableCoinBalance } from '@/hooks/useCurrentBalance';
import { useIsSystemPaused } from '@/hooks/usePlayPauseSystem';
import { useStableCoinsList } from '@/hooks/useStableCoinsList';
import { useBurnFrom, useStableCoinCurrentSupply, useStableCoinMaxSupply } from '@/hooks/useStableCoinSupply';

import { BurnConfirm } from './components/BurnConfirm';

export default function DashboardOperationsBurnPage() {
  const account = useCurrentAccount();
  const autoConnectionStatus = useAutoConnectWallet();
  const searchParams = useSearchParams();
  const router = useRouter();
  const {
    data,
    isLoading: isStableCoinsListLoading,
    isFetching: isStableCoinsListFetching,
  } = useStableCoinsList(account?.address);
  const burnFrom = useBurnFrom();

  const [showBurnConfirm, setShowBurnConfirm] = useState<boolean>(false);
  const [showBalanceErrorModal, setShowBalanceErrorModal] = useState<boolean>(false);

  const { coins: stableCoins = [] } = data || {};

  const isLoading = useMemo(
    () => autoConnectionStatus === 'idle',
    [autoConnectionStatus]
  );
  const isRedirecting = useMemo(
    () => autoConnectionStatus === 'attempted' && !account?.address,
    [autoConnectionStatus, account?.address]
  );
  const currentStableCoin = useMemo(
    () => stableCoins.find(({ txid }) => txid === searchParams.get('txid')),
    [searchParams, stableCoins]
  );

  const {
    data: currentStableCoinBalance,
    isFetching: isCurrentStableCoinBalanceFetching,
  } = useCurrentStableCoinBalance(account?.address, currentStableCoin);

  const {
    data: stableCoinCurrentSupply = 0,
    isFetching: isLoadingStableCoinCurrentSupply,
  } = useStableCoinCurrentSupply(currentStableCoin);
  const {
    data: stableCoinMaxSupply = 0,
    isFetching: isLoadingStableCoinMaxSupply,
  } = useStableCoinMaxSupply(currentStableCoin);
  const { data: isPaused, isLoading: isPausedLoading } = useIsSystemPaused(currentStableCoin?.deploy_addresses.pauser);

  const burnFormSchema = yup.object().shape({
    burnValue: yup
      .number()
      .typeError('Burn value is required.')
      .required('Burn value is required.')
      .moreThan(0, 'Burn value must be greater than 0.')
      .test({
        name: 'less-min',
        test: (value: number) => stableCoinCurrentSupply - value >= 0,
        message: 'New current Supply value must be greater than 0.',
      })
      .test({
        name: 'over-max',
        test: (value: number) => (currentStableCoinBalance || 0) - value >= 0,
        message: () => `You can't burn more than ${numberFormat(`${currentStableCoinBalance}`)} ${currentStableCoin?.ticker}.`,
      }),
    mainAccountAddress: yup
      .string(),
  });
  const formMethods = useForm({
    resolver: yupResolver(burnFormSchema),
    defaultValues: useMemo(
      () => ({
        burnValue: 0,
        mainAccountAddress: currentStableCoin?.deploy_addresses.deployer,
      }),
      [currentStableCoin]
    ),
  });

  const burnValue = formMethods.watch('burnValue');
  const mainAccountAddress = formMethods.watch('mainAccountAddress');

  const relatedInformationList = useMemo(
    () => [
      {
        text: 'Current Supply:',
        value: isLoadingStableCoinCurrentSupply
          ? <Loader className="h-4" />
          : `${numberFormat(`${stableCoinCurrentSupply}`)} ${currentStableCoin?.ticker}`,
      },
      {
        text: 'Total Supply after Burn:',
        value: isLoadingStableCoinCurrentSupply
          ? <Loader className="h-4" />
          : (
            burnValue && (stableCoinCurrentSupply - burnValue) >= 0
              ? `${numberFormat(`${stableCoinCurrentSupply - burnValue}`)} ${currentStableCoin?.ticker}`
              : '-'
          ),
      },
      {
        text: 'Supply Type:',
        value: isLoadingStableCoinMaxSupply
          ? <Loader className="h-4" />
          : (
            stableCoinMaxSupply
              ? `Finite (max ${numberFormat(`${stableCoinMaxSupply}`)} ${currentStableCoin?.ticker})`
              : 'Infinite'
          ),
      },
      ...[
        stableCoinMaxSupply && stableCoinCurrentSupply !== undefined
          ? {
            text: 'Left to threshold:',
            value: isLoadingStableCoinCurrentSupply || isLoadingStableCoinMaxSupply
              ? <Loader className="h-4" />
              : (
                burnValue && (stableCoinCurrentSupply - burnValue) >= 0
                  ? `
                    ${numberFormat(`${stableCoinMaxSupply - stableCoinCurrentSupply + (burnValue || 0)}`)}
                    ${currentStableCoin?.ticker}
                  `
                  : '-'
              ),
          }
          : [],
      ],
    ].flat(),
    [
      currentStableCoin,
      stableCoinCurrentSupply,
      isLoadingStableCoinCurrentSupply,
      stableCoinMaxSupply,
      isLoadingStableCoinMaxSupply,
      burnValue,
    ]
  );

  useEffect(
    () => {
      if (!isLoading && !isRedirecting && !isStableCoinsListFetching && !currentStableCoin) {
        router.replace(PAGES_URLS.home);
      }
    },
    [isLoading, isRedirecting, isStableCoinsListFetching, currentStableCoin, router]
  );

  useEffect(() => {
    formMethods.reset({
      burnValue: 0,
      mainAccountAddress: currentStableCoin?.deploy_addresses.deployer,
    });
    setShowBurnConfirm(false);
    setShowBalanceErrorModal(false);
  }, [formMethods, currentStableCoin]);

  useEffect(
    () => {
      if (isPaused) {
        router.replace(`${PAGES_URLS.dashboardOperations}?${qs.stringify({
          ...Object.fromEntries(searchParams.entries()),
          showPauseAlert: true,
        })}`);
      }
    },
    [isPaused, router, searchParams]
  );

  const onBurn = useCallback(
    async () => {
      try {
        if (currentStableCoin && mainAccountAddress) {
          await burnFrom.mutateAsync({
            deployAddresses: mainAccountAddress,
            packageName: currentStableCoin.package_name,
            packageId: currentStableCoin.deploy_addresses.packageId,
            treasuryCap: currentStableCoin.deploy_addresses.treasury_cap,
            tokenPolicy: currentStableCoin.deploy_addresses.token_policy,
            tokenSupply: currentStableCoin.deploy_addresses.token_supply,
            amount: burnValue,
          });

          formMethods.reset();

          toast.success(
            `
              You have successfully entered this amount: ${numberFormat(`${burnValue}`)} ${currentStableCoin.ticker}
              to be burned for the Main Account: ${mainAccountAddress}
            `,
            {
              className: 'w-[400px]',
            }
          );

          setShowBurnConfirm(false);
        }
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
    [currentStableCoin, formMethods, mainAccountAddress, burnFrom, burnValue]
  );

  return (
    <div
      className={twMerge(
        'max-w-screen-2xl mx-auto p-8',
        (isLoading || isRedirecting || isStableCoinsListLoading || isPausedLoading || isPaused || !currentStableCoin)
          && 'flex items-center justify-center h-full'
      )}
    >
      {
        !(isLoading || isRedirecting || isStableCoinsListLoading || isPausedLoading || isPaused) && currentStableCoin
          ? (
            <FormProvider {...formMethods}>
              <p className="text-2xl text-primary font-semibold">
                Burn
              </p>
              <form
                className="mt-8 grid grid-cols-5 gap-6"
                onSubmit={formMethods.handleSubmit(() => setShowBurnConfirm(true))}
              >
                <div className="bg-white border border-borderPrimary rounded-xl p-6 space-y-6 col-span-3">
                  <div>
                    <Input
                      name="burnValue"
                      label="Amount"
                      labelClassName="font-semibold text-primary mb-4"
                      isRequired
                      placeholder="Tokens to be burned"
                      className="w-full appearance-none"
                      setValueAs={value => value ? numberNormalize(value) : value}
                      onChange={({ target }) => {
                        target.value = target.value ? numberFormat(target.value) : target.value;
                      }}
                      maxLength={14}
                      suffix={currentStableCoin.ticker}
                    />
                    <p className="mt-2 text-[#666D80] text-xs h-4">
                      {
                        isCurrentStableCoinBalanceFetching
                          ? (
                            <Loader className="h-4" />
                          )
                          : (
                            <>
                              Maximum:
                              {' '}
                              {numberFormat(`${currentStableCoinBalance}`)}
                              {' '}
                              {currentStableCoin.ticker}
                              .
                            </>
                          )
                      }
                    </p>
                  </div>
                  <div>
                    <Input
                      name="mainAccountAddress"
                      label="Main Account Address"
                      labelClassName="text-[#696969] mb-4"
                      placeholder="Main Account Address"
                      className="w-full appearance-none"
                      disabled
                    />
                  </div>
                  <Tips
                    title="Tips on Burning"
                    tipsList={[
                      'Once a token is burned, it is irretrievably removed from circulation and cannot be recovered.',
                      'Ensure you are fully aware of potential consequences and risks before burning stable coins.',
                    ]}
                  />
                  <div className="flex items-center justify-between gap-6 mt-10">
                    <Link
                      className="w-full rounded-xl"
                      href={{
                        pathname: PAGES_URLS.dashboardOperations,
                        query: Object.fromEntries(searchParams.entries()),
                      }}
                    >
                      <Button
                        view={BUTTON_VIEWS.secondary}
                        className="h-12 w-full"
                      >
                        Back
                      </Button>
                    </Link>
                    <Button
                      className="h-12 w-full"
                      type="submit"
                      disabled={formMethods.formState.isSubmitting}
                      isLoading={formMethods.formState.isSubmitting}
                    >
                      Burn
                    </Button>
                  </div>
                </div>
                <div className="bg-white border border-borderPrimary rounded-xl h-fit col-span-2">
                  <p className="text-primary text-lg font-semibold p-5 border-b border-borderPrimary">
                    Related Information
                  </p>
                  <div className="px-5 py-6 space-y-4">
                    {relatedInformationList.map(({ text, value }) => (
                      <p key={text} className="text-sm font-medium flex justify-between items-baseline gap-2">
                        <span className="text-mistBlue whitespace-nowrap">
                          {text}
                        </span>
                        <span className="text-primary">
                          {value}
                        </span>
                      </p>
                    ))}
                  </div>
                </div>
              </form>
            </FormProvider>
          )
          : (
            <Loader className="h-8" />
          )
      }
      <BurnConfirm
        visible={showBurnConfirm}
        onClose={() => {
          setShowBurnConfirm(false);
          burnFrom.reset();
        }}
        walletAddress={mainAccountAddress}
        onProceed={onBurn}
        inProcess={burnFrom.isPending}
        amount={`${numberFormat(`${burnValue}`)} ${currentStableCoin?.ticker}`}
      />
      <BalanceErrorModal
        visible={showBalanceErrorModal}
        onClose={() => setShowBalanceErrorModal(false)}
      />
    </div>
  );
}
