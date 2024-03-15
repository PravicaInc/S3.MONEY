'use client';

import { useCallback, useMemo, useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { useAutoConnectWallet, useCurrentAccount } from '@mysten/dapp-kit';
import { twMerge } from 'tailwind-merge';

import { Footer } from '@/Components/Footer';
import { Loader } from '@/Components/Loader';
import { ProgressSteps } from '@/Components/ProgressSteps';
import { ProgressStepItem } from '@/Components/ProgressSteps/components/ProgressStep';

import { AssignDefaultPermissions, PermissionsStableCoinData } from './components/AssignDefaultPermissions';
import { InitialDetails, InitialStableCoinData } from './components/InitialDetails';
import { SupplyDetails, SupplyStableCoinData, SupplyTypes } from './components/SupplyDetails';
import { StableCoinPreview } from './StableCoinPreview';

interface CreateStableCoinData extends InitialStableCoinData, SupplyStableCoinData {}

export default function CreateStableCoinPage() {
  const autoConnectionStatus = useAutoConnectWallet();
  const account = useCurrentAccount();

  const [data, setData] = useState<Partial<CreateStableCoinData>>({
    icon: `
      data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzIiIGhlaWdodD0iNzIiIHZpZXdCb3g9IjAgMCA3MiA3MiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjcyIiBoZWlnaHQ9IjcyIiByeD0iMTYiIGZpbGw9IiM2RkJDRjAiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yMC40MjEzIDUyLjc4MzhDMjMuNjQ5NiA1OC4zNzYgMjkuNDMyMSA2MS43MTQyIDM1Ljg4ODggNjEuNzE0MkM0Mi4zNDU1IDYxLjcxNDIgNDguMTI3IDU4LjM3NiA1MS4zNTY0IDUyLjc4MzhDNTQuNTg0OCA0Ny4xOTI2IDU0LjU4NDggNDAuNTE2MyA1MS4zNTY0IDM0LjkyNEwzNy43NTI0IDExLjM2MTVDMzYuOTI0MSA5LjkyNzAxIDM0Ljg1MzUgOS45MjcwMSAzNC4wMjUzIDExLjM2MTVMMjAuNDIxMyAzNC45MjRDMTcuMTkyOSA0MC41MTUyIDE3LjE5MjkgNDcuMTkxNSAyMC40MjEzIDUyLjc4MzhaTTMyLjA1NjYgMjIuNTcxM0wzNC45NTcxIDE3LjU0NzRDMzUuMzcxMiAxNi44MzAxIDM2LjQwNjUgMTYuODMwMSAzNi44MjA2IDE3LjU0NzRMNDcuOTc5MSAzNi44NzQ4QzUwLjAyOTEgNDAuNDI1NCA1MC40MTM5IDQ0LjUzNSA0OS4xMzM1IDQ4LjI5NTRDNDkuMDAwMiA0Ny42ODE5IDQ4LjgxMzggNDcuMDU0MiA0OC41NjI2IDQ2LjQyMDFDNDcuMDIxMyA0Mi41MzA0IDQzLjUzNjMgMzkuNTI4OSAzOC4yMDIzIDM3LjQ5ODJDMzQuNTM1MSAzNi4xMDcxIDMyLjE5NDMgMzQuMDYxMyAzMS4yNDMxIDMxLjQxNzFDMzAuMDE4IDI4LjAwODkgMzEuMjk3NiAyNC4yOTI0IDMyLjA1NjYgMjIuNTcxM1pNMjcuMTEwNyAzMS4xMzc5TDIzLjc5ODYgMzYuODc0OEMyMS4yNzQ4IDQxLjI0NTkgMjEuMjc0OCA0Ni40NjQxIDIzLjc5ODYgNTAuODM1M0MyNi4zMjIzIDU1LjIwNjQgMzAuODQxMyA1Ny44MTUgMzUuODg4OCA1Ny44MTVDMzkuMjQxMyA1Ny44MTUgNDIuMzYxNSA1Ni42NjMzIDQ0LjgxODQgNTQuNjA4OEM0NS4xMzg4IDUzLjgwMjEgNDYuMTMxIDUwLjg0OTIgNDQuOTA1MiA0Ny44MDU4QzQzLjc3MyA0NC45OTU0IDQxLjA0ODIgNDIuNzUxOSAzNi44MDYxIDQxLjEzNkMzMi4wMTEgMzkuMzE3MSAyOC44OTU4IDM2LjQ3NzQgMjcuNTQ4NiAzMi42OTg0QzI3LjM2MzEgMzIuMTc4MSAyNy4yMTg5IDMxLjY1NjggMjcuMTEwNyAzMS4xMzc5WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+
    `,
  });
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
    }));
    goToNextStep();

    // eslint-disable-next-line no-console
    console.log(initialStableCoinData);
  };

  const onSupplyDetailsSubmit: SubmitHandler<SupplyStableCoinData> = async supplyStableCoinData => {
    setData(currentValue => ({
      ...currentValue,
      ...supplyStableCoinData,
      supplyType: supplyStableCoinData.supplyType || SupplyTypes.Infinite,
    }));
    goToNextStep();

    // eslint-disable-next-line no-console
    console.log(supplyStableCoinData);
  };

  const onPermissionsSubmit: SubmitHandler<PermissionsStableCoinData> = async permissionsStableCoinData => {
    setData(currentValue => ({
      ...currentValue,
      ...permissionsStableCoinData,
    }));
    // goToNextStep();

    // eslint-disable-next-line no-console
    console.log(permissionsStableCoinData);
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
          'h-full w-full px-10 py-20',
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
      <Footer className="w-full px-6 pb-12" />
    </div>
  );
}
