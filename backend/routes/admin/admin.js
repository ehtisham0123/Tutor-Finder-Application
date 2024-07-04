const express = require('express');
const verifyToken = require('../verifyToken');
const router = express.Router();
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const mysql = require("mysql");

let db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "project",
});

// connect to database
db.connect();


// Login
router.post('/login', (req, res) => {
    let email = req.body.email;
    let password  = req.body.password;
   var sql = 'SELECT * FROM admin WHERE email = ? ';
        db.query(sql, [email], function (err, user) {
		user = user[0];
		if (user) {
			var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
			if (!passwordIsValid) {
				res.status(201).json({'error':'invalid credentials'});
			}
			else{
				var token = jwt.sign({ id: user.id,email:user.email,role:'admin' }, 'Mani');
				res.status(201).json({'user_id':user.id, 'user_name':user.name,'user_role':'admin','token':token});
			}
		}else{
			res.status(201).json({'error':'invalid credentials'});
		}
    
	});

});

router.get('/', async (req, res) => {
   var sql = `select 
    (select count(*) from students) as students,
  	(select count(*) from teachers) as teachers,
  	(select count(*) from courses) as courses`;  
      await db.query(sql, function (err, result) {
      if (err) throw err;
      res.status(201).json({ result: result });
    });
});


module.exports = router;



// SELECT  (
//         SELECT COUNT(*)
//         FROM   tab1
//         ) AS count1,
//         (
//         SELECT COUNT(*)
//         FROM   tab2
//         ) AS count2
// FROM    dual



