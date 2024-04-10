'use client';

import { FC } from 'react';
import { toast } from 'react-toastify';
import { TooltipProps } from 'rc-tooltip/lib/Tooltip';

import { Tooltip } from '@/Components/Tooltip';

import { getShortAccountAddress } from '@/utils/string_formats';

export interface AddressCellProps extends Partial<TooltipProps> {
  accountAddress: string;
}

export const AddressCell: FC<AddressCellProps> = ({ accountAddress, ...props }) => (
  <Tooltip
    {...props}
    placement="top"
    trigger={['hover']}
    overlay="Click to copy"
  >
    <button
      onClick={() => {
        navigator.clipboard.writeText(accountAddress);
        toast.success('Address copied');
      }}
    >
      {getShortAccountAddress(accountAddress)}
    </button>
  </Tooltip>
);
