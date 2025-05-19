'use client';

import { SessionProvider } from "next-auth/react";
import { ToastContainer } from 'react-toastify';

export default function LayoutApp({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <SessionProvider>
        <main className="h-full">{children}</main>
      </SessionProvider>
    </>
  );
}
