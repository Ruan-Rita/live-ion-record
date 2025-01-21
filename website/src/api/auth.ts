import { API_URL } from "@/contants"
import axios, { AxiosRequestConfig } from "axios"
import { LoginApiData, SignUpApiData } from "./types/api.types";

export const loginApi = async (income: LoginApiData) => {
 const response = await axios.post(`${API_URL}/auth`, income).catch(error => {
   console.log(error);
   return error;
 });

 const data = response.data;
 console.log('HEADERs', response.headers);
 return data;
}

export const signUpApi = async (income: SignUpApiData) => {
  const header: AxiosRequestConfig = {
    headers: {
      "Content-Type": 'application/json',
      "Accept": 'application/json',
    }
  };
  console.log('API_URL', JSON.stringify(income));
  const response = await axios.post(`${API_URL}/user`, JSON.stringify(income), header).catch(error => {
   console.log(error);
   return error;
 });

 const data = response.data;
 console.log('HEADERs', response.headers);
 return data;
}