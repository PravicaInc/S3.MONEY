import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'S3 - Add wallet',
};

export default function AddWalletPage() {
  return (
    `AddWalletForm ${process.env.NEXT_PUBLIC_API_DOMAIN ?? 'undefined'}`
  );
}
