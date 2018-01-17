const fs = require('fs');
const nodemailer = require('nodemailer');
const _ = require('lodash');
const yargs = require('yargs');
const csv = require('csvtojson');

const argv = yargs.argv;
const csvFilePath=argv.list;

console.log('Server starting');

// Reads data from auth.txt
var authData = fs.readFileSync("./auth.txt", "utf-8").split(',');

// Sets up transponder to send email
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: authData[0],
    pass: authData[1],
  }
});

console.log(`Authentication loadad: ${authData}`);

// Reads data from a csv file split on ;
csv({
  delimiter: ";"
})
.fromFile(csvFilePath)
.on('json',(jsonObj)=>{
    createEmail(jsonObj);
})
.on('done',(error)=>{
    console.log('Finished reading file')
})

// Creates the text file for each user
let createEmail = (mailInfo) => {
  // The name and mail of the recipient
  let {Name, Mail} = mailInfo;

  // Email body
  let emailtext = "";
  emailtext += 'Daginn,' + enter() + enter(); // Tvö enter fyrir space
  emailtext += 'Við erum hérna frá Nörd að gera drasl' + enter();
  emailtext += `Hafið þið, ${Name}, áhuga á að auglýsa?` + enter() + enter();
  emailtext += 'Kveðja, Ketill og vinir';

  // Sends the email 
  sendMailTo(emailtext, Name, Mail);
};

// Simple way to add enter to a text string
let enter = () => " "+ "\r\n";

// Sends the mail
let sendMailTo = (emailtext, Name, Mail) => {
  // Options
  var mailOptions = {
    from: authData[2] ? authData[2] : authData[0] + '@gmail.com',
    to: Mail,
    subject: 'Styrkja mig????',
    text: emailtext,
  };
  // Send the mail
  transporter.sendMail(mailOptions, function(error, info){
    // If error occurs then retry
    if (error) {
      console.log("error on: " + Mail);
      console.log(error);
      console.log("Retrying...");
      sendMailTo(emailtext, Name, Mail) 
    } else {
      console.log('Email sent to: ' + Mail + ' ' + info.response);
    }
  });
}
