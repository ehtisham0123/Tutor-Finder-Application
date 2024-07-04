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


/* GET teachers listing. */
router.get("/:id", verifyToken, async function (req, res, next) {
  try {
    var sql = `SELECT teachers.* FROM teachers WHERE teachers.id = ?`;
    await db.query(sql, [req.params.id], function (err, result) {
      (async () => {
        try{
          sql = `SELECT courses.id,courses.name
          FROM courses 
          INNER JOIN teachers ON courses.teacher_id=teachers.id
          WHERE
          teachers.id = ?
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
