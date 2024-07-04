const express = require('express');
const verifyToken = require('../verifyToken');
const router = express.Router();
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const mysql = require("mysql");
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
router.get("/edit/", verifyToken, async function (req, res, next) {
  try {
    var sql = `SELECT teachers.* FROM teachers WHERE teachers.id = ?`;
    await db.query(sql, [req.user_id], function (err, result) {
      res.status(201).json({ result: result });
    });
  } catch (er) {
    console.log(err);
  }
});

/* GET teachers listing. */
router.get("/", verifyToken, async function (req, res, next) {
  try {
    var sql = `SELECT teachers.* FROM teachers WHERE teachers.id = ?`;
    await db.query(sql, [req.user_id], function (err, result) {
      (async () => {
        try{
          sql = `SELECT courses.id,courses.name
          FROM courses 
          INNER JOIN teachers ON courses.teacher_id=teachers.id
          WHERE
          teachers.id = ?
          `;
             await db.query(sql, [req.user_id], function (err, courses) {
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

 

router.put("/update",verifyToken, async (req, res, next) => {
  let id = req.body.id,
    name = req.body.name,
    email = req.body.email,
    firstname = req.body.firstname,
    lastname = req.body.lastname,
    age = req.body.age,
    housenumber = req.body.housenumber,
    streetnumber = req.body.streetnumber,
    city = req.body.city,
    state = req.body.state,
    postalcode = req.body.postalcode,
    country = req.body.country,
    contact = req.body.contact,
    gender = req.body.gender,
    avatar = req.body.avatar,
    latitude = req.body.latitude,
    longitude = req.body.longitude,
    oldEmail = req.body.oldEmail,
    updated_at = "24";
  email = email.toLowerCase();
  let photo;
  try {
    var sql = "SELECT * FROM teachers WHERE email = ? ";
    await db.query(sql, [email], function (err, result) {
      if (result.length > 0 && result[0].email != oldEmail) {
        return res.status(201).json({ error: "Email is already registered" });
      } else {
        if (req.files === null) {
          photo = avatar;
        } else {
          if (req.body.avatar != 'profile.png') {
            fs.unlinkSync(
              `${__dirname}/../../../frontend/public/uploads/${req.body.avatar}`
            );
          }
          const avatar = req.files.file;
          photo = avatar.name.split(".");
          photo = photo[0] + "." + Date.now() + "." + photo[photo.length - 1];
          (async () => {
            avatar.mv(
              `${__dirname}/../../../frontend/public/uploads/${photo}`,
              (err) => {
                if (err) {
                  console.error(err);
                }
              }
            );
          })();
        }
        sql = `UPDATE teachers SET name = ? , email = ? , firstname = ? , lastname = ? , gender = ? , age = ? , contact = ? , avatar = ? , housenumber = ? , streetnumber = ? , city = ? , state = ? , postalcode = ? , country = ? , latitude = ? , longitude = ? , updated_at = ? WHERE id = ? ;`;
        db.query(
          sql,
          [
            name,
            email,
            firstname,
            lastname,
            gender,
            age,
            contact,
            photo,
            housenumber,
            streetnumber,
            city,
            state,
            postalcode,
            country,
            latitude,
            longitude,
            updated_at,
            id,
          ],
          function (err, result) {
            if (err) {
              res.status(201).json({ error: "Error while updating data" });
            } else {
            res.status(201).json({ avatar:photo ,name:name ,success: "Profile Updated" });
          }
          }
        );
      }
    });
  } catch (err) {
    console.log(err);
  }
});



// router.delete("/:id", verifyToken, async function (req, res, next) {
//   try {
//     var sql = `SELECT teachers.avatar FROM teachers WHERE teachers.id = ?`;
//     await db.query(sql, [req.params.id], function (err, result) {
//       if (result[0].avatar != 'profile.png') {
//         fs.unlinkSync(
//           `${__dirname}/../../../frontend/public/uploads/${result[0].avatar}`
//         );
//       }
//       (async () => {
//         try {
//           var sql = `DELETE FROM teachers WHERE id = ?`;
//           await db.query(sql, [req.params.id], function (err, result) {
//             res.status(201).json({ result: result });
//           });
//         } catch (err) {
//           console.log(err);
//         }
//       })();
//     });
//   } catch (er) {
//     console.log(err);
//   }
// });

// Login
router.post('/login', (req, res) => {
console.log(req.body)
    let email = req.body.email;
    let password  = req.body.password;
   var sql = 'SELECT * FROM teachers WHERE email = ? ';
        db.query(sql, [email], function (err, user) {
        	console.log(user)
		user = user[0];
		if (user) {
			var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
			if (!passwordIsValid) {
				res.status(201).json({'error':'invalid credentials'});
			}
			else{
				var token = jwt.sign({ id: user.id,role:'teacher' }, 'Mani');
				res.status(201).json({'user_id':user.id,'user_role':'teacher','token':token,name:user.name,avatar:user.avatar});
			}
		}else{
			res.status(201).json({'error':'invalid credentials'});
		}
    
	});

});


router.post("/signup", async (req, res, next) => {
		console.log(req.body)
  let name = req.body.name,
    email = req.body.email,
    password = req.body.password,
    firstname = req.body.firstname,
    lastname = req.body.lastname,
    age = req.body.age,
    housenumber = req.body.housenumber,
    streetnumber = req.body.streetnumber,
    city = req.body.city,
    state = req.body.state,
    postalcode = req.body.postalcode,
    country = req.body.country,
    contact = req.body.contact,
    gender = req.body.gender,
    latitude = req.body.latitude,
    longitude = req.body.longitude,
    created_at = "date",
    updated_at = "date";
  email = email.toLowerCase();
  let photo;

  try {
    var sql = "SELECT * FROM teachers WHERE email = ? ";
    await db.query(sql, [email], function (err, result) {
      if (result.length > 0) {
        return res.status(201).json({ error: "Email is already registered" });
      } else {
        if (req.files === null) {
          photo = "profile.png";
        } else {
          const avatar = req.files.avatar;
          photo = avatar.name.split(".");
          photo = photo[0] + "." + Date.now() + "." + photo[photo.length - 1];
          (async () => {
            avatar.mv(
              `${__dirname}/../../../frontend/public/uploads/${photo}`,
              (err) => {
                if (err) {
                  console.error(err);
                }
              }
            );
          })();
        }
        //Hash Password
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(password, salt, async (err, hash) => {
            var sql =
              "INSERT INTO `teachers` (name, email,password,firstname,lastname,gender,age,contact,avatar,housenumber,streetnumber,city,state,postalcode,country,latitude,longitude,created_at,updated_at) VALUES (?)";
            var values = [
              name,
              email,
              hash,
              firstname,
              lastname,
              gender,
              age,
              contact,
              photo,
              housenumber,
              streetnumber,
              city,
              state,
              postalcode,
              country,
              latitude,
              longitude,
              created_at,
              updated_at,
            ];
            await db.query(sql, [values], function (err, result) {
              if (err) {
                res.status(201).json({ error: "Error while inseting data" });
              } else {
                 var token = jwt.sign({ id: result.insertId,role:'teacher' }, 'Mani');
				         res.status(201).json({'user_id':result.insertId, 'user_role':'teacher',name:name,'token':token,avatar:photo});             
              }
            });
          })
        );
      }
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;