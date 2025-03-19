import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface userState {
    id: string,
    email: string,
    name: string,
    access_token: string
}

const initialState: userState = {
    id: '',
    email: '',
    name: '',
    access_token: ''
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<userState>) => {
            state.access_token = action.payload.access_token;
            state.email = action.payload.email;
            state.id = action.payload.id
            state.name = action.payload.name
        },
        clearUser: (state) => {
            state.id = ''
            state.name = ''
            state.access_token = ''
            state.email = ''
        }
    }
})



export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer