import { Link } from "react-router-dom";
function CoursesTableRow({ match, course, deleteCourse }) {
  return (
    <tr role="row">
      <td>{course.id}</td>
      <td>{course.name}</td>
      <td>{course.details}</td>
      <td style={{ display: "flex" }}>
        <Link to={`${match.url}/view/${course.id}`}>
          <button className="btn btn-sm btn-outline-primary mr-1">View</button>
        </Link>
        <Link to={`${match.url}/edit/${course.id}`}>
          <button className="btn btn-sm btn-outline-secondary mr-1">
            Edit
          </button>
        </Link>
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={(e) => deleteCourse(course.id)}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

export default CoursesTableRow;
