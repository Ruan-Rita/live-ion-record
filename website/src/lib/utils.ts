import { headerAxios } from '@/contants';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function indentifierErrorFieldApi(messages: string[]) {
  const errors: any = {};
    
  messages.forEach(message => {
    const firstWord = message.substring(0, message.indexOf(' ', 0))
    errors[firstWord] = message.charAt(0).toUpperCase() + message.slice(1);
  });

  return errors;
}

export function getHeaderAxios(accessToken?: string) {
  const header = structuredClone(headerAxios)
  if (header?.headers) {
    header.headers['Authorization'] = 'Bearer '+accessToken;
  }
  return header;
}