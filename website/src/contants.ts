import { AxiosRequestConfig } from "axios";

export const API_URL = process.env.NEXT_PUBLIC_API_URL!;
export const INTERNAL_API_URL = process.env.INTERNAL_API_URL!;
export const SERVICE_PLUGIN_ID = process.env.NEXT_PUBLIC_PLUGIN_ID;

export const headerAxios: AxiosRequestConfig = {
    headers: {
      "Content-Type": 'application/json',
      "Accept": 'application/json',
    }
};
