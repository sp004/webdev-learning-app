import Course from "@/model/Course"
import connectDB from "@/utils/dbConfig"
import { NextResponse } from "next/server"

connectDB()

export const PUT = async (request, {params}) => {
    const {id} = params

    try {
        const approvedCourse = await Course.findByIdAndUpdate(id,
            {$set: {approved: 'yes'}},
            {new: true}
        ).lean()

        return new NextResponse(JSON.stringify(approvedCourse), {status: 200})
    } catch (error) {
        return new NextResponse('Something went wrong', {status: 500})
    }
}