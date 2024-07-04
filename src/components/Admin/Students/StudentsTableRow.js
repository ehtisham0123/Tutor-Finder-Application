import { Link } from "react-router-dom";
function StudentsTableRow({match,student,deleteStudent}) {
  return (
      <tr role="row">
      <td>{student.id}</td>
      <td>{student.firstname} {student.lastname}</td>
      <td>{student.email}</td>
      <td>{student.city}</td>
      <td>{student.gender}</td>
      <td>{student.contact}</td>
      <td style={{ display: "flex" }}>
        <Link to={`${match.url}/profile/${student.id}`}>
          <button className="btn btn-sm btn-outline-primary mr-1">
            View
          </button>
        </Link>
        <Link to={`${match.url}/edit/${student.id}`}>
          <button className="btn btn-sm btn-outline-secondary mr-1">
            Edit
          </button>
        </Link>
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={(e) => deleteStudent(student.id)}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

export default StudentsTableRow;
