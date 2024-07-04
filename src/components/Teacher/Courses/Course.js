import { useState, useEffect } from "react";
import { reactLocalStorage } from "reactjs-localstorage";
import StarRatings from "react-star-ratings";

import axios from "axios";
import { Link, useParams } from "react-router-dom";

function Course() {
  
  const token = reactLocalStorage.get("token");
  const [reviews, setReviews] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [course, setCourse] = useState([]);
  let { id } = useParams();
  useEffect(() => {
    let getUserData = async () => {
      await axios
        .get(`http://localhost:5000/teacher/courses/show/${id}`, {
        headers: {
          token: token,
        },
      })
        .then((response) => {
          if (response.data) {
            setCourse(response.data.result[0]);
            setReviews(response.data.reviews)
            setEnrollments(response.data.enrollments)
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getUserData();
  }, [reviews]);

   const deleteEnrollment = async (id) => {
    await axios
      .delete(`http://localhost:5000/teacher/courses/enrollment/${id}`, {
        headers: {
          token: token,
        },
      })
      .then((res) => {
        const newEnrollments = enrollments.filter((enrollment) => enrollment.id !== id);
        setReviews(newEnrollments);
      });
  };



  return (
    <div id="content" className="mx-3">
   <div className="container">
<h3 className="card-title text-center my-5">Course Details</h3>
<div className="row">
    <div className="col-md-8">
        <div className="card">
            <div className="card-header">
                <h5 className="card-title mb-0">{course.name}</h5>
            </div>
            <div className="card-body h-100">
                <p className="no-margin-bottom">{course.details} </p>                              
                {reviews.map((review) => (
                    <div className="media mb-4">
                        <img src={`/uploads/${review.student_photo}`} alt={course.student_name} width="36" height="36" className="rounded-circle mr-2"/>
                        <div className="media-body">                 
                            <strong>{review.student_firstname} {review.student_lastname}</strong> added a review on <strong>{course.name}</strong>'s Course
                            <br/>
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
                    <hr/> 
                    </div>
                ))}
            </div>
        </div>
    </div>
    <div className="col-md-4">
            <div className="card mb-3">
              <div className="card-header">
                <h5 className="card-title mb-0 text-center">Enrollments</h5>
              </div>
              <div className="card-body">
              {enrollments.map((enrollment) => (
              <div>
                <div className="d-flex justify-content-between m-0 p-0">
                  <Link to={`/teacher/courses/studentprofile/${enrollment.id}`}>
                    <img
                      src={`/uploads/${enrollment.avatar}`}
                      alt={course.student_name}
                      width="36"
                      height="36"
                      className="rounded-circle mr-2"
                    />
                   {enrollment.name}
                  </Link>
                  <Link onClick={(e) => deleteEnrollment(course.id)}>
                  <i class="fa fa-times"></i>
                  </Link>                            
                </div>
                <hr/>
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
