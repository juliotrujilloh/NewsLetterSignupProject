const express = require('express');
const bodyParser = require('body-parser');
const mailchimp = require('@mailchimp/mailchimp_marketing');
const request = require('request');

const app = express();

app.use(express.static('public'));                //provides the access to use 'static' files
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/signup.html');
})

mailchimp.setConfig({
  apiKey:"123456789101112-us14",  //You have to create your own API key on Mailchimp
  server:"us14",
})

app.post('/', function(req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  const listId = "8e67e46b80";

  async function run() {
    try{
    const response = await mailchimp.lists.addListMember(listId, {
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    });
   res.sendFile(__dirname + "/success.html");
 } catch(err)  {      //we are catching if an error occurs
   res.sendFile(__dirname + "/failure.html");
  }
}
 run();
})

app.post('/failure.html', function (req, res) {
  res.sendFile(__dirname + '/signup.html')
})

app.post('/success.html', function (req, res) {
  res.sendFile(__dirname + '/signup.html')
})

app.listen(process.env.PORT || 3000, function() { //with process.env.port we are letting HEROKU to deploy it at any port available
  console.log("Server is running on Port 3000"); //with || 3000 we are keeping the option to do it locally.
})
