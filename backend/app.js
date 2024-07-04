var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const mysql = require("mysql");

var adminRouter = require('./routes/admin/admin');
var studentsAdminRouter = require('./routes/admin/students');
var teachersAdminRouter = require('./routes/admin/teachers');
var coursesAdminRouter = require('./routes/admin/courses');


var teacherRouter = require('./routes/teacher/teacher');
var coursesTeacherRouter = require('./routes/teacher/courses');
var studentTeacherRouter = require('./routes/teacher/student');
var chatTeacherRouter = require('./routes/teacher/chat');

var studentRouter = require('./routes/student/student');
var coursesStudentRouter = require('./routes/student/courses');
var teacherStudentRouter = require('./routes/student/teacher');
var chatStudentRouter = require('./routes/student/chat');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/admin', adminRouter);
app.use('/admin/students', studentsAdminRouter);
app.use('/admin/teachers', teachersAdminRouter);
app.use('/admin/courses', coursesAdminRouter);

app.use('/teacher', teacherRouter);
app.use('/teacher/courses', coursesTeacherRouter);
app.use('/teacher/students/profile/', studentTeacherRouter);
app.use('/teacher/chat/', chatTeacherRouter);


app.use('/student', studentRouter);
app.use('/student/courses', coursesStudentRouter);
app.use('/student/teachers/profile/', teacherStudentRouter);
app.use('/student/chat/', chatStudentRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
