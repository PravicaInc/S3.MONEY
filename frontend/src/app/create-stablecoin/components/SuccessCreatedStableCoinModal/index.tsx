'use client';

import { FC } from 'react';
import { useSuiClientContext } from '@mysten/dapp-kit';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import BackgroundModalDecorativeIcon from '@/../public/images/background_modal_decorative_left.svg?jsx';
import CheckedWithCircleIcon from '@/../public/images/checked_with_circle.svg?jsx';

import { Button, BUTTON_VIEWS } from '@/Components/Form/Button';
import { Modal, ModalProps } from '@/Components/Modal';

import { PAGES_URLS } from '@/utils/const';

export interface SuccessCreatedStableCoinModalProps extends ModalProps {
  txid?: string;
}

export const SuccessCreatedStableCoinModal: FC<SuccessCreatedStableCoinModalProps> = ({
  onClose,
  txid,
  ...props
}) => {
  const searchParams = useSearchParams();
  const suiClientContext = useSuiClientContext();

  return (
    <Modal
      onClose={onClose}
      className="relative p-6 w-[480px]"
      {...props}
    >
      <div className="absolute top-0 left-0 z-[-1]">
        <BackgroundModalDecorativeIcon />

        <div className="absolute top-6 left-6 bg-whiteIce w-12 h-12 flex items-center justify-center rounded-full">
          <CheckedWithCircleIcon />
        </div>
      </div>
      <p className="text-primary text-lg font-semibold mt-16">
        Stablecoin was successfully created
      </p>
      <p className="mt-1 text-secondary">
        The operation is successful. To view the transaction for this operation, please click on the button below
      </p>
      <div className="grid grid-cols-3 gap-4 mt-8">
        <Link
          href={{
            pathname: PAGES_URLS.dashboardOperations,
            query: {
              txid,
              ...(searchParams ? Object.fromEntries(searchParams.entries()) : {}),
            },
          }}
          className="col-span-2"
        >
          <Button className="w-full h-[56px]" view={BUTTON_VIEWS.secondary}>
            Go to Stablecoin dashboard
          </Button>
        </Link>
        <a
          href={`https://suiscan.xyz/${suiClientContext.network}/tx/${txid}`}
          target="_blank"
          rel="noreferrer"
          className="rounded-xl col-span-1"
        >
          <Button className="w-full h-[56px]">
            Transaction
          </Button>
        </a>
      </div>
    </Modal>
  );
};
