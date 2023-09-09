import Review from "../model/Review.js";

export async function getCoursesAvgRating(courses){
    const options = [
        {
            $group: {
                _id: "$courseId",
                avgRating: { $avg: "$rating" },
                totalReviews: { $sum: 1 } 
            }
        }
    ]
    
    const groupedCourseReviews = await Review.aggregate(options).exec()
    // console.log("group ==>", groupedCourseReviews)
    const courseReview = courses.map(c => {
        const filteredaArr = groupedCourseReviews.filter(groupedCourse => groupedCourse._id?.toString() === c._id?.toString())
        // const filteredaArr = groupedCourseReviews.find(groupedCourse => groupedCourse._id.toString() === c._id?.toString())
        // console.log("💗💖", filteredaArr)
        return {
            ...c,
            avgRating: filteredaArr?.length ? parseFloat(filteredaArr[0]?.avgRating) : 0,
            reviewCount: filteredaArr?.length ? filteredaArr[0]?.totalReviews : 0
        }
    })
    // console.log("🧡💚", courseReview)
    return courseReview
}