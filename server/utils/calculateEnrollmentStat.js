export const calculateEnrollmentStat = (arr) => {
    const result = arr.reduce((acc, item) => {
        const { courseId, status } = item;
        if (!acc[courseId]) {
            acc[courseId] = {
                courseId,
                totalEnrolled: 0,
                totalRefund: 0,
            };
        }

        if (status === 'Enrolled') {
            acc[courseId].totalEnrolled++;
        } else if (status === 'Refunded') {
            acc[courseId].totalRefund++;
        }
        return acc;
    }, {});
    return Object.values(result);
}
  