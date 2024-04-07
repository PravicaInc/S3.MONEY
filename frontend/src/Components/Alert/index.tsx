import { FC, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

import AlertIcon from '@/../public/images/alert_icon.svg?jsx';
import BackgroundModalDecorativeIcon from '@/../public/images/background_modal_decorative_left.svg?jsx';

import { Button } from '@/Components/Form/Button';
import { Modal, ModalProps } from '@/Components/Modal';

export interface AlertProps extends ModalProps {
  onOkClick: () => void;
  okButtonContent?: ReactNode;
  header?: ReactNode;
  description?: ReactNode;
}

export const Alert: FC<AlertProps> = ({
  onClose,
  onOkClick,
  header,
  description,
  okButtonContent = 'OK',
  className,
  ...props
}) => (
  <Modal
    onClose={onClose}
    className={twMerge('relative p-6 w-[400px]', className)}
    {...props}
  >
    <div className="absolute top-0 left-0 z-[-1]">
      <BackgroundModalDecorativeIcon />

      <div className="absolute top-6 left-6 bg-mistyRose w-12 h-12 flex items-center justify-center rounded-full">
        <AlertIcon />
      </div>
    </div>
    <p className="text-primary text-lg font-semibold mt-16">
      {header}
    </p>
    <p className="mt-1 text-secondary">
      {description}
    </p>
    <Button
      className="mt-8 w-full h-11"
      onClick={onOkClick}
    >
      {okButtonContent}
    </Button>
  </Modal>
);
