import type { Metadata } from 'next';
// import { Average } from "next/font/google";
import './globals.css';

export const metadata: Metadata = {
  title: '',
  description: '',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <main className="h-full">{children}</main>
      </body>
    </html>
  );
}
