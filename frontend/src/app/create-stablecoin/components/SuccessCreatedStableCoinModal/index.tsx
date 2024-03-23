'use client';

import { FC } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { Button } from '@/Components/Form/Button';
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

  return (
    <Modal
      onClose={onClose}
      className="p-6 w-[520px]"
      closeOnOutsideClick={false}
      {...props}
    >
      <p className="text-primary font-semibold text-2xl text-center mt-4">
        Token was successfully created
      </p>
      <div className="flex items-center justify-center gap-4 mt-8">
        <Link
          href={{
            pathname: PAGES_URLS.dashboardOperations,
            query: {
              txid,
              ...(searchParams ? Object.fromEntries(searchParams.entries()) : {}),
            },
          }}
        >
          <Button className="w-56 h-[56px]">
            GO TO STABLECOIN DASHBOARD
          </Button>
        </Link>
      </div>
    </Modal>
  );
};
