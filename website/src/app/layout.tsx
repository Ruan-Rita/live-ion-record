import type { Metadata } from 'next';
import './globals.css';
import LayoutApp from './layout-app';
import { Session } from 'next-auth';
import { Niramit } from 'next/font/google'

export const metadata: Metadata = {
  title: '',
  description: '',
};
 
const niramit = Niramit({
  subsets: ['latin'],
  weight: '500',
})
 
export default function RootLayout({
  children,
  session
}: Readonly<{
  children: React.ReactNode;
  session: Session
}>) {

  return (
    <html lang="en">
      <body className={`antialiased `+ niramit.className}>
        <LayoutApp session={session}>
          {children}
        </LayoutApp>
      </body>
    </html>
  );
}
