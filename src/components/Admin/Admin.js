import Home from "../Home";
import Students from "./Students/Students";
import CreateStudent from "./Students/CreateStudent";
import EditStudent from "./Students/EditStudent"; 
import Student from "./Students/Student";

import Teachers from "./Teachers/Teachers";
import CreateTeacher from "./Teachers/CreateTeacher";
import EditTeacher from "./Teachers/EditTeacher"; 
import Teacher from "./Teachers/Teacher";

import Courses from "./Courses/Courses";
import EditCourse from "./Courses/EditCourse"; 
import Course from "./Courses/Course";

import {useState} from "react";
import { Link ,Switch ,Route} from "react-router-dom";
import {reactLocalStorage} from 'reactjs-localstorage';

import logo_background from "../../logo_background.jpg";
import logo from "../../logo.png";


function Admin({history,match,location}) {
  
  const checkStudents =  location.pathname.includes("admin/students");
  const checkTeachers =  location.pathname.includes("admin/teachers");
  const checkCourses =  location.pathname.includes("admin/courses");
  const [active, setActive] = useState(false);

  const logout = ()=>{
    reactLocalStorage.remove('token');
    reactLocalStorage.remove('user_id');
    reactLocalStorage.remove('user_name');
    reactLocalStorage.remove('user_role');
    history.push("/admin-login");
  }

  const toggleClass = () => {
      const currentState = active;
      setActive(!currentState );
  };

  if (!reactLocalStorage.get('token')){
    history.push("/admin-login");
   }
  else if (reactLocalStorage.get('user_role') !== 'admin'){
    logout();    
    history.push("/admin-login");
   
   }


  return (
      <div className="wrAdminer d-flex align-items-stretch">
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
               className={`${location.pathname === "/admin"  ? "active" : ""}`} 
              >
                <a>
                  <span className="fa fa-home mr-3"></span> Home
                </a>
              </li>
            </Link>


           <Link to={`${match.url}/teachers`}>
              <li
              className={`${checkTeachers ? "active" : ""}`} 
              >
                <a>
                  <span className="fa fa-user mr-3"></span>
                  Teachers
                </a>
              </li>
            </Link>              


           <Link to={`${match.url}/students`}>
              <li
              className={`${checkStudents ? "active" : ""}`} 
              >
                <a>
                  <span className="fa fa-graduation-cap mr-3"></span>
                  Students
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
                <a>
                   <span className="fa fa-sign-out mr-3" aria-hidden="true"></span>
                    Logout
                </a>  
              </li>
            </Link>    
          </ul>
        </nav>
        <Switch>

          <Route exact path={`${match.path}`}  component={Home} />
    
          <Route exact path={`${match.path}/students`} component={Students} />
          
          <Route path={`${match.path}/students/create`} component={CreateStudent}/>
             
          <Route path={`${match.path}/students/profile/:id`} component={Student}/>
                      
          <Route path={`${match.path}/students/edit/:id`} component={EditStudent}/>
          
          

          <Route exact path={`${match.path}/teachers`} component={Teachers} />
          
          <Route path={`${match.path}/teachers/create`} component={CreateTeacher}/>
             
          <Route path={`${match.path}/teachers/profile/:id`} component={Teacher}/>
                      
          <Route path={`${match.path}/teachers/edit/:id`} component={EditTeacher}/>



          <Route exact path={`${match.path}/courses`} component={Courses} />
             
          <Route path={`${match.path}/courses/view/:id`} component={Course}/>
                      
          <Route path={`${match.path}/courses/edit/:id`} component={EditCourse}/>
             
        </Switch>
      </div>
  );
}

export default Admin;
