import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchInstructor, updateInstructor } from './InstructorService'

const initialState = {
    isLoading: false,
    instructor: null,
    isSuccess: false,
    message: ''
}

//get instructor
export const getInstructor = createAsyncThunk("instructor/getInstructor", async (id, thunkApi) => {
    try {
        return await fetchInstructor(id)
    } catch (error) {
        // console.log(error.response)
        const message = error?.response?.data?.message    
        return thunkApi.rejectWithValue(message)
    }
})

//edit instructor
export const editInstructor = createAsyncThunk("instructor/editInstructor", async (_, thunkApi) => {
    try {
        return await updateInstructor()
    } catch (error) {
        // console.log(error.response)
        const message = error?.response?.data?.message    
        return thunkApi.rejectWithValue(message)
    }
})

const InstructorSlice = createSlice({
  name: 'instructor',
  initialState,
  reducers: {
    Reset: (state) => {
        state.instructor = null
        state.isLoading = false
        state.isSuccess = false
        state.message = ''
    }
  },
  extraReducers: (builder) => {
    builder
        //get instructor
        .addCase(getInstructor.pending, (state) => {
            state.isLoading = true
        })
        .addCase(getInstructor.fulfilled, (state, {payload}) => {
            state.isLoading = false
            state.instructor = payload.instructor
            state.isSuccess = true
        })
        .addCase(getInstructor.rejected, (state, {payload}) => {
            state.isLoading = false
            state.instructor = null
            state.message = payload
            state.isSuccess = false
        })
        //update instructor
        .addCase(editInstructor.pending, (state) => {
            state.isLoading = true
        })
        .addCase(editInstructor.fulfilled, (state, {payload}) => {
            state.instructor = payload
            state.isSuccess = true
        })
        .addCase(editInstructor.rejected, (state, {payload}) => {
            state.instructor = null
            state.message = payload
            state.isSuccess = false
        })
  }
});

export const {Reset} = InstructorSlice.actions

export default InstructorSlice.reducer