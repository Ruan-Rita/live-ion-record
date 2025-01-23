import type { Metadata } from 'next';
import { SessionProvider } from "next-auth/react"
import './globals.css';
import { ToastContainer } from 'react-toastify';
import { Session } from 'next-auth';

export const metadata: Metadata = {
  title: '',
  description: '',
};

export default function RootLayout({
  children,
  session, 
}: Readonly<{
  children: React.ReactNode;
  session: Session
}>) {

  return (
    <html lang="en">
      <body className={`antialiased`}>
        <ToastContainer position="top-right" autoClose={3000} />
        {/* <SessionProvider session={session}> */}
          <main className="h-full">{children}</main>
        {/* </SessionProvider> */}
      </body>
    </html>
  );
}
