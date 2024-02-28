import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { Header } from '@/Components/Header';

import '@/styles/globals.css';

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
          <div className="flex flex-col h-screen">
            <Header className="w-full" />
            <div className="max-w-screen-2xl mx-auto w-full h-full">
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
