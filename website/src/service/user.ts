import axios from "axios";
import { API_URL, INTERNAL_API_URL } from "@/contants";
import { getHeaderAxios } from "@/lib/utils";
import { SignUpApiData } from "../types/api.types";

export async function userBasicInfoApi(accessToken: string) {
    const response = await axios.get(`${INTERNAL_API_URL}/user/basic-info`, getHeaderAxios(accessToken)).catch(error => {
        return error.response;
    });
    
    if (response?.data && !response?.data?.statusCode) {
        response.data.statusCode = response?.request?.res?.statusCode 
    }
    
    return response?.data || response;
}

export const signUpApi = async (income: SignUpApiData) => {
    const response = await axios.post(`${API_URL}/user`, JSON.stringify(income), getHeaderAxios())
    .then(responseAxios => {
        return {
            data: responseAxios.data.data,
            status: responseAxios.status
        }
    })
    .catch(responseAxios => {
        return {
            data: responseAxios.message,
            status: responseAxios.status
        }
    });

    return response;
}