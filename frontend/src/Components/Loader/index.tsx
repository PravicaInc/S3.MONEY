import { FC } from 'react';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import { twMerge } from 'tailwind-merge';

export const Loader: FC<Omit<FontAwesomeIconProps, 'icon'>> = ({ className, ...props }) => (
  <FontAwesomeIcon
    className={twMerge('animate-spin text-actionPrimary', className)}
    icon={faSpinner}
    data-testid="loader"

    {...props}
  />
);
