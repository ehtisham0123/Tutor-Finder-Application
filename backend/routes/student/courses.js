let express = require("express");
let router = express.Router();
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const verifyToken = require("../verifyToken");

let db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "project",
});

router.get("/enrolled/:name?", verifyToken, async function (req, res, next) {
  try {
    if (req.params.name) {
      let sql = `
    SELECT courses.*
    FROM courses
    WHERE courses.name LIKE ? AND courses.id IN (SELECT enrollment.course_id 
    FROM enrollment WHERE student_id = ?)`;
      name = "%" + req.params.name + "%";
      await db.query(sql, [name, req.user_id], function (err, courses) {
        console.log(courses);
        res.status(201).json({ courses: courses });
      });
    } else {
      sql = `
    SELECT courses.*
    FROM courses
    WHERE courses.id IN
    (SELECT enrollment.course_id
    FROM enrollment
    WHERE
    student_id = ?);
    `;
      await db.query(sql, [req.user_id], function (err, courses) {
        res.status(201).json({ courses: courses });
      });
    }
  } catch (er) {
    console.log(err);
  }
});

// connect to database
db.connect();
/* GET courses listing. */
router.get("/:name?", verifyToken, async (req, res, next) => {
  if (req.params.name) {
    let sql = `SELECT courses.*,teachers.name as teacher_name
    FROM courses
    INNER JOIN teachers ON courses.teacher_id=teachers.id 
    WHERE courses.name LIKE ?`;
    name = "%" + req.params.name + "%";
    await db.query(sql, [name],(err, result) => {
      res.status(201).json({ result: result });
    });
  } else {
    let sql = `SELECT courses.*,teachers.name as teacher_name
    FROM courses
    INNER JOIN teachers ON courses.teacher_id=teachers.id
    WHERE 1
    `;
    await db.query(sql, (err, result) => {
      if (err) throw err;
      res.status(201).json({ result: result });
    });
  }
});

/* GET single course */
router.get("/show/:id", verifyToken, async (req, res, next) => {
  try {
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
    await db.query(sql, [req.params.id], (err, result) => {
      try {
        sql = `SELECT reviews.*,
        students.firstname as student_firstname,
        students.lastname as student_lastname,
        students.avatar as student_photo
        FROM reviews 
        INNER JOIN students ON reviews.student_id=students.id
        WHERE
        reviews.course_id = ?
      `;
        db.query(sql, [req.params.id],(err, reviews) => {
          try {
            sql = `SELECT enrollment.*
              FROM enrollment
              WHERE
              student_id = ? AND course_id = ?;
              `;
            db.query(
              sql,
              [req.user_id, req.params.id],
              function (err, enrollment) {
                if (enrollment.length > 0) {
                  res.status(201).json({
                    result: result,
                    reviews: reviews,
                    enrollment_id: enrollment[0].id,
                  });
                } else {
                  res.status(201).json({
                    result: result,
                    reviews: reviews,
                    enrollment_id: 0,
                  });
                }
              }
            );
          } catch (er) {
            console.log(err);
          }
        });
      } catch (er) {
        console.log(err);
      }
    });
  } catch (er) {
    console.log(err);
  }
});

router.delete("/enrollment/:id", verifyToken, async (req, res, next) => {
  let sql = `DELETE FROM enrollment WHERE course_id = ? AND student_id = ?`;
  await db.query(sql, [req.params.id, req.user_id], (err, result) => {
    if (err) throw err;
    res.status(201).json({ result: result });
  });
});


router.delete("/reviews/:id", verifyToken, async function (req, res, next) {
  let sql = `DELETE FROM reviews WHERE id = ? AND student_id`;
  await db.query(sql, [req.params.id, req.user_id], function (err, result) {
    if (err) throw err;
    res.status(201).json({ result: result });
  });
});


router.post("/enroll", verifyToken, async function (req, res, next) {
  const course_id = req.body.course_id;
  const teacher_id = req.body.teacher_id;
  const student_id = req.user_id;
  sql =
    "INSERT INTO `enrollment` (student_id, course_id,teacher_id) VALUES (?)";
  let values = [student_id, course_id, teacher_id];
  await db.query(sql, [values], function (err, result) {
    if (err) {
      console.log(err);
    } else {
      res.status(201).json({ enrollment_id: result.insertId });
    }
  });
});

router.post("/review", verifyToken, async function (req, res, next) {
  console.log(req.body)
  const student_id = req.user_id;
  const course_id = req.body.course_id;
  const teacher_id = req.body.teacher_id;
  const enorllment_id = req.body.enorllment_id;
  const reviews = req.body.reviews;
  const reviews_details = req.body.reviews_details;

  sql = "INSERT INTO `reviews` (student_id, course_id,teacher_id,enrollment_id,reviews,reviews_details) VALUES (?)";
  let values = [student_id, course_id, teacher_id,enorllment_id,reviews,reviews_details];
  await db.query(sql, [values], function (err, result) {
    if (err) {
      console.log(err)
      res.status(201).json({ error: "Error while inseting data" });
    } else {
      res.status(201).json({ success: "Review Added" });
    }
  });
});

/* GET students listing. */

module.exports = router;