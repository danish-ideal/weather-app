import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../features/userSlice'


const store  = configureStore({
    reducer:{
        user:userReducer
    }
})
console.log(store.getState());

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store