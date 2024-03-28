'use client';

import { useCallback, useMemo, useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { useAutoConnectWallet, useCurrentAccount, useSignAndExecuteTransactionBlock } from '@mysten/dapp-kit';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { AxiosError } from 'axios';
import { twMerge } from 'tailwind-merge';

import { BalanceErrorModal } from '@/Components/BalanceErrorModal';
import { Footer } from '@/Components/Footer';
import { Loader } from '@/Components/Loader';
import { ProgressSteps } from '@/Components/ProgressSteps';
import { ProgressStepItem } from '@/Components/ProgressSteps/components/ProgressStep';

import { useBuildTransaction } from '@/hooks/useBuildTransaction';
import { useCreateStableCoin } from '@/hooks/useCreateStableCoin';

import { AssignDefaultPermissions, PermissionsStableCoinData } from './components/AssignDefaultPermissions';
import { InitialDetails, InitialStableCoinData } from './components/InitialDetails';
import { RolesAssignment, RolesStableCoinData } from './components/RolesAssignment';
import { StableCoinPreview } from './components/StableCoinPreview';
import { SuccessCreatedStableCoinModal } from './components/SuccessCreatedStableCoinModal';
import { SupplyDetails, SupplyStableCoinData, SupplyTypes } from './components/SupplyDetails';
import { TokenDetailsReviewConfirm } from './components/TokenDetailsReviewConfirm';

interface CreateStableCoinData
  extends InitialStableCoinData, SupplyStableCoinData, PermissionsStableCoinData {
    roles: RolesStableCoinData;
  }

export default function CreateStableCoinPage() {
  const autoConnectionStatus = useAutoConnectWallet();
  const account = useCurrentAccount();
  const createStableCoin = useCreateStableCoin();
  const signAndExecuteTransactionBlock = useSignAndExecuteTransactionBlock();
  const buildTransaction = useBuildTransaction();

  const [data, setData] = useState<Partial<CreateStableCoinData>>({});
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [progressSteps, setProgressSteps] = useState<Omit<ProgressStepItem, 'number'>[]>([
    {
      text: 'Initial Details',
      isActive: true,
    },
    {
      text: 'Supply Details',
    },
    {
      text: 'Permissions',
    },
    {
      text: 'Roles Assignment',
    },
  ]);
  const [showCreateStableCoinConfirm, setShowCreateStableCoinConfirm] = useState<boolean>(false);
  const [showSuccessCreatedStableCoinModal, setShowSuccessCreatedStableCoinModal] = useState<boolean>(false);
  const [showBalanceErrorModal, setShowBalanceErrorModal] = useState<boolean>(false);
  const [newStableCoinTxID, setNewStableCoinTxID] = useState<string>();
  const [excludeTickerNames, setExcludeTickerNames] = useState<string[]>([]);
  const [isStableCoinCreatedButNotPublished, setIsStableCoinCreatedButNotPublished] = useState<boolean>(false);

  const isLoading = useMemo(
    () => autoConnectionStatus === 'idle',
    [autoConnectionStatus]
  );
  const isRedirecting = useMemo(
    () => autoConnectionStatus === 'attempted' && !account?.address,
    [autoConnectionStatus, account?.address]
  );

  const goToNextStep = useCallback(
    () => {
      setCurrentStep(currentStep + 1);
      setProgressSteps(progressSteps.map((step, idx) => ({
        ...step,
        isActive: step.isActive || idx <= currentStep + 1,
      })));
    },
    [currentStep, progressSteps]
  );
  const runCreateStableCoin = useCallback(
    async () => {
      if (account?.address && data.name && data.ticker && data.decimals) {
        try {
          const { dependencies, modules } = await createStableCoin.create.mutateAsync({
            walletAddress: account.address,
            ticker: data.ticker,
            decimals: data.decimals,
            icon: data.icon || undefined,
            name: data.name,
            description: 'Created via S3.MONEY',
            maxSupply: data.maxSupply,
            initialSupply: data.initialSupply,
            roles: data?.roles,
          });

          setIsStableCoinCreatedButNotPublished(true);

          const txb = new TransactionBlock();

          const upgradeCapPolicy = txb.publish({ dependencies, modules });

          txb.transferObjects([upgradeCapPolicy], txb.pure(account.address));

          await buildTransaction.mutateAsync(txb);

          const transactionData = await signAndExecuteTransactionBlock.mutateAsync({
            transactionBlock: txb,
            requestType: 'WaitForLocalExecution',
            options: {
              showBalanceChanges: true,
              showEffects: true,
              showEvents: true,
              showInput: true,
              showObjectChanges: true,
            },
          });

          await createStableCoin.savePublishedStableCoin.mutateAsync({
            walletAddress: account?.address,
            ticker: data.ticker,
            transactionID: transactionData.digest,
            data: transactionData,
          });

          setShowCreateStableCoinConfirm(false);
          setShowSuccessCreatedStableCoinModal(true);
          setNewStableCoinTxID(transactionData.digest);
          setIsStableCoinCreatedButNotPublished(false);
        }
        catch (error) {
          if (error instanceof AxiosError) {
            if (
              error.response?.status === 400
                && (
                  error.response?.data?.message.includes('package directory already exists')
                    || error.response?.data?.message.includes('package already published')
                )
            ) {
              setCurrentStep(0);
              setShowCreateStableCoinConfirm(false);
              setExcludeTickerNames(currentValue => [...currentValue, data.ticker as string]);
            }
          }
          else if (
            error instanceof Error && (
              error.message.includes('Rejected from user')
                || error.message.includes('GasBalanceTooLow')
                || error.message.includes('No valid gas coins found for the transaction')
            )
          ) {
            await createStableCoin.removeNotPublishedStableCoin.mutateAsync({
              walletAddress: account?.address,
              ticker: data.ticker,
            });

            setIsStableCoinCreatedButNotPublished(false);

            if (
              error.message.includes('GasBalanceTooLow')
                || error.message.includes('No valid gas coins found for the transaction')
            ) {
              setShowBalanceErrorModal(true);
            }
          }
          else {
            throw error;
          }
        }
      }
    },
    [data, account?.address, createStableCoin, signAndExecuteTransactionBlock, buildTransaction]
  );
  const closeCreateStableCoinConfirm = useCallback(
    async () => {
      if (account?.address && data.ticker && isStableCoinCreatedButNotPublished) {
        await createStableCoin.removeNotPublishedStableCoin.mutateAsync({
          walletAddress: account.address,
          ticker: data.ticker,
        });

        signAndExecuteTransactionBlock.reset();
        setIsStableCoinCreatedButNotPublished(false);
      }

      setShowCreateStableCoinConfirm(false);
    },
    [createStableCoin, data, account, isStableCoinCreatedButNotPublished, signAndExecuteTransactionBlock]
  );

  const onInitialDetailsSubmit: SubmitHandler<InitialStableCoinData> = async initialStableCoinData => {
    setData(currentValue => ({
      ...currentValue,
      ...initialStableCoinData,
    }));
    goToNextStep();
  };

  const onSupplyDetailsSubmit: SubmitHandler<SupplyStableCoinData> = async supplyStableCoinData => {
    setData(currentValue => ({
      ...currentValue,
      ...supplyStableCoinData,
      supplyType: supplyStableCoinData.supplyType || SupplyTypes.Infinite,
    }));
    goToNextStep();
  };

  const onPermissionsSubmit: SubmitHandler<PermissionsStableCoinData> = permissionsStableCoinData => {
    setData(currentValue => ({
      ...currentValue,
      ...permissionsStableCoinData,
    }));
    goToNextStep();
  };

  const onRolesSubmit: SubmitHandler<RolesStableCoinData> = rolesStableCoinData => {
    setData(currentValue => ({
      ...currentValue,
      roles: rolesStableCoinData,
    }));
    setShowCreateStableCoinConfirm(true);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full grow">
      <div
        className={twMerge(
          'h-full w-full flex items-center justify-center',
          !(isLoading || isRedirecting) && 'hidden'
        )}
      >
        <Loader className="h-10" />
      </div>
      <div
        className={twMerge(
          'h-full w-full p-10',
          (isLoading || isRedirecting) && 'hidden'
        )}
      >
        <p className="font-semibold text-2xl text-primary">
          Create New Stablecoin
        </p>
        <ProgressSteps
          steps={progressSteps}
          className="mt-8"
        />
        <div className="mt-16 grid grid-cols-10 gap-6">
          <div className="bg-white border border-borderPrimary rounded-xl p-10 col-span-7 h-fit">
            {
              currentStep === 0 && (
                <InitialDetails
                  onSubmit={onInitialDetailsSubmit}
                  defaultValues={data}
                  excludeTickerNames={excludeTickerNames}
                />
              )
            }
            {
              currentStep === 1 && (
                <SupplyDetails
                  onSubmit={onSupplyDetailsSubmit}
                  defaultValues={data}
                />
              )
            }
            {
              currentStep === 2 && (
                <AssignDefaultPermissions
                  onSubmit={onPermissionsSubmit}
                />
              )
            }
            {
              currentStep === 3 && data.permissions && (
                <RolesAssignment
                  onSubmit={onRolesSubmit}
                  fields={data.permissions.map(({ value, label }) => ({
                    fieldName: value,
                    label: label.substring(0, label.indexOf('-')).trim(),
                  }))}
                />
              )
            }
          </div>
          {
            data.name && (
              <StableCoinPreview
                className="col-span-3 h-fit"
                {...data}
              />
            )
          }
        </div>
      </div>
      <Footer className="w-full px-6 pb-6" />
      <TokenDetailsReviewConfirm
        visible={showCreateStableCoinConfirm}
        onClose={closeCreateStableCoinConfirm}
        onProceed={runCreateStableCoin}
        inCancelDisabled={
          createStableCoin.create.isPending
            || createStableCoin.savePublishedStableCoin.isPending
        }
        inCancelProgress={createStableCoin.removeNotPublishedStableCoin.isPending}
        inProcess={
          createStableCoin.create.isPending
            || createStableCoin.removeNotPublishedStableCoin.isPending
            || createStableCoin.savePublishedStableCoin.isPending
            || signAndExecuteTransactionBlock.isPending
            || buildTransaction.isPending
        }
      />
      <SuccessCreatedStableCoinModal
        visible={showSuccessCreatedStableCoinModal}
        onClose={() => {}}
        txid={newStableCoinTxID}
      />
      <BalanceErrorModal
        visible={showBalanceErrorModal}
        onClose={() => setShowBalanceErrorModal(false)}
      />
    </div>
  );
}
