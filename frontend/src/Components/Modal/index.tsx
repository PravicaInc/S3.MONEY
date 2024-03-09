import React, { HTMLAttributes, MouseEventHandler, ReactNode, useCallback, useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';

export interface ModalProps extends HTMLAttributes<HTMLDialogElement> {
  visible: boolean;
  onClose: () => void;

  closeOnOutsideClick?: boolean;
  children?: ReactNode;
  contentClassName?: string;
}

export function Modal({
  visible,
  onClose,

  closeOnOutsideClick = true,
  className,
  contentClassName,
  children,
  ...props
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const lastActiveElement = useRef<Element | HTMLInputElement | null>(null);

  const openDialog = useCallback(
    () => {
      lastActiveElement.current = document.activeElement;

      if (dialogRef.current) {
        dialogRef.current.showModal();
      }

      document.body.classList.add('overflow-hidden');
    },
    [dialogRef, lastActiveElement]
  );

  const closeDialog = useCallback(
    (event?: Event) => {
      if (event) {
        event.preventDefault();
      }

      if (dialogRef.current) {
        dialogRef.current.close();
      }

      onClose();

      if (lastActiveElement.current) {
        lastActiveElement.current && (lastActiveElement.current as HTMLInputElement).focus();
      }

      document.body.classList.remove('overflow-hidden');
    },
    [dialogRef, lastActiveElement, onClose]
  );

  useEffect(() => {
    if (visible) {
      openDialog();
    }
    else {
      closeDialog();
    }
  }, [visible, openDialog, closeDialog]);

  useEffect(() => {
    const dialogNode = dialogRef.current;

    if (dialogNode) {
      dialogNode.addEventListener('cancel', closeDialog);
    }

    return () => {
      if (dialogNode) {
        dialogNode.removeEventListener('cancel', closeDialog);
      }
    };
  }, [closeDialog, dialogRef]);

  const handleOutsideClick: MouseEventHandler<HTMLDialogElement> = event => {
    if (closeOnOutsideClick && event.target === dialogRef.current) {
      closeDialog();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className={twMerge('p-4 backdrop:bg-modalBackdropColor rounded-xl', className)}
      onClick={handleOutsideClick}
      {...props}
    >
      <div className={twMerge('', contentClassName)}>
        {children}
      </div>
    </dialog>
  );
}
