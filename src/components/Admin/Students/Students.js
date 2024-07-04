import { useState, useEffect } from "react";
import StudentsTableRow from "./StudentsTableRow";
import { reactLocalStorage } from "reactjs-localstorage";
import axios from "axios";
import { Link } from "react-router-dom";
import Pagination from "./Pagination";
import Spinner from '../../Spinner.png';

function Students({ match, location }) {
  const token = reactLocalStorage.get("token");
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage, setStudentsPerPage] = useState(5);
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = students.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  useEffect(() => {
    setLoading(true);
    let getUsersData = async () => {
      await axios
        .get(`http://localhost:5000/admin/students/`,{
          headers: {
            token: token,
          },
        })
        .then((response) => {
          if (response.data) {
            setStudents(response.data.result);
            setLoading(false);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getUsersData();
  }, []);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const deleteStudent = async (id) => {
    await axios.delete(`http://localhost:5000/admin/students/${id}`,{
          headers: {
            token: token,
          },
        }).then((res) => {
      const newstudents = students.filter((student) => student.id !== id);
      setStudents(newstudents);
    });
  };

  const searchStudent = async (name) => {
    setLoading(true);
    await axios
      .get(`http://localhost:5000/admin/students/${name}`,{
          headers: {
            token: token,
          }
        })
      .then((response) => {
        if (response.data) {
          setStudents(response.data.result);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div id="content" className="p-4">
      <div className="card-body">
        <h3 className="card-title text-center">Students table</h3>
        <div className="row d-flex align-items-center justify-content-between mr-1">
          <div>
            <input
              type="search"
              className="form-control"
              placeholder="Search"
              onChange={(e) => searchStudent(e.target.value)}
            />
          </div>
          <Link to={`${match.url}/create`}>
            <button className="btn btn-outline-primary mr-1">
              <i className="fa fa-user-plus"></i> Add Student
            </button>
          </Link>
        </div>

        <table
          className="table table-responsive dataTable mt-3"
          role="grid"
          style={{ minHeight: "350px"}}
        >
          <thead>
            <tr role="row">
              <th style={{ minWidth: "70px" }}>#</th>
              <th style={{ minWidth: "100px" }}>Name</th>
              <th style={{ minWidth: "270px" }}>Email</th>
              <th style={{ minWidth: "100px" }}>City</th>
              <th style={{ minWidth: "50px" }}>Gender</th>
              <th style={{ minWidth: "100px" }}>Contact</th>
              <th style={{ minWidth: "100px" }}>Actions</th>
            </tr>
          </thead>
           {loading ? (
              <div className="loading">
                  <img src={Spinner} className="loader" alt="loader" />
                  <h2>Loading</h2>
              </div>
            ) : (
          <tbody>
           
              {currentStudents.map((student) => (
                <StudentsTableRow match={match} student={student} deleteStudent={deleteStudent}/>
              ))}
          </tbody>
            )}
        </table>

        <div className="row d-flex align-items-center">
          <div className="col-8 col-md-3 ">
            Showing {indexOfFirstStudent + 1} to {indexOfLastStudent} of{" "}
            {students.length} entities
          </div>
          <div class="col-4">
            <label>
              <select
                class="form-control"
                onChange={(e) => {
                  setStudentsPerPage(e.target.value);
                }}
                value={studentsPerPage}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
              </select>
            </label>
          </div>
          <div className="col-12 col-md-4 d-flex justify-content-center">
            <Pagination
              studentsPerPage={studentsPerPage}
              totalStudents={students.length}
              paginate={paginate}
              currentPage={currentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Students;
