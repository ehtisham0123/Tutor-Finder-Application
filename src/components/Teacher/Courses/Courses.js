import { useState, useEffect } from "react";
import { reactLocalStorage } from "reactjs-localstorage";
import axios from "axios";
import { Link } from "react-router-dom";

import CoursesTableRow from "./CoursesTableRow";
import Pagination from "./Pagination";
import Spinner from "../../Spinner.png";

function Courses({ match, location }) {
  const token = reactLocalStorage.get("token");
  let user_id = reactLocalStorage.get("user_id");
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage, setCoursesPerPage] = useState(5);
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);

  useEffect(() => {
    setLoading(true);
    let getCoursesData = async () => {
      await axios
        .get(`http://localhost:5000/teacher/courses/`,{
          headers: {
            token: token,
          } 
        })
        .then((response) => {
          if (response.data) {
            setCourses(response.data.result);
            setLoading(false);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getCoursesData();
  }, []);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const deleteCourse = async (id) => {
    await axios
      .delete(`http://localhost:5000/teacher/courses/${id}`,{
        headers: {
          token: token,
        },
      })
      .then((res) => {
        const newCourses = courses.filter((course) => course.id !== id);
        setCourses(newCourses);
      });
  };

  const searchCourse = async (name) => {
    setLoading(true);
    await axios
      .get(`http://localhost:5000/teacher/courses/${name}`, {
        headers: {
          token: token,
        },
      })
      .then((response) => {
        if (response.data) {
          setCourses(response.data.result);
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
        <h3 className="card-title text-center">Courses table</h3>
        <div className="row d-flex align-items-center justify-content-between mr-1">
          <div>
            <input
              type="search"
              className="form-control"
              placeholder="Search"
              onChange={(e) => searchCourse(e.target.value)}
            />
          </div>
          <Link to={`${match.url}/create`}>
            <button className="btn btn-outline-primary mr-1">
              <i className="fa fa-user-plus"></i> Add Course
            </button>
          </Link>
        </div>

        <table
          className="table table-responsive dataTable mt-3"
          role="grid"
          style={{ minHeight: "350px" }}
        >
          <thead>
            <tr role="row">
              <th style={{ minWidth: "50px" }}>#</th>
              <th style={{ minWidth: "200px" }}>Name</th>
              <th style={{ minWidth: "500px" }}>Details</th>
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
              {currentCourses.map((course) => (
                <CoursesTableRow
                  match={match}
                  course={course}
                  deleteCourse={deleteCourse}
                />
              ))}
            </tbody>
          )}
        </table>

        <div className="row d-flex align-items-center">
          <div className="col-8 col-md-3 ">
            Showing {indexOfFirstCourse + 1} to {indexOfLastCourse} of{" "}
            {Courses.length} entities
          </div>
          <div class="col-4">
            <label>
              <select
                class="form-control"
                onChange={(e) => {
                  setCoursesPerPage(e.target.value);
                }}
                value={coursesPerPage}
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
              coursesPerPage={coursesPerPage}
              totalCourses={courses.length}
              paginate={paginate}
              currentPage={currentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Courses;
