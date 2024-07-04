import { useState, useEffect } from "react";
import { reactLocalStorage } from "reactjs-localstorage";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import StarRatings from "react-star-ratings";


function Course() {
  const token = reactLocalStorage.get("token");
  const [reviews, setReviews] = useState([]);
  const [course, setCourse] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [newEnrollments, SetNewEnrollments] = useState([]);
  
  let { id } = useParams();
  useEffect(() => {
    let getUserData = async () => {
      await axios
        .get(`http://localhost:5000/admin/courses/show/${id}`, {
          headers: {
            token: token,
          },
        })
        .then((response) => {
          if (response.data) {
            setCourse(response.data.result[0]);
            setReviews(response.data.reviews);
            setEnrollments(response.data.enrollments);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getUserData();
  }, [newEnrollments]);
  const deleteReview = async (id) => {
    await axios
      .delete(`http://localhost:5000/student/courses/reviews/${id}`, {
        headers: {
          token: token,
        },
      })
      .then((res) => {
        const newReviews = reviews.filter((review) => review.id !== id);
        setReviews(newReviews);
      });
  };
    const deleteEnrollment = async (id,student_id) => {
    await axios
      .delete(`http://localhost:5000/admin/courses/enrollment/course/${id}/student/${student_id}`,
      {
        headers: {
          token: token,
        },
      }
      )
      .then((res) => {
        SetNewEnrollments(enrollments.filter((enrollment) => enrollment.id !== id));
        setEnrollments(newEnrollments);
      });
  };



  return (
    <div id="content" className="mx-3">
      <div className="container">
        <h3 className="card-title text-center my-5">Course Details</h3>
        <div className="row">
          <div className="col-md-3">
            <div className="card mb-3">
              <div className="card-header">
                <h5 className="card-title mb-0 text-center">Profile</h5>
              </div>
              <div className="card-body text-center">
                <img
                  src={`/uploads/${course.teacher_photo}`}
                  alt={course.teacher_name}
                  className="img-fluid  mb-2"
                  width="100%"
                />
                <h4 className="card-title mb-0">
                  {course.teacher_firstname + " " + course.teacher_lastname}
                </h4>
                <div className="text-muted mb-2">Tutor</div>

                <div>
                  <Link to={`../../teachers/profile/${course.teacher_id}`}>
                    <button className="btn btn-outline-primary btn-sm mr-1">
                      View Profile
                    </button>
                  </Link>
                </div>
              </div>
              <hr className="my-0" />
              <div className="card-body">
                <h5 className=" card-title text-center mb-3">Enrollments</h5>         

              {enrollments.map((enrollment) => (
              <div>
                <div className="d-flex justify-content-between m-0 p-0">
                  <Link to={`/admin/students/profile/${enrollment.id}`}>
                    <img
                      src={`/uploads/${enrollment.avatar}`}
                      alt={course.student_name}
                      width="36"
                      height="36"
                      className="rounded-circle mr-2"
                    />
                   {enrollment.name}
                  </Link>
                  <Link onClick={(e) => deleteEnrollment(course.id,enrollment.id)}>
                  <i class="fa fa-times"></i>
                  </Link>                            
                </div>
                <hr/>
              </div>
               ))}
           

              </div>
              <hr className="my-0" />
            </div>
          </div>
          <div className="col-md-9">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">{course.name}</h5>
              </div>
              <div className="card-body h-100">
                <p className="no-margin-bottom">{course.details} </p>
                {reviews.map((review) => (
                  <div className="media mb-4">
                    <img
                      src={`/uploads/${review.student_photo}`}
                      alt={course.student_name}
                      width="36"
                      height="36"
                      className="rounded-circle mr-2"
                    />
                    <div className="media-body">
                      <strong>
                        {review.student_firstname} {review.student_Lastname}
                      </strong>{" "}
                      added a review on <strong>{course.name}</strong>'s Course
                         <span
                    className="btn float-right my-2"
                    onClick={(e) => deleteReview(review.id)}
                    >
                    <i className="fa fa-times text-primary"></i>
                  </span>

                      <br />
                      <small className="text-muted">{review.created_at}</small>
                      <div className="row">
                        <div className="col-md-6 text-warning font-weight-bold">
                          <StarRatings
                            rating={review.reviews}
                            starRatedColor="#0275d8"
                            starDimension="20px"
                            starSpacing="2px"
                            numberOfStars={5}
                          />
                        </div>
                      </div>
                      <div className="border text-sm text-muted p-2 mt-1">
                        {review.reviews_details}
                      </div>
                    </div>
                    <hr />
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

export default Course;

