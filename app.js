// jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
require("dotenv").config();


const appl = express();


appl.use(express.static(__dirname));
appl.use(bodyParser.urlencoded({
  extended: true
}));

appl.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

appl.post("/", function(req, res) {

  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  var data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName,
      }
    }]
  };

  const jsonData = JSON.stringify(data);

  const MAPI_KEY = process.env.API_KEY ;
  const MLIST_ID = process.env.LIST_ID ;
  const MAPI_SERVER = process.env.API_SERVER;

  const url =
  "https://"+MAPI_SERVER+".api.mailchimp.com/3.0/lists/"+ MLIST_ID;

  const options = {
    method: "POST",
    auth: "marcus1:" + MAPI_KEY
  };
  const request = https.request(url, options, function(response) {
    response.on("data", function(data) {
    if (response.statusCode === 200){
      res.sendFile(__dirname + "/success.html");
    } else {
        res.sendFile(__dirname + "/failure.html");
    }
      console.log(JSON.parse(data));

    });

  });

  appl.post("/failure", function(req,res){
    res.redirect("/");
  });

  request.write(jsonData);
  request.end();

});

appl.listen(process.env.PORT ||3000, function() {

  console.log("server is running on port 3000");
});

//API Key
// 517d72f66a00e3141ca50556b6db61b9-us21
// pubblic id
// 3fda2129de
