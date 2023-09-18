import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosPrivate, axiosPublic } from "../../api/apiMethod";

//add course to the cart
export const addToCart = createAsyncThunk("cart/addToCart", async (courseId, thunkApi) => {
    try {
        const {data} = await axiosPublic.post(`/cart/add/${courseId}`, {withCredentials: true})
        return data
    } catch (error) {
        const statusCode = error?.response?.status
        const message = error?.response?.data?.message    
        return thunkApi.rejectWithValue({message, statusCode})
    }
})

//remove course from cart
export const removeFromCart = createAsyncThunk("cart/removeFromCart", async (courseId, thunkApi) => {
    try {
        const {data} = await axiosPrivate.delete(`/cart/remove/${courseId}`)
        return data
    } catch (error) {
        const statusCode = error?.response?.status
        const message = error?.response?.data?.message    
        return thunkApi.rejectWithValue({message, statusCode})
    }
})

//fetch courses from cart
export const fetchCartCourses = createAsyncThunk("cart/fetchCartCourses", async (_, thunkApi) => {
    try {
        const {data} = await axiosPublic.get(`/cart/getCart`)
        return data
    } catch (error) {
        const statusCode = error?.response?.status
        const message = error?.response?.data?.message    
        return thunkApi.rejectWithValue({message, statusCode})
    }
})

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        isLoading: false,
        isSuccess: false,
        courses: [],
        totalPrice: 0,
        message: ''
    },
    reducers: {
        clearCart: (state) => {
            state.courses = []
            state.totalPrice = 0
            state.message = ''
            state.isSuccess = false
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addToCart.pending, (state) => {
                state.isLoading = true
            })
            .addCase(addToCart.fulfilled, (state, {payload}) => {
                state.isLoading = false
                state.isSuccess = true
                state.message = payload.message
            })
            .addCase(addToCart.rejected, (state, {payload}) => {
                state.isLoading = false
                state.isSuccess = false
                state.message = payload.message
            })
            
            .addCase(removeFromCart.pending, (state) => {
                state.isLoading = true
            })
            .addCase(removeFromCart.fulfilled, (state, {payload}) => {
                state.isLoading = false
                state.isSuccess = true
                state.message = payload.message
            })
            .addCase(removeFromCart.rejected, (state, {payload}) => {
                state.isLoading = false
                state.isSuccess = false
                state.message = payload.message
            })

            .addCase(fetchCartCourses.pending, (state) => {
                state.isLoading = true
            })
            .addCase(fetchCartCourses.fulfilled, (state, {payload}) => {
                state.isLoading = false
                state.isSuccess = true
                state.courses = payload.data?.map(course => course.courseId)
                state.totalPrice = payload.totalPrice
            })
            .addCase(fetchCartCourses.rejected, (state, {payload}) => {
                state.isLoading = false
                state.isSuccess = false
                state.message = payload.message
            })
    }
})

export const {clearCart} = cartSlice.actions

export default cartSlice.reducer