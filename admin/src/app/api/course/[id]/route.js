import Course from "@/model/Course"
import connectDB from "@/utils/dbConfig"
import { NextResponse } from "next/server"

connectDB()

export const GET = async (request, {params}) => {
    const {id} = params
    try {
        const course = await Course.findById(id).where({approved: 'no'})
        console.log(course)
        return new NextResponse(JSON.stringify(course), {status: 200})
    } catch (error) {
        return new NextResponse('Something went wrong', {status: 500})
    }
}


