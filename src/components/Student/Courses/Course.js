import { useState, useEffect } from "react";
import { reactLocalStorage } from "reactjs-localstorage";
import StarRatings from "react-star-ratings";

import axios from "axios";
import { Link, useParams } from "react-router-dom";

function Course() {
  const token = reactLocalStorage.get("token");
  const user_id = reactLocalStorage.get("user_id");
  console.log(user_id)
  const [reviews, setReviews] = useState([]);
  const [course, setCourse] = useState([]);
  const [enrollment, setEnrollment] = useState();
  const [checkReview, setCheckReview] = useState(true);
  const [rating, SetRating] = useState(1);
  const [reviewDetails, SetReviewDetails] = useState("");

  let { id } = useParams();
  useEffect(() => {
    let getUserData = async () => {
      await axios
        .get(`http://localhost:5000/student/courses/show/${id}`, {
          headers: {
            token: token,
          },
        })
        .then((response) => {
          if (response.data) {
            setCourse(response.data.result[0]);
            setReviews(response.data.reviews);
            setEnrollment(response.data.enrollment_id);
            response.data.reviews.map((review) => {  
            if(review.student_id == user_id){
                setCheckReview(false);
            }
            })
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getUserData();
  }, [checkReview,enrollment]);

  const enroll = async (id) => {
    await axios
      .post(
        `http://localhost:5000/student/courses/enroll/`,
        {
          course_id: course.id,
          teacher_id: course.teacher_id,
        },
        {
          headers: {
            token: token,
          },
        }
      )
      .then((res) => {
        if (res.data.enrollment_id) {
          setEnrollment(res.data.enrollment_id);
        }
      });
  };

  const deleteEnrollment = async (id) => {
    await axios
      .delete(`http://localhost:5000/student/courses/enrollment/${id}`, {
        headers: {
          token: token,
        },
      })
      .then((res) => {
        setEnrollment(false);
        setCheckReview(true)
      });
  };
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
        setCheckReview(true)
      });
  };

  const changeRating = (newRating, name) => {
    SetRating(newRating);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post(
        "http://localhost:5000/student/courses/review",
        {
          course_id: course.id,
          teacher_id: course.teacher_id,
          enorllment_id: enrollment,
          reviews:rating,
          reviews_details:reviewDetails,
        },
        {
          headers: {
            token: token,
          },
        }
      )
      .then(
        (response) => {
          if (response.data.success) {
            SetRating(1);
            SetReviewDetails('');
            setCheckReview(false)
          } 
        },
        (error) => {
          console.log(error);
        }
      );
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
                  <Link
                    to={`/student/courses/teacherprofile/${course.teacher_id}`}
                  >
                    <button className="btn btn-outline-primary btn-sm mb-1 mr-1">
                      View Profile
                    </button>
                  </Link>
                   <Link
                    to={`/student/chat/${course.teacher_id}`}
                  >
                  <button className="btn btn-outline-primary btn-sm mb-1 mr-1">
                    Message
                  </button>
                  </Link>
                </div>
              </div>
              <hr className="my-0" />
              <hr className="my-0" />
              <div className="card-body">
                <h5 className="h6 card-title">About</h5>
                <ul className="list-unstyled mb-0">
                  <li className="mb-1">
                    <i className="fa fa-home"></i>
                    Lives in{" "}
                    <span className="text-primary">{course.teacher_city}</span>
                  </li>

                  <li className="mb-1">
                    <i className="fa fa-map-marker"></i> From{" "}
                    <span className="text-primary">
                      {course.teacher_country}
                    </span>
                  </li>
                </ul>
              </div>
              <hr className="my-0" />
                   
            </div>
          </div>
          <div className="col-md-9">
            <div className="card">
              <div className="card-header d-flex justify-content-between">
                <h5 className="card-title mb-0">{course.name}</h5>
                {enrollment ? (
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={(e) => deleteEnrollment(course.id)}
                  >
                    Drop Course
                  </button>
                ) : (
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={(e) => enroll(course.id)}
                  >
                    <i className="fa fa-book mr-1"></i>Enroll Course
                  </button>
                )}
              </div>
              <div className="card-body h-100">
                <p className="no-margin-bottom">{course.details} </p>
                <hr />
                  {checkReview ? 
                    enrollment ?
                      <div className="card-body">
                        <h5 className="h6 card-title">Add Review</h5>
                          <form onSubmit={handleSubmit} className="needs-validation">
                            <div className="row">
                              <div className="form-group col-md-12">
                                <textarea
                                  name="details"
                                  className="form-control"
                                  id="details"
                                  placeholder="Your Review"
                                  onChange={(e) => {
                                    SetReviewDetails(e.target.value);
                                  }}
                                  value={reviewDetails}
                                  rows="2"
                                  required
                                ></textarea>
                              </div>
                              <div className="form-group col-md-12">
                                <StarRatings
                                  rating={rating}
                                  starRatedColor="#0275d8"
                                  starHoverColor="#000"
                                  starDimension="25px"
                                  starSpacing="2px"
                                  changeRating={changeRating}
                                  numberOfStars={5}
                                  name="rating"
                                />
                              </div>
                              <div className="form-group col-md-12">
                                <button
                                  type="submit"
                                  className="form-control btn btn-sm btn-outline-primary"
                                >
                                  Add Review
                                </button>
                              </div>
                            </div>
                          </form>
                      </div>
                    :null
                  :null
                  }
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
                    {review.student_id == user_id &&  
                      <button
                      className="btn btn-sm btn-outline-danger float-right my-2"
                      onClick={(e) => deleteReview(review.id)}
                      >
                      Delete Review
                    </button>
                    }

                      <br />
                      <small className="text-muted">{review.created_at}</small>
                      <div className="row">
                        <div className="col-md-12 my-1">
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
