import type { Metadata } from 'next';
import './globals.css';
import LayoutApp from './layout-app';
import { Session } from 'next-auth';

export const metadata: Metadata = {
  title: '',
  description: '',
};

export default function RootLayout({
  children,
  session
}: Readonly<{
  children: React.ReactNode;
  session: Session

}>) {

  return (
    <html lang="en">
      <body className={`antialiased`}>
        <LayoutApp session={session}>
          {children}
        </LayoutApp>
      </body>
    </html>
  );
}
