
import { Country } from "../interfaces/country"
import api from "./api"


export const sumbitCountry =async (payload:Country)=>{
 const response = await api.post('country/add',payload)
 return response.data
}

export const fetchCountires =async (inputValue:string)=>{
    try {
        const response = await api.get(`country/${inputValue}`)
        return response?.data.map((country:any)=>country)
    } catch (error) {
        throw new Error('Country Not Found')
    }
       
}
export const fetchUserCountries = async (userId:string)=>{
    try {
        const response = await api.get(`country/fetch/user/countries/${userId}`)
        return response.data
    } catch (error) {
        throw new Error("Something went wrong");
        
    }
}
