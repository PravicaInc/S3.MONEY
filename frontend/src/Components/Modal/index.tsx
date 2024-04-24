import React, { FC, HTMLAttributes, ReactNode, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';

import CloseIcon from '@/../public/images/close.svg?jsx';

export interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  visible: boolean;
  onClose: () => void;

  closeOnOutsideClick?: boolean;
  children?: ReactNode;
  containerClassName?: string;
  withCloseButton?: boolean;
  destroyOnClose?: boolean;
}

export const Modal: FC<ModalProps> = ({
  visible,
  onClose,

  closeOnOutsideClick = true,
  className,
  containerClassName,
  children,
  withCloseButton = true,
  destroyOnClose = true,
}) => {
  useEffect(
    () => {
      if (visible) {
        document.body.style.overflow = 'hidden';
      }
      else {
        document.body.style.overflow = 'auto';
      }
    },
    [visible]
  );

  return destroyOnClose && !visible
    ? null
    : (
      <div
        role="dialog"
        className={twMerge(
          'fixed hidden top-0 left-0 right-0 bottom-0 items-center justify-center z-50 !m-0',
          visible && 'flex',
          containerClassName
        )}
      >
        <div
          className={twMerge(
            'absolute bg-modalBackdropColor top-0 left-0 right-0 bottom-0 z-0',
            visible && 'flex',
            containerClassName
          )}
          onClick={closeOnOutsideClick ? onClose : () => {}}
        />
        <div
          className={twMerge('bg-white rounded-xl z-10 max-h-screen overflow-auto', className)}
        >
          {children}
          {
            withCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="absolute top-8 right-8"
              >
                <CloseIcon />
              </button>
            )
          }
        </div>
      </div>
    );
};
