'use client';

import { SessionProvider } from "next-auth/react"
import { ToastContainer } from 'react-toastify';
import { Session } from 'next-auth';

export default function LayoutApp({
  children,
  session, 
}: Readonly<{
  children: React.ReactNode;
  session: Session
}>) {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <SessionProvider session={session}>
        <main className="h-full">{children}</main>
      </SessionProvider>
    </>
  );
}
