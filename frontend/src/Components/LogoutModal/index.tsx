import { FC } from 'react';

import { Button, BUTTON_VIEWS } from '@/Components/Form/Button';
import { Modal, ModalProps } from '@/Components/Modal';

export interface LogoutModalProps extends ModalProps {
  onProceed: () => void;
  inProcess?: boolean;
}

export const LogoutModal: FC<LogoutModalProps> = ({ onProceed, onClose, inProcess, ...props }) => (
  <Modal
    onClose={onClose}
    className="p-6"
    {...props}
  >
    <p className="text-primary font-semibold text-2xl text-center mt-4">
      Confirm Logout?
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
      >
        Proceed
      </Button>
    </div>
  </Modal>
);
