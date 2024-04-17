import { FC, ReactNode } from 'react';
import { useSuiClientContext } from '@mysten/dapp-kit';
import { twMerge } from 'tailwind-merge';

import BackgroundModalDecorativeIcon from '@/../public/images/background_modal_decorative_left.svg?jsx';
import CheckedWithCircleIcon from '@/../public/images/checked_with_circle.svg?jsx';

import { Button, BUTTON_VIEWS } from '@/Components/Form/Button';
import { Modal, ModalProps } from '@/Components/Modal';

export interface WalletTransactionSuccessfulModalProps extends ModalProps {
  header?: ReactNode;
  description?: ReactNode;
  txid?: string;
}

export const WalletTransactionSuccessfulModal: FC<WalletTransactionSuccessfulModalProps> = ({
  onClose,
  header,
  description,
  className,
  txid,
  ...props
}) => {
  const suiClientContext = useSuiClientContext();

  return (
    <Modal
      onClose={onClose}
      className={twMerge('relative p-6 w-[400px]', className)}
      withCloseButton={false}
      {...props}
    >
      <div className="absolute top-0 left-0 z-[-1]">
        <BackgroundModalDecorativeIcon />

        <div className="absolute top-6 left-6 bg-whiteIce w-12 h-12 flex items-center justify-center rounded-full">
          <CheckedWithCircleIcon />
        </div>
      </div>
      <p className="text-primary text-lg font-semibold mt-16">
        {header}
      </p>
      <p className="mt-1 text-secondary">
        {description}
      </p>
      <div className="grid grid-cols-2 gap-4 mt-8">
        <Button
          className="w-full h-[56px]"
          view={BUTTON_VIEWS.secondary}
          onClick={onClose}
        >
          Close
        </Button>
        <a
          href={`https://suiscan.xyz/${suiClientContext.network}/tx/${txid}`}
          target="_blank"
          rel="noreferrer"
          className="rounded-xl"
        >
          <Button className="w-full h-[56px]">
            Transaction
          </Button>
        </a>
      </div>
    </Modal>
  );
};
