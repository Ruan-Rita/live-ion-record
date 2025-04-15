import axios from "axios";
import { API_URL } from "@/contants";
import { getHeaderAxios } from "@/lib/utils";

export const listRecordsApi = async (accessToken: string) => {
    const response = await axios.get(`${API_URL}/record/list`, getHeaderAxios(accessToken)).catch(error => {
        return error.response;
    });

    if (response?.data && !response?.data?.statusCode) {
        response.data.statusCode = response?.request?.res?.statusCode 
    }
    
    return response?.data || response;
}
