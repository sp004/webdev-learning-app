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
    const courseReview = courses.map(c => {
        const filteredaArr = groupedCourseReviews.filter(groupedCourse => groupedCourse._id?.toString() === c._id?.toString())
        return {
            ...c,
            avgRating: filteredaArr?.length ? parseFloat(filteredaArr[0]?.avgRating) : 0,
            reviewCount: filteredaArr?.length ? filteredaArr[0]?.totalReviews : 0
        }
    })
    return courseReview
}