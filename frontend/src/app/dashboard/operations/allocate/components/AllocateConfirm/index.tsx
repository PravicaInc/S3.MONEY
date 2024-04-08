import { FC } from 'react';

import { Button, BUTTON_VIEWS } from '@/Components/Form/Button';
import { Modal, ModalProps } from '@/Components/Modal';

export interface AllocateConfirmProps extends ModalProps {
  onProceed: () => void;
  walletAddress?: string;
  amount?: string;
  inProcess?: boolean;
}

export const AllocateConfirm: FC<AllocateConfirmProps> = ({
  onProceed,
  onClose,
  inProcess,
  walletAddress,
  amount,
  ...props
}) => (
  <Modal
    onClose={inProcess ? onClose : () => {}}
    className="p-6 w-[520px]"
    closeOnOutsideClick={!inProcess}
    {...props}
  >
    <p className="text-primary font-semibold text-2xl text-center mt-4">
      Review Allocation Details
    </p>
    <p className="text-sm text-mistBlue mt-3 text-center break-all">
      You will allocate
      {' '}
      <span className="text-actionPrimary font-bold">
        {amount}
      </span>
      {' '}
      to be allocated from the Main Account to:
      {' '}
      <span className="text-actionPrimary font-bold">
        {walletAddress}
      </span>
    </p>
    <div className="flex items-center justify-center gap-4 mt-8">
      <Button
        className="w-56 h-[56px]"
        view={BUTTON_VIEWS.secondary}
        onClick={onClose}
      >
        Cancel
      </Button>
      <Button
        className="w-56 h-[56px]"
        onClick={onProceed}
        isLoading={inProcess}
        disabled={inProcess}
      >
        Confirm
      </Button>
    </div>
  </Modal>
);
