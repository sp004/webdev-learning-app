import Course from "@/model/Course"
import User from "@/model/User"
import connectDB from "@/utils/dbConfig"
import { sendEmail } from "@/utils/mailer"
import { NextResponse } from "next/server"

connectDB()

export const POST = async (request, {params}) => {
    const {id} = params
    const {reason} = await request.json()
    try {
        const course = await Course.findById(id)
        if(!course) return NextResponse.json({message: "Course approval rejected",success: true}, {status: 200})

        const instructor = await User.findById(course?.createdBy).select(["email", "-_id"]) 

        course.approved = 'rejected'
        // course.approvedOn = Date.now()
        await course.save()

        //send verification email
        await sendEmail({email: instructor?.email, courseId: id, title: course?.title, reason})

        return NextResponse.json({
            message: "Course approval rejected",
            success: true,
        }, {status: 201})
    } catch (error) {
        return new NextResponse({message: 'Something went wrong'}, {status: 500})
    }
}