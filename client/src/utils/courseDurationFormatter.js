export const courseDurationFormatter = (course) => {
    const sum = course?.reduce((iv, cv) => iv + cv.duration, 0);
    const h = Math.floor(sum / 60);
    const m = sum - h * 60;

    return {
        hour: h,
        minute: m
    }
}

export const courseDurationOfCard = (course) => {
    let hour = ''
    let minutes = ''
    const courseDuration = course?.reduce((acc, cur) => (acc + cur.duration), 0)

    if(courseDuration < 60){
        minutes = courseDuration
    }else{
        hour = Math.floor(courseDuration/60)
        minutes = courseDuration%60
    }
    return {hour, minutes}
}