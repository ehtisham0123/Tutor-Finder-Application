import { Link } from "react-router-dom";
function CoursesTableRow({ match, course }) {
  return (
    <tr role="row">
      <td>{course.id}</td>
      <td>{course.name}</td>
      <td>{course.details}</td>
      <td style={{ display: "flex" }}>
        <Link to={`/student/courses/view/${course.id}`}>
          <button className="btn btn-sm btn-outline-primary mr-1">View</button>
        </Link>   
      </td>
    </tr>
  );
}

export default CoursesTableRow;
