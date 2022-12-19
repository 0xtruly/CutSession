import axios from "axios";
import { API_BASE_URL } from "../../config";


const axiosInstance = axios.create({
    baseURL: `${API_BASE_URL}`,
  });
  
  axiosInstance.defaults.headers.common['Prefer'] = 'code=200, dynamic=true'
export default axiosInstance;