import "./PendingApproval.scss";
import { courseDurationOfCard } from "../../../../utils/courseDurationFormatter";

const PendingApproval = ({ courseItem }) => {
  const { hour, minutes } = courseDurationOfCard(courseItem?.courseContent);
  return (
    <div className="course-card">
      <div>
        <div className="course-card--thumbnail">
          <img src={courseItem?.thumbnail} alt={courseItem?.title} />
        </div>
        <div className="course-card--info">
          <h4>{courseItem?.title}</h4>
          <p>{courseItem?.description}</p>
          <span>
            {courseItem?.courseContent?.length}{" "}
            {courseItem?.courseContent?.length > 1 ? "Lectures" : "Lecture"} •{" "}
            {hour ? `${hour}hr` : ""} {`${minutes}min`} • {courseItem?.level === 'all' ? 'All Levels': courseItem?.level}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PendingApproval;
