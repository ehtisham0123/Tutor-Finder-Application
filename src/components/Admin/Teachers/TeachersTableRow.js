import { Link } from "react-router-dom";
function teachersTableRow({match,teacher,deleteTeacher}) {
  return (
      <tr role="row">
      <td>{teacher.id}</td>
      <td>{teacher.firstname} {teacher.lastname}</td>
      <td>{teacher.email}</td>
      <td>{teacher.city}</td>
      <td>{teacher.gender}</td>
      <td>{teacher.contact}</td>
      <td style={{ display: "flex" }}>
        <Link to={`${match.url}/profile/${teacher.id}`}>
          <button className="btn btn-sm btn-outline-primary mr-1">
            View
          </button>
        </Link>
        <Link to={`${match.url}/edit/${teacher.id}`}>
          <button className="btn btn-sm btn-outline-secondary mr-1">
            Edit
          </button>
        </Link>
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={(e) => deleteTeacher(teacher.id)}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

export default teachersTableRow;
