let express = require("express");
let router = express.Router();
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const verifyToken = require('../verifyToken');

let db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "project",
});

// connect to database
db.connect();
/* GET courses listing. */


router.get("/enrolledcourses/:name?",verifyToken,async (req, res, next) => {
  if (req.params.name) {
    let sql = `SELECT courses.id,courses.name,teachers.name as teacher_name
    FROM courses
    INNER JOIN teachers ON courses.teacher_id=teachers.id 
    WHERE courses.name LIKE ?`;
    name = "%" + req.params.name + "%";
    await db.query(sql, [name], function (err, result) {
      res.status(201).json({ result: result });
    });
  } 
  else {
    let sql = `SELECT courses.id,courses.name,teachers.name as teacher_name
    FROM courses
    INNER JOIN teachers ON courses.teacher_id=teachers.id
    WHERE 1
    `;
    await db.query(sql, function (err, result) {
      if (err) throw err;
      res.status(201).json({ result: result });
    });
  }
}); 

router.get("/:name?",verifyToken, async (req, res, next) => {
  if (req.params.name) {
    let sql = `SELECT courses.*,teachers.name as teacher_name
    FROM courses
    INNER JOIN teachers ON courses.teacher_id=teachers.id 
    WHERE courses.name LIKE ?`;
    name = "%" + req.params.name + "%";
    await db.query(sql, [name], function (err, result) {
      res.status(201).json({ result: result });
    });
  } 
  else {
    let sql = `SELECT courses.*,teachers.name as teacher_name
    FROM courses
    INNER JOIN teachers ON courses.teacher_id=teachers.id
    WHERE 1
    `;
    await db.query(sql, function (err, result) {
      if (err) throw err;
      res.status(201).json({ result: result });
    });
  }
});


/* GET single course */
router.get("/show/:id",verifyToken, async function (req, res, next) {
    try{
      let sql = `SELECT courses.*,
      teachers.id as teacher_id,
      teachers.firstname as teacher_firstname,
      teachers.lastname as teacher_lastname,
      teachers.country as teacher_country,
      teachers.city as teacher_city,
      teachers.avatar as teacher_photo
      FROM courses 
      INNER JOIN teachers ON courses.teacher_id=teachers.id
      WHERE
      courses.id = ?
      `;
      await db.query(sql, [req.params.id], function (err, result) {
      try{
      sql = `SELECT reviews.*,
      students.firstname as student_firstname,
      students.lastname as student_lastname,
      students.avatar as student_photo
      FROM reviews 
      INNER JOIN students ON reviews.student_id=students.id
      WHERE
      reviews.course_id = ?
      `;
          db.query(sql, [req.params.id], function (err, reviews) {

                try{
                sql = `SELECT students.id,students.name,students.avatar
                  FROM students
                  WHERE students.id IN
                  (SELECT enrollment.student_id
                  FROM enrollment
                  WHERE
                  course_id = ?)
              `;
                  db.query(sql, [req.params.id], function (err, enrollments) {           
                      res.status(201).json({ result: result , reviews : reviews ,enrollments:enrollments});
                  });
                }catch (er) {
                  console.log(err);
                }
          });
        }catch (er) {
          console.log(err);
        }
      }); 
    }catch (er) {
      console.log(err);
    }
});


/* GET single course */
router.get("/edit/:id",verifyToken, async function (req, res, next) {
    let sql = `SELECT courses.* FROM courses
    WHERE
    courses.id = ?
    `;
    await db.query(sql, [req.params.id], function (err, result) {
      res.status(201).json({ result: result });
    });
});


router.delete("/:id",verifyToken, async function (req, res, next) {
    let sql = `DELETE FROM courses WHERE id = ?`;
    await db.query(sql, [req.params.id], function (err, result) {
      if (err) throw err;
      res.status(201).json({ result: result });
    });
});


// router.delete("/enrollment/:id",verifyToken, async function (req, res, next) {
//     let sql = `DELETE FROM enrollment WHERE id = ?`;
//     await db.query(sql, [req.params.id], function (err, result) {
//       if (err) throw err;
//       res.status(201).json({ result: result });
//     });
// });

router.delete("/enrollment/course/:course_id/student/:student_id",verifyToken, async function (req, res, next) {
  let sql = `DELETE FROM enrollment WHERE course_id = ? AND student_id = ?`;
  await db.query(sql, [req.params.course_id, req.params.student_id], function (err, result) {
    if (err) throw err;
    res.status(201).json({ result: result });
  });
});



router.put("/update",verifyToken, async (req, res, next) => {
  let id = req.body.id;
  let name = req.body.name;
  let details = req.body.details;
  let teacher_id = req.body.teacher_id;
  console.log(req.body);
  sql =
    `
      UPDATE courses
      SET name = ?, 
      details = ?,
      teacher_id = ?
      WHERE id = ? 
      `;    
    await db.query(sql, [name,details,teacher_id,id], function (err, result) {
        if (err) throw err;      
        res.status(201).json({'success':'Course updated'});  
    })
  })

 
module.exports = router;