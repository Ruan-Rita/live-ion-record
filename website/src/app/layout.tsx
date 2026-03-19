import type { Metadata } from 'next';
import './globals.css';
import LayoutApp from './layout-app';
import { Niramit } from 'next/font/google';

export const metadata: Metadata = {
  title: '',
  description: '',
};

const niramit = Niramit({
  subsets: ['latin'],
  weight: '500',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`antialiased ${niramit.className}`}>
        <LayoutApp>
          {children}
        </LayoutApp>
      </body>
    </html>
  );
}
