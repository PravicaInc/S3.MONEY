import { ReactNode } from 'react';

export const USER_TYPES = ['Stablecoin Issuer', 'Distributor', 'CBDC Issuer', 'Regulator'] as const;

export type USER_TYPE = typeof USER_TYPES[number];

export type IOption = {
  value?: string;
  label: string;
  icon?: ReactNode | string;
};
