import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosPrivate, axiosPublic } from "../../api/apiMethod";

//add course to wishlist
export const addToWishlist = createAsyncThunk("cart/addToWishlist", async (courseId, thunkApi) => {
    try {
        const {data} = await axiosPublic.post(`/wishlist/add/${courseId}`, {withCredentials: true})
        return data
    } catch (error) {
        const statusCode = error?.response?.status
        const message = error?.response?.data?.message    
        return thunkApi.rejectWithValue({message, statusCode})
    }
})

//get courses from wishlist
export const getWishlistCourses = createAsyncThunk("cart/getWishlistCourses", async (courseId, thunkApi) => {
    try {
        const {data} = await axiosPrivate.get(`/wishlist/getWishlistCourses`, {withCredentials: true})
        return data
    } catch (error) {
        const statusCode = error?.response?.status
        const message = error?.response?.data?.message    
        return thunkApi.rejectWithValue({message, statusCode})
    }
})

//remove course from wishlist
export const removeWishlist = createAsyncThunk("cart/removeWishlist", async (courseId, thunkApi) => {
    try {
        const {data} = await axiosPublic.delete(`/wishlist/remove/${courseId}`, {withCredentials: true})
        return data
    } catch (error) {
        const statusCode = error?.response?.status
        const message = error?.response?.data?.message    
        return thunkApi.rejectWithValue({message, statusCode})
    }
})

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: {
        isLoading: false,
        isSuccess: false,
        courses: [],
        message: ''
    },
    reducers: {
        clearWishlist: (state) => {
            state.courses = []
            state.message = ''
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addToWishlist.pending, state => {
                state.isLoading = true
            })
            .addCase(addToWishlist.fulfilled, (state, {payload}) => {
                state.isLoading = false
                state.isSuccess = true
                state.message = payload
            })
            .addCase(addToWishlist.rejected, (state, {payload}) => {
                state.isLoading = false
                state.isSuccess = false
                state.message = payload
            })

            .addCase(getWishlistCourses.pending, state => {
                state.isLoading = true
            })
            .addCase(getWishlistCourses.fulfilled, (state, {payload}) => {
                state.isLoading = false
                state.isSuccess = true
                state.courses = payload.data
            })
            .addCase(getWishlistCourses.rejected, (state, {payload}) => {
                state.isLoading = false
                state.isSuccess = false
                state.courses = payload.data
            })

            .addCase(removeWishlist.pending, state => {
                state.isLoading = true
            })
            .addCase(removeWishlist.fulfilled, (state, {payload}) => {
                state.isLoading = false
                state.isSuccess = true
                state.message = payload
            })
            .addCase(removeWishlist.rejected, (state, {payload}) => {
                state.isLoading = false
                state.isSuccess = false
                state.message = payload
            })
    }
})

export const {clearWishlist} = wishlistSlice.actions

export default wishlistSlice.reducer