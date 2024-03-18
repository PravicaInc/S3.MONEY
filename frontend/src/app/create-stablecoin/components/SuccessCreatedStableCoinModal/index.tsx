import { FC } from 'react';
import Link from 'next/link';

import { Button } from '@/Components/Form/Button';
import { Modal, ModalProps } from '@/Components/Modal';

import { PAGES_URLS } from '@/utils/const';

export interface SuccessCreatedStableCoinModalProps extends ModalProps {}

export const SuccessCreatedStableCoinModal: FC<SuccessCreatedStableCoinModalProps> = ({
  onClose,
  ...props
}) => (
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
      <Link href={PAGES_URLS.home}>
        <Button className="w-56 h-[56px]">
          GO TO DASHBOARD
        </Button>
      </Link>
    </div>
  </Modal>
);
