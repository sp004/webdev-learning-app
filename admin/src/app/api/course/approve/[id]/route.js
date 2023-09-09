import Course from "@/model/Course"
import connectDB from "@/utils/dbConfig"
import { NextResponse } from "next/server"

connectDB()

export const PUT = async (request, {params}) => {
    const {id} = params
// console.log(params)
    try {
        const approvedCourse = await Course.findByIdAndUpdate(id,
            {$set: {approved: 'yes'}},
            {new: true}
        ).lean()
        console.log("😣", approvedCourse)
        // approvedCourse.approvedOn = Date.now()
        // console.log("========", approvedCourse) 
        // await approvedCourse.save()
        return new NextResponse(JSON.stringify(approvedCourse), {status: 200})
    } catch (error) {
        return new NextResponse('Something went wrong', {status: 500})
    }
}