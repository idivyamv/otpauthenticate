const express = require('express');
const Visitor = require("./src/visitor");
const cors = require("cors");
const bodyParser = require('body-parser');
"use strict";
const nodemailer = require("nodemailer");
const app = express();
const path = require('path');
app.use(express.static(`./dist/frontend`));
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

/* app.get('/', (req, res) => {
  res.send('')
}) */
app.post('/api/create', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
  var digits = "0123456789";
  let otp = "";
  for (let i = 0; i < 4; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  otp = parseInt(otp);
  var visitor = {
    email       : req.body.visitor.email,
    otp         :otp
    }
  let newvisitor = new Visitor(visitor);
  newvisitor.save()
      .then(function (visitor){         
        async function main() {    
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
          service: "gmail",   
          auth: {
            user: 'authenicateotp@gmail.com',
            pass: 'jipbyjgdgqqntuww'
          },
        });      
        // send mail with defined transport object
        let info = await transporter.sendMail({
          from: 'authenicateotp@gmail.com', // sender address
          to: visitor.email, // list of receivers
          subject: "OTP for authentication", // Subject line
          html: '<p>hi,<p><p> Your one time password for authentication is '+  otp +'</p><p>Verification Team</p>'
        });
        console.log("Message sent: %s", info.messageId);
          res.status(200).json({'visitorId': visitor._id});
        }main().catch(console.error);
      })
      .catch(err => {
          res.status(400).send('sending OTP failed');
      });    
})
app.post('/api/checkotp', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
  var otpcheck = {
    otp       : req.body.otpcheck.otp,
    visitorid         :req.body.otpcheck.visitorid,
    }
    Visitor.findOne ({"_id":otpcheck.visitorid,"otp":otpcheck.otp})
        .then(function (visitor) {
          if(visitor){
            return res.status(200).send({message:'OTP validated'});
          }
          else {     return res.status(400).send({message:'OTP validation failed'});     }
        })
      .catch(err => {
        return res.status(400).send({message:'OTP validation failed'});          
      });
  }) 


app.get('/*', function(req, res) {

  res.sendFile(path.join(__dirname + '/dist/frontend/index.html'));
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server up in Port 5000 ");
});