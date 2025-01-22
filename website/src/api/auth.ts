import { API_URL, headerAxios } from "@/contants"
import axios from "axios"
import { LoginApiData, SignUpApiData } from "./types/api.types";

export const loginApi = async (income: LoginApiData) => {
  const response = await axios.post(`${API_URL}/auth`, income, headerAxios).catch(error => {
    return error.response.data;
  });

  return response.data;;
}

export const signUpApi = async (income: SignUpApiData) => {
  const response = await axios.post(`${API_URL}/user`, JSON.stringify(income), headerAxios).catch(error => {
    return error.response;
  });
  
 return response.data;
}