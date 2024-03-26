'use client';

import BurnIcon from '@/../public/images/burn_icon.svg?jsx';
import CashInIcon from '@/../public/images/cash_in_icon.svg?jsx';
import MintIcon from '@/../public/images/mint_icon.svg?jsx';

import { FreezeAddressForm } from './components/FreezeAddressForm';
import { PauseForm } from './components/PauseForm';

export default function DashboardOperationsPage() {
  const actions = [
    {
      title: 'Mint',
      icon: <MintIcon />,
      description: 'Issuers can effortlessly create new tokens, increasing the total supply of the stablecoin.',
    },
    {
      title: 'Cash In',
      icon: <CashInIcon />,
      description: 'Issuers can allocate some authorized tokens to the circulation for public.',
    },
    {
      title: 'Burn',
      icon: <BurnIcon />,
      description: `
        The platform allows issuers to reduce the overall token supply by 'burning' or destroying tokens.
      `,
    },
  ];

  return (
    <div className="max-w-screen-2xl mx-auto p-10">
      <div className="grid grid-cols-2 gap-10">
        <PauseForm
          // eslint-disable-next-line no-console
          onSubmit={console.log}
          className="py-4 px-6 border border-borderPrimary rounded-xl"
        />
        <FreezeAddressForm
          // eslint-disable-next-line no-console
          onSubmit={console.log}
          className="py-4 px-6 border border-borderPrimary rounded-xl"
        />
      </div>
      <div className="grid grid-cols-3 gap-8 mt-6">
        {actions.map(({ title, icon, description }) => (
          <div
            key={title}
            className="border border-borderPrimary rounded-[10px] bg-white p-6"
          >
            <div
              className="bg-deepPeach w-10 h-10 flex items-center justify-center rounded-full shadow-operationIcon"
            >
              {icon}
            </div>
            <p className="text-primary text-lg font-semibold mt-5">
              {title}
            </p>
            <p className="text-grayText text-sm mt-2">
              {description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
