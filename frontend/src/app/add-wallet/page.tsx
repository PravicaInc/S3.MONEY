import { Metadata } from 'next';

import { AddWalletForm } from '@/Components/AddWalletForm';

export const metadata: Metadata = {
  title: 'S3 - Add wallet',
};

export default function AddWalletPage() {
  return (
    <AddWalletForm />
  );
}
