import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosPrivate, axiosPublic } from "../../api/apiMethod";

//add course to the cart
export const addToCart = createAsyncThunk("cart/addToCart", async (courseId, thunkApi) => {
    try {
        const {data} = await axiosPublic.post(`/cart/add/${courseId}`, {withCredentials: true})
        console.log("slice ===> ",data)
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
        console.log(data)
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
            // console.log(payload)
            state.courses = []
            state.totalPrice = 0
            state.message = ''
            state.isSuccess = false
        }
        // addToCart: (state, {payload}) => {
        //     // state.courses.push(payload)
        //     // state.userId = state.payload?.userId
        //     // state.totalPrice = state.courses?.reduce((acc, next) => acc + next.price, 0)
        //     return {
        //         ...state,
        //         courses: [...state.courses, payload],
        //         userId: payload.userId || state.userId,
        //         totalPrice: state.totalPrice + payload.price
        //     };
        // },
        // removeToCart: (state, {payload}) => {
        //     // console.log(payload)
        //     // state.courses?.filter(item => item._id === payload._id)
        //     // const indexToRemove = state.courses?.findIndex(item => item._id === payload._id)
        //     // if(indexToRemove !== -1 && state.courses.splice(indexToRemove, 1))
        //     // state.userId = ''
        //     // state.totalPrice -= payload.price

        //     const index = state.courses.findIndex((course) => course.id === payload.id);

        //     if (index !== -1) {
        //         const newCourses = [...state.courses];
        //         newCourses.splice(index, 1);

        //         return {
        //         ...state,
        //         courses: newCourses,
        //         totalPrice: state.totalPrice - payload.price
        //         };
        //     }

        //     return state;
        // },
        
    },
    extraReducers: (builder) => {
        builder
            .addCase(addToCart.pending, (state) => {
                state.isLoading = true
            })
            .addCase(addToCart.fulfilled, (state, {payload}) => {
                console.log("fulfil", payload)
                state.isLoading = false
                state.isSuccess = true
                state.message = payload.message
            })
            .addCase(addToCart.rejected, (state, {payload}) => {
                console.log("reject", payload)
                state.isLoading = false
                state.isSuccess = false
                state.message = payload.message
            })
            
            .addCase(removeFromCart.pending, (state) => {
                state.isLoading = true
            })
            .addCase(removeFromCart.fulfilled, (state, {payload}) => {
                console.log("fullfil", payload)
                state.isLoading = false
                state.isSuccess = true
                state.message = payload.message
            })
            .addCase(removeFromCart.rejected, (state, {payload}) => {
                console.log("reject", payload)
                state.isLoading = false
                state.isSuccess = false
                state.message = payload.message
            })

            .addCase(fetchCartCourses.pending, (state) => {
                state.isLoading = true
            })
            .addCase(fetchCartCourses.fulfilled, (state, {payload}) => {
                console.log("fullfil", payload)
                state.isLoading = false
                state.isSuccess = true
                state.courses = payload.data?.map(course => course.courseId)
                state.totalPrice = payload.totalPrice
            })
            .addCase(fetchCartCourses.rejected, (state, {payload}) => {
                console.log("reject", payload)
                state.isLoading = false
                state.isSuccess = false
                state.message = payload.message
            })
    }
})

export const {clearCart} = cartSlice.actions

export default cartSlice.reducer