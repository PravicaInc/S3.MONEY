'use client';

import { Delimiter } from '@/Components/Delimiter';

import { FreezeAddressForm } from './components/FreezeAddressForm';
import { PauseForm } from './components/PauseForm';

export default function DashboardOperationsPage() {
  const actions = [
    {
      title: 'Mint',
      description: 'Issuers can effortlessly create new tokens, increasing the total supply of the stablecoin.',
    },
    {
      title: 'Allocate',
      description: 'Issuers can allocate some authorized tokens to the circulation for public.',
    },
    {
      title: 'Burn',
      description: `
        The platform allows issuers to reduce the overall token supply by 'burning' or destroying tokens,
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
      <Delimiter className="w-1/2 mx-auto my-20" />
      <div className="grid grid-cols-3 gap-8">
        {actions.map(({ title, description }) => (
          <div
            key={title}
            className="py-4 px-6 border border-borderPrimary rounded-xl"
          >
            <div className="flex items-center text-2xl gap-3">
              <div className="w-12 h-12 rounded-full bg-borderPrimary" />
              {title}
            </div>
            <Delimiter className="mt-9 mb-5" />
            <p className="text-xl">
              {description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
