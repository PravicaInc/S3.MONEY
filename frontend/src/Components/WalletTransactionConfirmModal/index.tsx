import { FC, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

import AlertIconIcon from '@/../public/images/alert_icon.svg?jsx';
import BackgroundModalDecorativeIcon from '@/../public/images/background_modal_decorative_left.svg?jsx';
import CheckedWithCircleIcon from '@/../public/images/checked_with_circle.svg?jsx';

import { Button, BUTTON_VIEWS } from '@/Components/Form/Button';
import { Modal, ModalProps } from '@/Components/Modal';

export type WALLET_TRANSACTION_CONFIRM_MODAL_VIEW = 'positive' | 'alert';

export interface WalletTransactionConfirmModalProps extends ModalProps {
  header: ReactNode;
  description?: ReactNode;
  additionContent?: ReactNode;
  onProceed: () => void;
  inProcess?: boolean;
  inCancelDisabled?: boolean;
  inCancelProgress?: boolean;
  view?: WALLET_TRANSACTION_CONFIRM_MODAL_VIEW;
}

export const WalletTransactionConfirmModal: FC<WalletTransactionConfirmModalProps> = ({
  header,
  description,
  additionContent,
  onProceed,
  onClose,
  inProcess,
  inCancelDisabled,
  inCancelProgress,
  view = 'positive',
  ...props
}) => (
  <Modal
    onClose={onClose}
    className="relative p-6 w-[480px]"
    closeOnOutsideClick={!inProcess && !inCancelProgress}
    {...props}
  >
    <div className="absolute top-0 left-0 z-[-1]">
      <BackgroundModalDecorativeIcon />

      <div
        className={twMerge(
          'absolute top-6 left-6 w-12 h-12 flex items-center justify-center rounded-full',
          view === 'positive' && 'bg-whiteIce',
          view === 'alert' && 'bg-mistyRose'
        )}
      >
        {
          view === 'positive' && (
            <CheckedWithCircleIcon />
          )
        }
        {
          view === 'alert' && (
            <AlertIconIcon />
          )
        }
      </div>
    </div>
    <p className="text-primary text-lg font-semibold mt-16">
      {header}
    </p>
    {
      !!description && (
        <p className="mt-1 text-secondary">
          {description}
        </p>
      )
    }
    {additionContent}
    <div className="flex items-center justify-center gap-4 mt-8">
      <Button
        className="w-56 h-[56px]"
        view={BUTTON_VIEWS.secondary}
        onClick={onClose}
        disabled={inCancelProgress || inCancelDisabled}
        isLoading={inCancelProgress}
      >
        Cancel
      </Button>
      <Button
        className="w-56 h-[56px]"
        onClick={onProceed}
        isLoading={inProcess}
        disabled={inProcess}
      >
        Proceed
      </Button>
    </div>
  </Modal>
);
