import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './styles/globals.css';

import { Header } from './Components/Header';
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
          <Header />
          <div className="max-w-screen-2xl mx-auto">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
