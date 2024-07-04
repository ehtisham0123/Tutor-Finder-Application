import { useState } from "react";
import { Link ,Switch ,Route} from "react-router-dom";
import {reactLocalStorage} from 'reactjs-localstorage';

import Home from "../Home";

import Chat from "./Chat/Chat";

import EnrolledCourses from "./Courses/EnrolledCourses";
import Courses from "./Courses/Courses";
import Course from "./Courses/Course";

import EditProfile from "./Profile/EditProfile"; 
import Profile from "./Profile/Profile";

import Teacher from "./Teachers/Teacher";

import logo_background from "../../logo_background.jpg";
import logo from "../../logo.png";


function Student({history,match,location}) {
  const checkStudents =  location.pathname.includes("student/students");
  const checkProfile =  location.pathname.includes("student/profile");
  const checkCourses =  location.pathname.includes("student/courses");
  const checkChat =  location.pathname.includes("student/chat");
  const checkErollments =  location.pathname.includes("student/erollments");
  const [active, setActive] = useState(false);
  const avatar = reactLocalStorage.get('user_avatar')
const logout = () => {
    reactLocalStorage.remove('token');
    reactLocalStorage.remove('user_id');
    reactLocalStorage.remove('user_role');
    reactLocalStorage.remove('user_avatar');
    reactLocalStorage.remove('user_name');
    history.push("/student-login");
  }

  if (!reactLocalStorage.get('token')){
    history.push("/student-login");
   }
  else if (reactLocalStorage.get('user_role') != 'student'){
    logout();    
    history.push("/student-login");
   }

  const toggleClass = () => {
      const currentState = active;
      setActive(!currentState );
  };

  return (
      <div className="wrapper d-flex align-items-stretch">
            <nav id="sidebar" className={active ? 'active': null}>
            <div className="custom-menu">
             <button
              type="button"
              id="sidebarCollapse"
              className="btn btn-primary"
              onClick={toggleClass} 
            ></button>
          </div>
          <div
            className="img bg-wrap text-center py-4"
            style={{ backgroundImage: "url(" + logo_background + ")" }}
          >
            <div className="user-logo">
              <div
                className="img"
                style={{ backgroundImage: "url(" + logo + ")" }}
              ></div>
              <h3>E Shagrid</h3>
            </div>
          </div>
            
          <ul className="list-unstyled components mb-5">
            
            <Link to={`${match.url}`}>
              <li 
               className={`${location.pathname === "/student"  ? "active" : ""}`} 
              >
                <a href="">
                  <span className="fa fa-home mr-3"></span> Home
                </a>
              </li>
            </Link>

             <Link to={`${match.url}/profile`}>
              <li 
              className={`${checkProfile ? "active" : ""}`} 
              >
                <a href="">
                  <span className="fa fa-user mr-3"></span> Profile
                </a>
              </li>
            </Link>

                  <Link to={`${match.url}/chat`}>
              <li 
              className={`${checkChat ? "active" : ""}`} 
              >
                <a href="">
                  <span className="fa fa-comment mr-3"></span> Chat
                </a>
              </li>
            </Link>


            <Link to={`${match.url}/courses`}>
              <li
              className={`${checkCourses ? "active" : ""}`} 
              >
                <a href="#">
                  <span className="fa fa-book mr-3" aria-hidden="true"></span>
                  Courses
                </a>
              </li>
            </Link>     
            <Link onClick={logout}>
              <li>
                <a href="">
                   <span className="fa fa-sign-out mr-3" aria-hidden="true"></span>
                    Logout
                </a>  
              </li>
            </Link>    
          </ul>
        </nav>
        <Switch>

          <Route exact path={`${match.path}`}  component={Home} />  

          <Route exact path={`${match.path}/chat/:id?`}  component={Chat} />  

          <Route path={`${match.path}/profile/edit/`} component={EditProfile}/>
          
          <Route path={`${match.path}/profile/`} component={Profile}/>
          
                      
          <Route exact path={`${match.path}/courses`} component={Courses} />
             
          <Route path={`${match.path}/courses/enrolled-courses`} component={EnrolledCourses} />
             
          <Route path={`${match.path}/courses/view/:id`} component={Course}/>
                      
          <Route path={`${match.path}/courses/studentprofile/:id`} component={Student}/> 

          <Route path={`${match.path}/courses/teacherprofile/:id`} component={Teacher}/> 


        </Switch>
         <div class="bio-ride">
          <div class="row">
            <div class="col-lg-3 col-md-4 col-sm-4 col-4 ride">
           <img
              src={`/uploads/${avatar}`}
              className=" profile_img"
            />
            </div>
            <div class="col-lg-9 col-md-8 col-sm-8 col-8 ">
                <p>{reactLocalStorage.get('user_name')}</p>   
            </div>
          </div>
            </div>



      </div>
  );
}

export default Student;
