var express = require('express');
var passport = require('passport');
var cors = require('cors');
var mongoose = require('mongoose');
const axios = require('axios');
const async = require('async');
var curl = require('curlrequest');
var User = require('./model/user');
var Project = require('./model/project');

var app = express();

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://KhushilMistry:sinchanisheretohelp123@ds231315.mlab.com:31315/interview_experience');


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());


app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'https://dawoc.herokuapp.com/');
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "X-ACCESS_TOKEN, Access-Control-Allow-Origin, Authorization, Origin, x-requested-with, Content-Type, Content-Range, Content-Disposition, Content-Description");
  next();
});


app.post('/github',
  function (req, res, next) {
    const data1 = req.query;
    console.log(req.query);
    const data = {
      code: data1[0],
      client_id: 'Iv1.2c25f6b5db9121be',
      client_secret: '101bc18ad084407c59030e2c5ea281926a7e44c3',
    }
    async.parallel([
      function (callback) {
        axios({
          method: 'post',
          url: 'https://github.com/login/oauth/access_token',
          params: data
        }).then(function (response) {
          callback(false, response);
        });
      }
    ], function (error, result) {
      res.json(result[0].data);
    });
  });

app.post('/user',
  function (req, res, next) {
    const data = req.query[0];
    const url = 'https://api.github.com/user?' + data;
    var options = {
      url: url
    };
    curl.request(options, function (err, resp) {
      if (err) {
        console.log(err);
      }
      var response = JSON.parse(resp);
      User.findOne({ 'id': response.id }, function (err, user) {
        if (err)
          res.json(err);
        if (user) {
          Project.find({}, function (err, projects) {
            res.json({ user: user, projects : projects });
          });
        } else {
          var newUser = new User();
          newUser.id = response.id;
          newUser.username = response.login;
          newUser.name = response.name;
          newUser.email = response.email;
          newUser.image = response.avatar_url;
          newUser.repos = response.repos_url;

          // save our user into the database
          newUser.save(function (err) {
            if (err)
              throw err;
          }).then(function () {
            Project.find({}, function (err, projects) {
              res.json({ user: newUser, projects : projects });
            });
          });
        }
      });
    });


  });

app.post('/admin', function (req, res, next) {
  if (req.query.email === 'dscdaiict' && req.query.password === 'muthuda11ct') {
    User.find({}, function (err, users) {
      console.log(users);
      Project.find({}, function (err, projects) {
        res.json({ admin: true, users: users, projects : projects });
      });
    });
  }
  else {
    res.json({ admin: false, users: '' });
  }

});

app.post('/project', function (req, res, next) {
  console.log('Hello');
  var newProject = new Project();
  newProject.name = req.query.name;
  newProject.desc = req.query.desc;
  newProject.mentor = req.query.mentor;
  newProject.language = req.query.language;
  newProject.link = req.query.link;

  // save our user into the database
  newProject.save(function (err) {
    if (err)
      throw err;
  }).then(function () {
    console.log('Here !');
    Project.find({}, function (err, projects) {
      res.json({ projects : projects });
    });
  });

});

app.listen(process.env.PORT || 3000)
