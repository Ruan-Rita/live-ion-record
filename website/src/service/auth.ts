import { headerAxios, INTERNAL_API_URL } from "@/contants"
import { LoginApiData } from "@/types/api.types";
import axios from "axios"

export const loginApi = async (income: LoginApiData) => {
  const response = await axios.post(`${INTERNAL_API_URL}/auth`, JSON.stringify(income), headerAxios).catch(error => {
    return error.response.data;
  });

  if (response?.data && !response?.data?.statusCode) {
    response.data.statusCode = response?.request?.res?.statusCode 
  }
  
  return response?.data || response;
}