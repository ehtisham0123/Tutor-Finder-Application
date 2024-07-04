import { useState, useEffect } from "react";
import TeachersTableRow from "./TeachersTableRow";
import { reactLocalStorage } from "reactjs-localstorage";
import axios from "axios";
import { Link } from "react-router-dom";
import Pagination from "./Pagination";
import Spinner from '../../Spinner.png';

function Teachers({ match, location }) {
  const token = reactLocalStorage.get("token");
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [teachersPerPage, setTeachersPerPage] = useState(5);
  const indexOfLastTeacher = currentPage * teachersPerPage;
  const indexOfFirstTeacher = indexOfLastTeacher - teachersPerPage;
  const currentTeachers = teachers.slice(
    indexOfFirstTeacher,
    indexOfLastTeacher
  );

  useEffect(() => {
    setLoading(true);
    let getUsersData = async () => {
      await axios
        .get(`http://localhost:5000/admin/teachers/`,{
          headers: {
            token: token,
          },
        })
        .then((response) => {
          if (response.data) {
            setTeachers(response.data.result);
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

  const deleteTeacher = async (id) => {
    await axios.delete(`http://localhost:5000/admin/teachers/${id}`,{
          headers: {
            token: token,
          },
        }).then((res) => {
      const newTeachers = teachers.filter((teacher) => teacher.id !== id);
      setTeachers(newTeachers);
    });
  };

  const searchTeacher = async (name) => {
    setLoading(true);
    await axios
      .get(`http://localhost:5000/admin/teachers/${name}`,{
          headers: {
            token: token,
          }
        })
      .then((response) => {
        if (response.data) {
          setTeachers(response.data.result);
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
        <h3 className="card-title text-center">Teachers table</h3>
        <div className="row d-flex align-items-center justify-content-between mr-1">
          <div>
            <input
              type="search"
              className="form-control"
              placeholder="Search"
              onChange={(e) => searchTeacher(e.target.value)}
            />
          </div>
          <Link to={`${match.url}/create`}>
            <button className="btn btn-outline-primary mr-1">
              <i className="fa fa-user-plus"></i> Add Teacher
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
           
              {currentTeachers.map((teacher) => (
                <TeachersTableRow match={match} teacher={teacher} deleteTeacher={deleteTeacher}/>
              ))}
          </tbody>
            )}
        </table>

        <div className="row d-flex align-items-center">
          <div className="col-8 col-md-3 ">
            Showing {indexOfFirstTeacher + 1} to {indexOfLastTeacher} of{" "}
            {teachers.length} entities
          </div>
          <div class="col-4">
            <label>
              <select
                class="form-control"
                onChange={(e) => {
                  setTeachersPerPage(e.target.value);
                }}
                value={teachersPerPage}
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
              teachersPerPage={teachersPerPage}
              totalTeachers={teachers.length}
              paginate={paginate}
              currentPage={currentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Teachers;
