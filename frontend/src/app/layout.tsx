import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';
import 'react-loading-skeleton/dist/skeleton.css';

import 'rc-tooltip/assets/bootstrap_white.css';

import { ToastContainer } from '@/Components/ToastContainer';

import '@/styles/globals.css';

import { ClientLayout } from './client_layout';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'S3',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <ClientLayout>
            {children}
            <ToastContainer />
          </ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
