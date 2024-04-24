import { PropsWithChildren } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'S3 - Sign In',
};

export default function SignInLayout({ children }: PropsWithChildren) {
  return children;
}
