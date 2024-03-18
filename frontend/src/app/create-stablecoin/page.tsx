'use client';

import { useCallback, useMemo, useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { useAutoConnectWallet, useCurrentAccount, useSignAndExecuteTransactionBlock } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { twMerge } from 'tailwind-merge';

import defaultStablecoinIconURI from '@/../public/images/default_stablecoin_icon.png';

import { Footer } from '@/Components/Footer';
import { Loader } from '@/Components/Loader';
import { ProgressSteps } from '@/Components/ProgressSteps';
import { ProgressStepItem } from '@/Components/ProgressSteps/components/ProgressStep';

import { useCreateStableCoin } from '@/hooks/useCreateStableCoin';

import { AssignDefaultPermissions, PermissionsStableCoinData } from './components/AssignDefaultPermissions';
import { InitialDetails, InitialStableCoinData } from './components/InitialDetails';
import { StableCoinPreview } from './components/StableCoinPreview';
import { SuccessCreatedStableCoinModal } from './components/SuccessCreatedStableCoinModal';
import { SupplyDetails, SupplyStableCoinData, SupplyTypes } from './components/SupplyDetails';
import { TokenDetailsReviewConfirm } from './components/TokenDetailsReviewConfirm';

interface CreateStableCoinData extends InitialStableCoinData, SupplyStableCoinData {}

export default function CreateStableCoinPage() {
  const autoConnectionStatus = useAutoConnectWallet();
  const account = useCurrentAccount();
  const createStableCoin = useCreateStableCoin();
  const signAndExecuteTransactionBlock = useSignAndExecuteTransactionBlock();

  const [data, setData] = useState<Partial<CreateStableCoinData>>({});
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [progressSteps, setProgressSteps] = useState<Omit<ProgressStepItem, 'number'>[]>([
    {
      text: 'Initial Details',
      isActive: true,
    },
    {
      text: 'Supply Details',
      isActive: false,
    },
    {
      text: 'Permissions',
      isActive: false,
    },
  ]);
  const [showCreateStableCoinConfirm, setShowCreateStableCoinConfirm] = useState<boolean>(false);
  const [showSuccessCreatedStableCoinModal, setShowSuccessCreatedStableCoinModal] = useState<boolean>(false);

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
        isActive: idx <= currentStep + 1,
      })));
    },
    [currentStep, progressSteps]
  );

  const onInitialDetailsSubmit: SubmitHandler<InitialStableCoinData> = async initialStableCoinData => {
    setData(currentValue => ({
      ...currentValue,
      ...initialStableCoinData,
      icon: initialStableCoinData.icon || `${location.origin}${defaultStablecoinIconURI.src}`,
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
    setShowCreateStableCoinConfirm(true);
  };

  const runCreateStableCoin = useCallback(
    async () => {
      if (account?.address && data.name && data.ticker && data.decimals) {
        const { dependencies, modules } = await createStableCoin.mutateAsync({
          walletAddress: account?.address,
          packageName: data.name,
          ticker: data.ticker,
          decimals: data.decimals,
          icon: data.icon,
          name: data.name,
          description: 'Created via S3.MONEY',
          maxSupply: data.maxSupply,
          initialSupply: data.initialSupply,
        });
        const txb = new TransactionBlock();

        const upgradeCapPolicy = txb.publish({ dependencies, modules });

        txb.transferObjects([upgradeCapPolicy], txb.pure(account?.address));

        await signAndExecuteTransactionBlock.mutateAsync({
          transactionBlock: txb,
          chain: getFullnodeUrl('testnet'),
          requestType: 'WaitForLocalExecution',
          options: {
            showBalanceChanges: true,
            showEffects: true,
            showEvents: true,
            showInput: true,
            showObjectChanges: true,
            showRawInput: true,
          },
        });

        setShowCreateStableCoinConfirm(false);
        setShowSuccessCreatedStableCoinModal(true);
      }
    },
    [data, account?.address, createStableCoin, signAndExecuteTransactionBlock]
  );

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
                />
              )
            }
            {
              currentStep === 1 && (
                <SupplyDetails
                  onSubmit={onSupplyDetailsSubmit}
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
        onClose={() => setShowCreateStableCoinConfirm(false)}
        onProceed={runCreateStableCoin}
        inProcess={createStableCoin.isPending || signAndExecuteTransactionBlock.isPending}
      />
      <SuccessCreatedStableCoinModal
        visible={showSuccessCreatedStableCoinModal}
        onClose={() => {}}
      />
    </div>
  );
}
