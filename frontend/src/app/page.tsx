import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'S3 - HOME',
};

export default function Home() {
  return (
    <p>
      home
      <br />
      <Link href="/add-wallet">
        Add wallet →
      </Link>
    </p>
  );
}
