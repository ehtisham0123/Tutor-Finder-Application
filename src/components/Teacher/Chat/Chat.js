import "./Chat.css";
import { useState, useEffect } from "react";
import { reactLocalStorage } from "reactjs-localstorage";
import axios from "axios";
import { Link,useParams } from "react-router-dom";
import ChatMessages from "./ChatMessages";
function Chat() {

const token = reactLocalStorage.get("token");
  const [students, setStudents] = useState([]);
  let { id } = useParams();
  useEffect(() => {
    let getStudentsData = async () => {
      await axios
        .get(`http://localhost:5000/teacher/chat/`,{
          headers: {
            token: token,
          },
        })
        .then((response) => {
          if (response.data) {
            setStudents(response.data.result);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getStudentsData();
  }, []);

  const searchStudent = async (name) => {
    await axios
      .get(`http://localhost:5000/teacher/chat/${name}`,{
          headers: {
            token: token,
          }
        })
      .then((response) => {
        if (response.data) {
          setStudents(response.data.result);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };



  return (
   <div id="content" className="p-1 p-md-5 pt-5 content">
     <div className="container-fluid h-100">
      <div className="row justify-content-center h-100">
        <div className="col-5 col-md-4 chat">
          <div className="card chat_card mb-sm-3 mb-md-0 contacts_card">
            <div className="card-header card_header">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Search..."
                  onChange={(e) => searchStudent(e.target.value)}
                  className="form-control search"
                />          
              </div>
            </div>
            <div className="card-body card_body contacts_body">
              <ui className="contacts">
              {students.map((student) => (
              <Link  style={{ textDecoration: 'none' }}  to={`/teacher/chat/${student.id}`} > 
                <li 
                 className={`${
                    id == student.id ? "chat_active" : ""
                  }`}
                >
                  <div className="d-flex bd-highlight">
                    <div className="img_cont">
                      <img
                        src={`/uploads/${student.avatar}`} alt={student.name}
                        className="rounded-circle user_img"
                      />
                    </div>
                    <div className="user_info">
                      <span>{student.firstname} {student.lastname}</span>
                      <p>{student.name}</p>
                    </div>
                  </div>
                </li>
              </Link>            
                ))}
              </ui>
            </div>
          </div>
        </div>
        <ChatMessages studentId={id}/>
      </div>
    </div> 
    </div>
  );
}

export default Chat;



