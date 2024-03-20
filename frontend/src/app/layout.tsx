import { ToastContainer } from 'react-toastify';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import 'react-toastify/dist/ReactToastify.css';

import 'rc-tooltip/assets/bootstrap_white.css';

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
            <ToastContainer
              position="top-center"
              autoClose={5000}
              hideProgressBar
              newestOnTop={false}
              closeOnClick={false}
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
              // transition={Bounce}
            />
          </ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
