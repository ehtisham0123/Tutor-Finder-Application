import { useState, useEffect } from "react";
import { reactLocalStorage } from "reactjs-localstorage";
import LocationShowModal from "../../LocationShowModal";

import axios from "axios";
import { Link, useParams } from "react-router-dom";

function Student() {
  const token = reactLocalStorage.get("token");
  const [student, setStudent] = useState([]);
  const [courses, setCourses] = useState([]);
  let { id } = useParams();
  useEffect(() => {
    let getUserData = async () => {
      await axios
        .get(`http://localhost:5000/teacher/students/profile/${id}`, {
          headers: {
            token: token,
          },
        })
        .then((response) => {
          if (response.data) {
            setStudent(response.data.result[0]);
            setCourses(response.data.courses);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getUserData();
  }, []);
  return (
    <div id="content" className="mx-5">
      <div className="text-center my-5 ">
        <h2>Student Profile</h2>
      </div>
      <div className="row">
        <div className="col-md-4 mb-5">
          <div className="profile-img">
            <img src={`/uploads/${student.avatar}`} alt={student.name} />
          </div>
        </div>
        <div className="col-md-8">
          <div className="row">
            <div className="col-md-10">
              <div className="profile-head">
                <h2 className="text-primary d-flex justify-content-between align-items-center">
                  {student.name}
                  <Link to={`../../chat/${student.id}`}>
                    <button className="btn btn-outline-primary">
                      <i class="fa fa-message"></i> Message
                    </button>
                  </Link>
                </h2>
                <ul className="list-unstyled mb-0">
                  <li className="mt-4">
                    <i className="fa fa-home mr-2"></i>
                    Lives in
                    <span className="ml-1 text-primary"> {student.city}</span>
                  </li>

                  <li className="mt-2">
                    <i className="fa fa-map-marker mr-2"></i>
                    From
                    <span className="ml-1 text-primary">
                      {" "}
                      {student.country}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-12 mt-4">
            <ul className="nav nav-tabs mb-4" id="myTab" role="tablist">
              <li className="nav-item">
                <a
                  className="nav-link active"
                  id="location-tab"
                  data-toggle="tab"
                  href="#location"
                  role="tab"
                  aria-controls="location"
                  aria-selected="true"
                >
                  About
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  id="profile-tab"
                  data-toggle="tab"
                  href="#profile"
                  role="tab"
                  aria-controls="profile"
                  aria-selected="false"
                >
                  Location
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  id="courses-tab"
                  data-toggle="tab"
                  href="#courses"
                  role="tab"
                  aria-controls="courses"
                  aria-selected="true"
                >
                  Registered Courses
                </a>
              </li>
            </ul>

            <div className="tab-content profile-tab mt-2" id="myTabContent">
              <div
                className="tab-pane fade show active"
                id="location"
                role="tabpanel"
                aria-labelledby="location-tab"
              >
                <div className="row">
                  <div className="col-md-6">
                    <h5 className="headings">Name</h5>
                  </div>
                  <div className="col-md-6">
                    <p>
                      {student.firstname} {student.lastname}
                    </p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <h5 className="headings">Email</h5>
                  </div>
                  <div className="col-md-6">
                    <p>{student.email}</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <h5 className="headings">Phone</h5>
                  </div>
                  <div className="col-md-6">
                    <p>{student.contact}</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <h5 className="headings">Gender</h5>
                  </div>
                  <div className="col-md-6">
                    <p>{student.gender}</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <h5 className="headings">House Number</h5>
                  </div>
                  <div className="col-md-6">
                    <p>
                      {student.housenumber ? student.housenumber : <p>Null </p>}
                    </p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <h5 className="headings">Street Number</h5>
                  </div>
                  <div className="col-md-6">
                    <p>
                      {student.streetnumber ? (
                        student.streetnumber
                      ) : (
                        <p>Null</p>
                      )}
                    </p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <h5 className="headings">state</h5>
                  </div>
                  <div className="col-md-6">
                    <p>{student.state ? student.state : <p>Null </p>}</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <h5 className="headings">Postal Code</h5>
                  </div>
                  <div className="col-md-6">
                    <p>{student.postalcode}</p>
                  </div>
                </div>
              </div>

              <div
                className="tab-pane fade"
                id="profile"
                role="tabpanel"
                aria-labelledby="profile-tab"
              >
                <div className="row">
                  <div className="col-md-12">
                    <LocationShowModal
                      latitude={student.latitude}
                      longitude={student.longitude}
                    />
                  </div>
                </div>
              </div>

              <div
                className="tab-pane fade"
                id="courses"
                role="tabpanel"
                aria-labelledby="courses-tab"
              >
                {courses.map((course) => (
                  <div className="row">
                    <div className="col-12">
                      <h5 className="headings">{course.name}</h5>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Student;
