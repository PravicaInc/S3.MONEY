import { PropsWithChildren } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'S3 - Home',
};

export default function HomeLayout({ children }: PropsWithChildren) {
  return children;
}
