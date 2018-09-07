var express = require('express');
var cors = require('cors');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var app = express();


app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

app.use(cors());

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "X-ACCESS_TOKEN, Access-Control-Allow-Origin, Authorization, Origin, x-requested-with, Content-Type, Content-Range, Content-Disposition, Content-Description");
  next();
});

app.post('/mail-confirmation',
  function (req, res, next) {
    var transporter = nodemailer.createTransport(smtpTransport({
      service: 'gmail',
      auth: {
        user: 'noreply.concours2018@gmail.com',
        pass: 'concours2018@DA'
      },
      tls: { rejectUnauthorized: false }
    }));
    
    var mailOptions = {
      from: 'noreply.concours2018@gmail.com',
      to: req.query.email,
      subject: "Concoours'18 Registration Confirmation" ,
      text: req.query.text
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
      res.json({
        send : true
      });
    });
  });


app.listen(process.env.PORT || 3000)
