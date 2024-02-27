import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    user: {
        profile: null,
        token: null,
        refreshToken: null,
        expiresAt: null,
        isAuth: false
    }
}

const userSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers: {
        setUserToken(state, action) {
            state.user.token = action.payload.token,
                state.user.refreshToken = action.payload.refreshToken,
                state.user.expiresAt = action.payload.expiresAt,
                state.user.isAuth = true,
                state.user.email = null
        },
        logOutUser(state, action) {
            state.user.isAuth = false,
                state.user.token = null,
                state.user.refreshToken = null,
                state.user.expiresAt = null,
                state.user.profile = null

        },
        setUser(state, action) {
            state.user.profile = action.payload
        }
    },
})



export const { setUser, logOutUser, setUserToken } = userSlice.actions
export default userSlice.reducer




