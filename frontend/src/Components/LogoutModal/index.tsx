import { FC } from 'react';
import { twMerge } from 'tailwind-merge';

import AlertIcon from '@/../public/images/alert_icon.svg?jsx';
import BackgroundModalDecorativeIcon from '@/../public/images/background_modal_decorative_left.svg?jsx';

import { Button, BUTTON_VIEWS } from '@/Components/Form/Button';
import { Modal, ModalProps } from '@/Components/Modal';

export interface LogoutModalProps extends ModalProps {
  onProceed: () => void;
  inProcess?: boolean;
}

export const LogoutModal: FC<LogoutModalProps> = ({ onProceed, onClose, inProcess, className, ...props }) => (
  <Modal
    onClose={onClose}
    className={twMerge('relative p-6 w-[400px]', className)}
    withCloseButton={false}
    {...props}
  >
    <div className="absolute top-0 left-0 z-[-1]">
      <BackgroundModalDecorativeIcon />

      <div className="absolute top-6 left-6 bg-mistyRose w-12 h-12 flex items-center justify-center rounded-full">
        <AlertIcon />
      </div>
    </div>
    <p className="text-primary text-lg font-semibold mt-16">
      Are you sure to Logout?
    </p>
    <p className="mt-1 text-secondary">
      We can't wait to see you again! Please feel free to drop by anytime.
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
        Logout
      </Button>
    </div>
  </Modal>
);
