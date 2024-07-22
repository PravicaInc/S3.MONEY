import React, { PropsWithChildren, useState } from 'react';
import { Modal as AntModal, ModalProps } from 'antd';

import CloseIcon from '../../assets/close.svg?react';

import styles from './styles.module.css';

interface IProps extends ModalProps {
  element: ((options: { showModal: () => void }) => React.ReactNode) | React.ReactNode;
  onConfirm?: () => Promise<void>;
  onCancel?: () => void;
}

export const Modal: React.FC<PropsWithChildren<IProps>> = ({ children, element, onConfirm, onCancel, ...props }) => {
  const [isOpen, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = async () => {
    if (onConfirm) {
      await onConfirm().then(() => setOpen(false));
    }
    else {
      setOpen(false);
    }
  };

  const handleCancel = () => {
    onCancel && onCancel();
    setOpen(false);
  };

  return (
    <>
      {typeof element === 'function'
        ? element({
          showModal,
        })
        : element}
      <AntModal
        open={isOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        className={styles.modal}
        closeIcon={<CloseIcon />}
        centered
        width={'66rem'}
        {...props}
      >
        {children}
      </AntModal>
    </>
  );
};
