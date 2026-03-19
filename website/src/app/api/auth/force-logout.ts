import { signOut } from 'next-auth/react';

export default async function handler(req: any, res: any) {
  await signOut({ redirect: false });
  res.status(200).json({ message: 'Logged out' });
}