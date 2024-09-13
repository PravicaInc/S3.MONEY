import { createContext, Dispatch, SetStateAction } from 'react';

import { USER_TYPE } from '../types';

export interface IContextValues {
  selectedUserType: USER_TYPE,
  setSelectedUserType: Dispatch<SetStateAction<USER_TYPE>>;
}

export const OnboardingContext = createContext<IContextValues>({
  selectedUserType: 'Stablecoin Issuer',
  setSelectedUserType: () => null,
});
