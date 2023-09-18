// "use client"

import Image from 'next/image'
import './PendingApproval.scss'
import Link from 'next/link'

const getUnapprovedCourses = async () => {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/courses`, {cache: 'no-cache'})
    // console.log(res)
    if(!res.ok) throw new Error("Something went wrong")
    return res.json()
}

export const metadata = {
    title: 'Pending Aprroval',
    description: 'Admin dashboard of Webdev Skool application',
}

const PendingApprovalPage = async () => {
    const courses = await getUnapprovedCourses()

    if(courses?.length === 0) {
        return <p className='loader'>No pending courses</p>
    }

    return (
        <section className='course-container'>
            <h2>Approval Pending</h2>
            <div className='courses'>
                {courses?.map(course => (
                    <Link href={`course/${course?._id}`} key={course?._id} className='course-card'>
                        <div className="thumbnail">
                            <Image src={course?.thumbnail} alt='thumbnail' width={220} height={150} priority={true} />
                        </div>
                        <div className="info">
                            <h4>{course?.title}</h4>
                            <p>{course?.description}</p>
                            <sub>{new Intl.DateTimeFormat('en-IN').format(new Date(course?.uploadedOn))}</sub>
                        </div>
                        <hr />
                        <div className='instructor'>
                            <Image src={course?.avatar} alt='avatar' width={40} height={40} style={{borderRadius: '50%', border: '1px solid black'}} />
                            <div className="info">
                                <h5>{course?.instructor}</h5>
                                <sub>{course?.email}</sub>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    )
}

export default PendingApprovalPage