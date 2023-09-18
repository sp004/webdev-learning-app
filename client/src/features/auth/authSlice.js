import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getUser, googleLogin, loginUser, logoutUser, registerUser } from './authService'

const initialState = {
    isLoggedin: false,
    currentUser: null,
    isLoading: false,
    isSuccess: false,
    message: ""
}

//register user
export const authregister = createAsyncThunk("auth/authregister", async (user, thunkApi) => {
    try {
        return await registerUser(user)
    } catch (error) {
        // console.log(error.response)
        const message = error?.response?.data?.message    
        return thunkApi.rejectWithValue(message)
    }
})

//generate otp to login
export const authLogin = createAsyncThunk("auth/authLogin", async (data, thunkApi) => {
    try {
        return await loginUser(data)
    } catch (error) {
        const  message = error?.response?.data?.message    
        return thunkApi.rejectWithValue(message)
    }
})

//google login
export const loginWithGoogle = createAsyncThunk("auth/loginWithGoogle", async (data, thunkApi) => {
    try {
        return await googleLogin(data)
    } catch (error) {
        const message = error?.response?.data?.message    
        return thunkApi.rejectWithValue(message)
    }
})

//logout
export const authLogout = createAsyncThunk("auth/authLogout", async (_, thunkApi) => {
    try {
        return await logoutUser()
    } catch (error) {
        const  message = error?.response?.data?.message    
        return thunkApi.rejectWithValue(message)
    }
})

//get user profile
export const userProfile = createAsyncThunk("auth/userProfile", async (_, thunkApi) => {
    try {
        return await getUser()
    } catch (error) {
        const statusCode = error?.response?.status
        const message = error?.response?.data?.message    
        return thunkApi.rejectWithValue({message, statusCode})
    }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
        state.isSuccess = false
        state.currentUser = null
        state.message = ''
    }
  },
  extraReducers: (builder) => {
    builder
        .addCase(authregister.pending, (state) => {
            state.isLoading = true
        })
        .addCase(authregister.fulfilled, (state, {payload}) => {
            state.isLoading = false
            state.currentUser = payload.newUser
            state.message = payload.message
            state.isSuccess = true
        })
        .addCase(authregister.rejected, (state, {payload}) => {
            state.isLoading = false
            state.isSuccess = false 
            state.message = payload
            // state.isError = true
        })
        //login
        .addCase(authLogin.pending, (state) => {
            state.isLoading = true
        })
        .addCase(authLogin.fulfilled, (state, {payload}) => {
            state.isLoading = false
            state.currentUser = payload.user
            state.isLoggedin = true
            state.isSuccess = true
        })
        .addCase(authLogin.rejected, (state, {payload}) => {
            state.isLoading = false
            state.isSuccess = false 
            state.message = payload
            // state.isError = true
        })
        //login with google
        .addCase(loginWithGoogle.pending, (state) => {
            state.isLoading = true
        })
        .addCase(loginWithGoogle.fulfilled, (state, {payload}) => {
            state.isLoading = false
            state.isSuccess = true
            state.isLoggedin = true
            state.message = payload.message
            state.currentUser = payload.user
        })
        .addCase(loginWithGoogle.rejected, (state, {payload}) => {
            state.isLoading = false
            state.isLoggedin = false
            state.message = payload
            state.currentUser = null
        })
        //logout
        .addCase(authLogout.pending, (state) => {
            state.isLoading = true
        })
        .addCase(authLogout.fulfilled, (state, {payload}) => {
            state.isLoading = false
            state.currentUser = null
            state.isLoggedin = false
            state.isSuccess = true
        })
        .addCase(authLogout.rejected, (state, {payload}) => {
            state.isLoading = false
            state.isSuccess = false 
            state.message = payload
            state.isLoggedin = false //only case when cookie is not present, hence setting isLoggedin as false
        })
        //get user
        .addCase(userProfile.pending, (state) => {
            state.isLoading = true
        })
        .addCase(userProfile.fulfilled, (state, {payload}) => {
            state.isLoading = false
            state.currentUser = payload
            state.isSuccess = true
        })
        .addCase(userProfile.rejected, (state, {payload}) => {
            state.isLoading = false
            state.isSuccess = false 
            state.message = payload.message
        })
  }
});

export const user = (state) => state.auth?.currentUser?.user
export const {reset, logout} = authSlice.actions

export default authSlice.reducer