import { PropsWithChildren } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'S3 - Access Denied',
};

export default function AccessDeniedLayout({ children }: PropsWithChildren) {
  return children;
}
