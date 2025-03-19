import axios from "axios";
import store from "../store/store";


const api = axios.create({
    baseURL:import.meta.env.VITE_BASE_URL,
    withCredentials: true
})

api.interceptors.request.use((config)=>{
    const access_token:string = store.getState().user?.access_token
    if(access_token) config.headers.Authorization = `Bearer ${access_token}`;
    return config
})

api.interceptors.response.use(
    (response)=>response,
    (error)=>{
        const errorMessage:string =
        error.response?.data?.message || error.message || "Something went wrong. Please try again later";        
        return Promise.reject(new Error(errorMessage))
    }
)
export default api