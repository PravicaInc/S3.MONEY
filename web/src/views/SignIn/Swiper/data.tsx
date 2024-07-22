import { ReactNode } from 'react';

import CardPlaceholder from '../../../assets/card-placeholder.svg?react';

export const SLIDER_INFO: { title: string; para: string; image: ReactNode }[] = [
  {
    title: 'Welcome to S3.money!',
    para: 'Discover the power of efficient stablecoin management with our innovative platform designed to streamline liquidity distribution and control.',
    image: <CardPlaceholder />,
  },
  {
    title: 'Cash-in and Cash-out Treasuries',
    para: 'Manage liquidity with precision. Our dual-treasury system ensures seamless fund allocation and deallocation, keeping the ecosystem balanced.',
    image: <CardPlaceholder />,
  },
  {
    title: 'Effortless Stablecoin Management',
    para: 'S3.money makes stablecoins simple. Deposit, withdraw, and manage your funds with ease. No complexity, just control. S3 puts the power of stablecoins in your hands.',
    image: <CardPlaceholder />,
  },
  {
    title: 'Seamless Issuer-Distributor Connection',
    para: 'Experience the benefits of integrated allocation and deallocation processes. Our automated system ensures dynamic liquidity management, enhancing efficiency and user satisfaction.',
    image: <CardPlaceholder />,
  },
];
