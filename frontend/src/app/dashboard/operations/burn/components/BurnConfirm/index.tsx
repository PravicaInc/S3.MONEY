import { FC } from 'react';

import { Button, BUTTON_VIEWS } from '@/Components/Form/Button';
import { Modal, ModalProps } from '@/Components/Modal';

export interface BurnConfirmProps extends ModalProps {
  onProceed: () => void;
  walletAddress?: string;
  amount?: string;
  inProcess?: boolean;
}

export const BurnConfirm: FC<BurnConfirmProps> = ({
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
      Review Burn Details
    </p>
    <p className="text-sm text-grayText mt-3 text-center break-all">
      You have entered this amount:
      {' '}
      <span className="text-[#FE6321] font-bold">
        {amount}
      </span>
      {' '}
      to be burned from the Main Account:
      {' '}
      <span className="text-[#FE6321] font-bold">
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