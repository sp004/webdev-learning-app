import Course from "@/model/Course"
import User from "@/model/User";
import connectDB from "@/utils/dbConfig";
import { NextResponse } from "next/server"

connectDB();

export const GET = async () => {
    try {
        const courses = await Course.find({approved: 'no'})
        const instructor = await Promise.all(courses.map(item => User.findById(item?._doc?.createdBy))) 

        const resultedCourses = courses.map((c, i) => ({
            ...c._doc, 
            instructor: instructor[i]?.fullName, 
            email: instructor[i]?.email,
            avatar: instructor[i]?.avatar
        }))

        return new NextResponse(JSON.stringify(resultedCourses), {status: 200})
    } catch (error) {
        return new NextResponse({error: 'Something went wrong'}, {status: 500})
    }
}