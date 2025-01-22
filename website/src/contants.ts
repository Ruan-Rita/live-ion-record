import { AxiosRequestConfig } from "axios";

export const API_URL = process.env.NEXT_PUBLIC_API_URL!;
export const headerAxios: AxiosRequestConfig = {
    headers: {
      "Content-Type": 'application/json',
      "Accept": 'application/json',
    }
};
