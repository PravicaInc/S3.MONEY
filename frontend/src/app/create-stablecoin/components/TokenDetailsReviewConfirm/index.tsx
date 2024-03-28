import { FC } from 'react';

import { Button, BUTTON_VIEWS } from '@/Components/Form/Button';
import { Modal, ModalProps } from '@/Components/Modal';

export interface TokenDetailsReviewConfirmProps extends ModalProps {
  onProceed: () => void;
  inProcess?: boolean;
  inCancelDisabled?: boolean;
  inCancelProgress?: boolean;
}

export const TokenDetailsReviewConfirm: FC<TokenDetailsReviewConfirmProps> = ({
  onProceed,
  onClose,
  inProcess,
  inCancelDisabled,
  inCancelProgress,
  ...props
}) => (
  <Modal
    onClose={onClose}
    className="p-6 w-[520px]"
    closeOnOutsideClick={!inProcess && !inCancelProgress}
    {...props}
  >
    <p className="text-primary font-semibold text-2xl text-center mt-4">
      Token Details Review Confirmation
    </p>
    <p className="text-sm text-grayText mt-3 text-center">
      If you did not review your token details yet, you can go back and scroll down the
      right side tab of the screen and make sure everything is in place first.
      Otherwise you can proceed.
    </p>
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
