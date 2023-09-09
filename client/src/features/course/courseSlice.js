import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchAllCourses, fetchCourse, fetchCoursesByTitle, getCoursesByInstructor } from './courseService'

const initialState = {
    course: null,
    wishlistedCourses: [],
    isLoading: false,
    message: '',
    isSuccess: false
}

//get a course
// export const getCourse = createAsyncThunk("course/getCourse", async (courseId, userId, thunkApi) => {
//     try {
//         // console.log(courseId)
//         return await fetchCourse(courseId)
//     } catch (error) {
//         const statusCode = error?.response?.status
//         const message = error?.response?.data?.message    
//         return thunkApi.rejectWithValue({message, statusCode})
//     }
// })

//get all courses of an instructor
// export const coursesByInstructor = createAsyncThunk("course/coursesByInstructor", async (instructorId, thunkApi) => {
//     try {
//         return await getCoursesByInstructor(instructorId)
//     } catch (error) {
//         const statusCode = error?.response?.status
//         const message = error?.response?.data?.message    
//         return thunkApi.rejectWithValue({message, statusCode})
//     }
// })

//get all courses
// export const getAllCourses = createAsyncThunk("course/getAllCourses", async (_, thunkApi) => {
//     try {
//         return await fetchAllCourses()
//     } catch (error) {
//         const statusCode = error?.response?.status
//         const message = error?.response?.data?.message    
//         return thunkApi.rejectWithValue({message, statusCode})
//     }
// })

//get all courses
// export const getCourseByTitle = createAsyncThunk("course/getCourseByTitle", async (title, thunkApi) => {
//     try {
//         return await fetchCoursesByTitle(title)
//     } catch (error) {
//         const statusCode = error?.response?.status
//         const message = error?.response?.data?.message    
//         return thunkApi.rejectWithValue({message, statusCode})
//     }
// })

const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {
    courseReset: (state) => {
        state.isSuccess = false
        state.message = ''
    }
  },
  extraReducers: (builder) => {
    // builder
        //get a course
        // .addCase(getCourse.pending, (state) => {
        //     state.isLoading = true
        // })
        // .addCase(getCourse.fulfilled, (state, {payload}) => {
        //     console.log(payload)
        //     state.isLoading = false
        //     state.course = payload.course
        //     state.isSuccess = true
        // })
        // .addCase(getCourse.rejected, (state, {payload}) => {
        //     state.isLoading = false
        //     state.course = null
        //     state.isSuccess = false
        //     state.message = payload.message
        // })
        //get all courses
        // .addCase(getAllCourses.pending, (state) => {
        //     state.isLoading = true
        // })
        // .addCase(getAllCourses.fulfilled, (state, {payload}) => {
        //     console.log(payload)
        //     state.isLoading = false
        //     state.course = payload.coursesWithInstructor
        //     state.isSuccess = true
        // })
        // .addCase(getAllCourses.rejected, (state, {payload}) => {
        //     state.isLoading = false
        //     state.course = null
        //     state.isSuccess = false
        //     state.message = payload.message
        // })
        //get all courses by instructor
        // .addCase(coursesByInstructor.pending, (state) => {
        //     state.isLoading = true
        // })
        // .addCase(coursesByInstructor.fulfilled, (state, {payload}) => {
        //     // console.log(payload.courses)
        //     state.isLoading = false
        //     state.course = payload.courses
        //     state.isSuccess = true
        // })
        // .addCase(coursesByInstructor.rejected, (state, {payload}) => {
        //     state.isLoading = false
        //     state.course = null
        //     state.isSuccess = false
        //     state.message = payload.message
        // })
        //get course by it's title
        // .addCase(getCourseByTitle.pending, (state) => {
        //     state.isLoading = true
        // })
        // .addCase(getCourseByTitle.fulfilled, (state, {payload}) => {
        //     state.isLoading = false
        //     state.course = payload.course
        //     state.isSuccess = true
        // })
        // .addCase(getCourseByTitle.rejected, (state, {payload}) => {
        //     state.isLoading = false
        //     state.course = null
        //     state.isSuccess = false
        //     state.message = payload.message
        // })
  }
});

export const {courseReset} = courseSlice.actions

export default courseSlice.reducer