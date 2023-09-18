import EnrolledCourse from "../model/EnrolledCourse.js";

export async function checkEnrolled(courses, userId){
    const enrolledData = (await Promise.all(courses?.map(async course => {
        const isEnrolled = await EnrolledCourse.findOne({userId, courseId: course._id}).exec()
        return {
            ...course._doc,
            isEnrolled: !!isEnrolled //convert the isEnrolled object to a boolean
        }
    }))).flat(1)
    return enrolledData
}