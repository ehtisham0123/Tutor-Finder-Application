import "./App.css";
import {reactLocalStorage} from 'reactjs-localstorage';

import Home from "./Home";
import Admin from "./components/Admin/Admin";
import Teacher from "./components/Teacher/Teacher";
import Student from "./components/Student/Student";

import AdminLogin from "./components/Admin/AdminLogin";
import TeacherLogin from "./components/Teacher/TeacherLogin";
import TeacherSignup from "./components/Teacher/TeacherSignup";
import StudentLogin from "./components/Student/StudentLogin";
import StudentSignup from "./components/Student/StudentSignup";

import { Link, Switch, Route } from "react-router-dom";
import { useState } from "react";

import logo_background from "./logo_background.jpg";
import logo from "./logo.png";

function App({ location,history }) {



  const [active, setActive] = useState(false);
  const toggleClass = () => {
    const currentState = active;
    setActive(!currentState);
  };
  return (
    <div className="App">
      <Switch>
        <Route path="/admin" component={Admin} />
        <Route path="/teacher" component={Teacher} />
        <Route path="/student" component={Student} />

        <div className="wrapper d-flex align-items-stretch"  >
          <nav id="sidebar" className={active ? "active" : null}>
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
              <Link to={`/`}>
                <li className={`${location.pathname === "/" ? "active" : ""}`}>
                  <a href="">
                    <span className="fa fa-home mr-3"></span>
                    Home
                  </a>
                </li>
              </Link>
              <Link to={`/admin-login`}>
                <li
                  className={`${
                    location.pathname === "/admin-login" ? "active" : ""
                  }`}
                >
                  <a href="">
                    <span className="fa fa-sign-in mr-3"></span>
                    Admin Login
                  </a>
                </li>
              </Link>
              
                <Link to={`/student-signup`}>
                <li
                  className={`${
                    location.pathname === "/student-signup" ? "active" : ""
                  }`}
                >
                  <a href="">
                    <span className="fa fa-user-plus mr-3"></span>
                    Student Registration
                  </a>
                </li>
              </Link>
              <Link to={`/student-login`}>
                <li
                  className={`${
                    location.pathname === "/student-login" ? "active" : ""
                  }`}
                >
                  <a href="">
                    <span className="fa fa-sign-in mr-3"></span>
                    Student Login
                  </a>
                </li>
              </Link>
              <Link to={`/teacher-signup`}>
                <li
                  className={`${
                    location.pathname === "/teacher-signup" ? "active" : ""
                  }`}
                >
                  <a href="">
                    <span className="fa fa-user-plus mr-3"></span>
                    Teacher Registration
                  </a>
                </li>
              </Link>
              <Link to={`/teacher-login`}>
                <li
                  className={`${
                    location.pathname === "/teacher-login" ? "active" : ""
                  }`}
                >
                  <a href="">
                    <span className="fa fa-sign-in mr-3"></span>
                    Teacher Login
                  </a>
                </li>
              </Link>

              
            </ul>
          </nav>

          <Route exact path="/" component={Home} />
          <Route path="/admin-login" component={AdminLogin} />
          <Route path="/teacher-login" component={TeacherLogin} />
          <Route path="/teacher-signup/" component={TeacherSignup} />
          <Route path="/student-login" component={StudentLogin} />
          <Route path="/student-signup" component={StudentSignup} />
        </div>
      </Switch>
    </div>
  );
}

export default App;
