'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAutoConnectWallet, useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import { isValidSuiAddress } from '@mysten/sui.js/utils';
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
import { WalletTransactionConfirmModal } from '@/Components/WalletTransactionConfirmModal';
import { WalletTransactionSuccessfulModal } from '@/Components/WalletTransactionSuccessfulModal';

import { PAGES_URLS } from '@/utils/const';
import { getShortAccountAddress, numberFormat, numberNormalize } from '@/utils/string_formats';

import { useAllocate } from '@/hooks/useAllocate';
import { useCurrentStableCoinBalance } from '@/hooks/useCurrentBalance';
import { isFrozenAccount } from '@/hooks/useFreezeAddress';
import { useIsSystemPaused } from '@/hooks/usePlayPauseSystem';
import { useStableCoinsList } from '@/hooks/useStableCoinsList';

export default function DashboardOperationsAllocatePage() {
  const account = useCurrentAccount();
  const autoConnectionStatus = useAutoConnectWallet();
  const searchParams = useSearchParams();
  const router = useRouter();
  const {
    data,
    isLoading: isStableCoinsListLoading,
    isFetching: isStableCoinsListFetching,
  } = useStableCoinsList(account?.address);
  const allocate = useAllocate();
  const suiClient = useSuiClient();

  const [showAllocateConfirm, setShowAllocateConfirm] = useState<boolean>(false);
  const [showWalletTransactionSuccessfulModal, setShowWalletTransactionSuccessfulModal] = useState<boolean>(false);
  const [showBalanceErrorModal, setShowBalanceErrorModal] = useState<boolean>(false);
  const [lastTXID, setLastTXID] = useState<string>();
  const [isCheckFrozenAccountInProgress, setIsCheckFrozenAccountInProgress] = useState<boolean>(false);

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
  const { data: isPaused, isLoading: isPausedLoading } = useIsSystemPaused(currentStableCoin?.deploy_addresses.pauser);

  const allocateFormSchema = yup.object().shape({
    allocateValue: yup
      .number()
      .typeError('Allocate value is required.')
      .required('Allocate value is required.')
      .moreThan(0, 'Allocate value must be greater than 0.')
      .test({
        name: 'over-max',
        test: (value: number) => (currentStableCoinBalance || 0) - value >= 0,
        message: () => `Allocate value must not exceed ${numberFormat(`${currentStableCoinBalance}`)} ${currentStableCoin?.ticker}.`,
      }),
    accountAddress: yup
      .string()
      .required('Account address is required.')
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

            return !(await isFrozenAccount(suiClient, currentStableCoin, value));
          }
          finally {
            setIsCheckFrozenAccountInProgress(false);
          }
        },
        message: 'This account is frozen',
      }),
  });
  const formMethods = useForm({
    resolver: yupResolver(allocateFormSchema),
    defaultValues: useMemo(
      () => ({
        allocateValue: 0,
        accountAddress: '',
      }),
      []
    ),
  });

  const allocateValue = formMethods.watch('allocateValue');
  const accountAddress = formMethods.watch('accountAddress');

  useEffect(
    () => {
      if (!isLoading && !isRedirecting && !isStableCoinsListFetching && !currentStableCoin) {
        router.replace(PAGES_URLS.home);
      }
    },
    [isLoading, isRedirecting, isStableCoinsListFetching, currentStableCoin, router]
  );

  useEffect(
    () => {
      if (isPaused) {
        router.replace(`${PAGES_URLS.dashboardOperations}?${qs.stringify({
          ...Object.fromEntries(searchParams.entries()),
          showPauseAlert: true,
        })}`);
      }
      else if (currentStableCoin && !currentStableCoin?.address_roles.includes('cashIn')) {
        router.replace(`${PAGES_URLS.dashboardOperations}?${qs.stringify({
          ...Object.fromEntries(searchParams.entries()),
        })}`);
      }
    },
    [currentStableCoin, isPaused, router, searchParams]
  );

  useEffect(() => {
    setShowAllocateConfirm(false);
    setShowBalanceErrorModal(false);
    formMethods.reset();
  }, [formMethods, currentStableCoin]);

  const onAllocate = useCallback(
    async () => {
      try {
        if (currentStableCoin && account?.address && accountAddress) {
          const { digest } = await allocate.mutateAsync({
            senderAddresses: account.address,
            recipientAddresses: accountAddress,
            packageName: currentStableCoin.package_name,
            cashCap: currentStableCoin.deploy_addresses.cash_cap,
            packageId: currentStableCoin.deploy_addresses.packageId,
            treasuryCap: currentStableCoin.deploy_addresses.treasury_cap,
            tokenPolicy: currentStableCoin.deploy_addresses.token_policy,
            tokenSupply: currentStableCoin.deploy_addresses.token_supply,
            amount: allocateValue,
          });

          formMethods.reset();

          setLastTXID(digest);
          setShowAllocateConfirm(false);
          setShowWalletTransactionSuccessfulModal(true);
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
    [currentStableCoin, account, accountAddress, allocate, allocateValue, formMethods]
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
                Allocate
              </p>
              <p className="mt-1 text-sm text-riverBed">
                Issuers can allocate some authorized tokens to the circulation for public.
              </p>
              <form
                className="mt-8 grid grid-cols-5 gap-6"
                onSubmit={formMethods.handleSubmit(() => setShowAllocateConfirm(true))}
              >
                <div className="bg-white border border-borderPrimary rounded-xl p-6 space-y-6 col-span-5">
                  <div>
                    <Input
                      name="accountAddress"
                      label="Address"
                      labelClassName="font-semibold text-primary mb-4"
                      placeholder="Address"
                      className="w-full appearance-none"
                      isRequired
                      maxLength={66}
                      isLoading={isCheckFrozenAccountInProgress}
                    />
                  </div>
                  <div>
                    <Input
                      name="allocateValue"
                      label="Allocation Amount"
                      labelClassName="font-semibold text-primary mb-4"
                      isRequired
                      placeholder="Tokens to be allocated"
                      className="w-full appearance-none"
                      setValueAs={value => value ? numberNormalize(value) : value}
                      onChange={({ target }) => {
                        target.value = target.value ? numberFormat(target.value) : target.value;
                      }}
                      maxLength={14}
                      suffix={currentStableCoin.ticker}
                    />
                    <p className="mt-2 text-mistBlue text-xs h-4">
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
                  <Tips
                    title="Tips on Allocation"
                    tipsList={[
                      `
                        This involves transferring tokens from the main account to the Treasury account,
                        preparing them for circulation and delivery to the Related Accounts.
                      `,
                      `
                        The Treasury Account should be fully verified and operational before starting
                        the allocation process.
                      `,
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
                      Allocate
                    </Button>
                  </div>
                </div>
              </form>
            </FormProvider>
          )
          : (
            <Loader className="h-8" />
          )
      }
      <WalletTransactionConfirmModal
        visible={showAllocateConfirm}
        view="alert"
        onClose={() => {
          setShowAllocateConfirm(false);
          allocate.reset();
        }}
        header="Are you sure to allocate this to the address?"
        description="This actions will start the allocation process to the address with the allocation amount stated."
        onProceed={onAllocate}
        inProcess={allocate.isPending}
        additionContent={(
          <div className="border border-borderPrimary p-4 rounded-xl mt-5">
            <div className="flex items-center justify-between">
              <p className="text-primary font-semibold">
                Allocation
              </p>
              <p className="text-shamrockGreen text-sm font-semibold">
                +
                {numberFormat(`${allocateValue}`)}
              </p>
            </div>
            <p className="text-xs font-semibold text-actionPrimary">
              {
                accountAddress
                  ? getShortAccountAddress(accountAddress, 25)
                  : ''
              }
            </p>
          </div>
        )}
      />
      <WalletTransactionSuccessfulModal
        visible={showWalletTransactionSuccessfulModal}
        onClose={() => {
          setShowWalletTransactionSuccessfulModal(false);
        }}
        header="Allocation successful"
        description="
          The operation is successful. To view the transaction for this operation, please click on the button below
        "
        txid={lastTXID}
      />
      <BalanceErrorModal
        visible={showBalanceErrorModal}
        onClose={() => setShowBalanceErrorModal(false)}
      />
    </div>
  );
}
