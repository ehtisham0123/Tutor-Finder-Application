var express = require("express");
var router = express.Router();
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const verifyToken = require("../verifyToken");
const fileUpload = require("express-fileupload");
const fs = require("fs");
router.use(fileUpload());

let db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "project",
});

// connect to database
db.connect();


/* GET students listing. */
router.get("/:id", verifyToken, async function (req, res, next) {
  try {
    var sql = `SELECT students.* FROM students WHERE students.id = ?`;
    await db.query(sql, [req.params.id], function (err, result) {
      (async () => {
        try{
          sql = `
          SELECT courses.*
          FROM courses
          WHERE courses.id IN
          (SELECT enrollment.course_id
          FROM enrollment
          WHERE
          student_id = ?)
          `;
             await db.query(sql, [req.params.id], function (err, courses) {         
               res.status(201).json({ result: result , courses : courses });
              });
        }catch (er) {
            console.log(err);
        }
        })();

      });
      } catch (er) {
      console.log(err);
    }

});


module.exports = router;
