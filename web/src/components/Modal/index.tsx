import React, { PropsWithChildren, useState } from "react";
import { ButtonProps, Modal as AntModal, ModalProps } from "antd";

interface IProps extends ModalProps {
  element: ((options: { showModal: () => void }) => React.ReactNode) | React.ReactNode;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
}
export const Modal: React.FC<PropsWithChildren<IProps>> = ({ children, element, onConfirm, onCancel, ...props }) => {
  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = async () => {
    if (onConfirm) {
      await onConfirm();
    }
    setOpen(false);
  };

  const handleCancel = () => {
    onCancel && onCancel();
    setOpen(false);
  };

  return (
    <>
      {typeof element === "function"
        ? element({
            showModal,
          })
        : element}
      <AntModal open={open} onOk={handleOk} onCancel={handleCancel} {...props}>
        {children}
      </AntModal>
    </>
  );
};
