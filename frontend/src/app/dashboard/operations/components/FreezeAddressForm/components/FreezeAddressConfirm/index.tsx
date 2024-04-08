import { FC } from 'react';

import { Button, BUTTON_VIEWS } from '@/Components/Form/Button';
import { Modal, ModalProps } from '@/Components/Modal';

export interface FreezeAddressConfirmProps extends ModalProps {
  onProceed: () => void;
  walletAddress: string;
  inProcess?: boolean;
}

export const FreezeAddressConfirm: FC<FreezeAddressConfirmProps> = ({
  onProceed,
  onClose,
  inProcess,
  walletAddress,
  ...props
}) => (
  <Modal
    onClose={inProcess ? onClose : () => {}}
    className="p-6 w-[520px]"
    closeOnOutsideClick={!inProcess}
    {...props}
  >
    <p className="text-primary font-semibold text-2xl text-center mt-4">
      Are you sure to freeze this account?
    </p>
    <p className="text-sm text-mistBlue mt-3 text-center">
      This actions will block this account from sending and receiving tokens.
      <br />
      <span className="break-all">
        Address:
        {' '}
        <span className="text-actionPrimary font-bold">
          {walletAddress}
        </span>
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
