import { API_URL, headerAxios } from "@/contants"
import axios from "axios"
import { LoginApiData, SignUpApiData } from "./types/api.types";

export const loginApi = async (income: LoginApiData) => {
  const response = await axios.post(`${API_URL}/auth`, JSON.stringify(income), headerAxios).catch(error => {
    return error.response.data;
  });

  if (response?.data && !response?.data?.statusCode) {
    response.data.statusCode = response?.request?.res?.statusCode 
  }
  
  return response?.data || response;
}