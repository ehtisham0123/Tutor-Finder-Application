import { Link } from "react-router-dom";
function EnrolledCoursesTableRow({ deleteEnrollment , match, course ,  }) {
  return (
    <tr role="row">
      <td>{course.id}</td>
      <td>{course.name}</td>
      <td>{course.details}</td>
      <td style={{ display: "flex" }}>
        <Link to={`/student/courses/view/${course.id}`}>
          <button className="btn btn-sm btn-outline-primary mr-1">View</button>
        </Link>   
          <button
          className="btn btn-sm btn-outline-danger"
          onClick={(e) => deleteEnrollment(course.id)}
        >
          Drop Course
        </button>  
      </td>
    </tr>
  );
}

export default EnrolledCoursesTableRow;
