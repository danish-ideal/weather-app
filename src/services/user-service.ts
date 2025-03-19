import { userState } from "../features/userSlice";
import { createUser, loginUser } from "../interfaces/user";
import api from "../services/api";

export const submitUserData =async function(userData:createUser){
            const response =  await api.post('users/create',userData)
              return response.data    
  }
 
export const submitLogin = async function (userData:loginUser){
      const response = await api.post('users/login',userData)
      return response.data
} 

export const refreshToken = async function ():Promise<userState>{
      const response = await api.get('auth/refresh_token')
      return response.data
}

export const userLogout = async function(){
   const response = await api.get('users/logout')
    return response.data
}

