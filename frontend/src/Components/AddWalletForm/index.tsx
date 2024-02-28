'use client';

import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { twMerge } from 'tailwind-merge';
import * as yup from 'yup';

import { Button } from '@/Components/Form/Button';
import { Input } from '@/Components/Form/Input';
import { Select } from '@/Components/Form/Select';

import { ConnectWalletData, suiNetworkList, useWallet } from '@/hooks/useWallet';

const networkOptions = [
  {
    value: suiNetworkList.mainnet,
    label: 'Mainnet',
  },
  {
    value: suiNetworkList.devnet,
    label: 'Devnet',
  },
  {
    value: suiNetworkList.testnet,
    label: 'Testnet',
  },
  {
    value: suiNetworkList.localnet,
    label: 'Localnet',
  },
];

const addWalletFormSchema = yup.object().shape({
  walletAddress: yup
    .string()
    .trim()
    .required('Address is required.'),
  packageName: yup
    .string()
    .trim()
    .required('Package name is required.'),
  symbol: yup
    .string()
    .trim()
    .required('Symbol is required.'),
  name: yup
    .string()
    .trim(),
  description: yup
    .string()
    .trim(),
  decimals: yup
    .number()
    .required('Decimals is required.'),
  network: yup
    .string()
    .oneOf(Object.values(suiNetworkList))
    .required('Network is required.'),
});

export interface AddWalletFormProps {
  className?: string;
}

export function AddWalletForm({ className, ...props }: AddWalletFormProps) {
  const { connectWallet } = useWallet();

  const formMethods = useForm({
    resolver: yupResolver(addWalletFormSchema),
    defaultValues: {
      decimals: 0,
    },
  });

  const submit: SubmitHandler<ConnectWalletData> = async data => {
    const res = await connectWallet.mutateAsync(data);

    // TODO: Remove this console.log
    // eslint-disable-next-line no-console
    console.log(res);
  };

  return (
    <FormProvider {...formMethods}>
      <form
        className={twMerge('flex flex-col gap-2', className)}
        onSubmit={formMethods.handleSubmit(submit)}
        {...props}
      >
        <Input
          name="walletAddress"
          placeholder="Address"
        />
        <Input
          name="packageName"
          placeholder="Package name"
        />
        <Input
          name="symbol"
          placeholder="Symbol"
        />
        <Input
          name="name"
          placeholder="Name"
        />
        <Input
          name="description"
          placeholder="Description"
        />
        <Input
          name="decimals"
          placeholder="Decimals"
          type="number"
        />
        <Select
          name="network"
          options={networkOptions}
          isRequired
        />
        <Button
          type="submit"
          isLoading={connectWallet.isPending}
        >
          Connect wallet
        </Button>
      </form>
    </FormProvider>
  );
}
