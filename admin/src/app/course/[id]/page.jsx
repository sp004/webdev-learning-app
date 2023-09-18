// "use client"

import React from "react";
import { notFound } from "next/navigation";
import AdminAction from "@/components/AdminAction/AdminAction";
import "./CourseDetails.scss";

async function getCourse(id) {
  console.log(id);
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/course/${id}`, {
    cache: "no-store",
  });
  // console.log(await res.json())
  const data = await res.json();
  if (!res?.ok) {
    return notFound();
  }
  return data;
}

export async function generateMetadata({ params }) {
  const course = await getCourse(params?.id);
  return {
    title: course?.title || "No Course found",
    description: course?.description,
  };
}

const CoursePage = async ({ params }) => {
  const course = await getCourse(params.id);
  if (!course) {
    return <p className="loader">No course found!!!</p>;
  }
  return (
    <section>
      <div>
        <div className="info-field">
          <label>Title:</label>
          <p>{course?.title}</p>
        </div>
        <div className="info-field">
          <label>Description:</label>
          <p>{course?.description}</p>
        </div>
        <div className="info-field">
          <label>Category:</label>
          <p>{course?.category}</p>
        </div>
        <div className="info-field">
          <label>Level:</label>
          <p>{course?.level}</p>
        </div>
        <div className="info-field">
          <label>Price:</label>
          <p>{course?.price}</p>
        </div>
        <div className="info-field content">
          <label>Content:</label>
          {course?.courseContent?.map((content) => (
            // <h1 key={content?._id}>{content?.lecture}</h1>
            <ul key={content?._id}>
              <li>
                <b>Lecture: </b>
                {content?.lecture}
              </li>
              <li>
                <b>Discussion: </b>
                {content?.discussion}
              </li>
              <li>
                <b>Duration: </b>
                {content?.duration}
              </li>
            </ul>
          ))}
        </div>
        <div className="info-field">
          <label>Video:</label>
          <video width="400" controls>
            <source src={course?.video} />
          </video>
        </div>

        <AdminAction id={params?.id} />
      </div>
    </section>
  );
};

export default CoursePage;
