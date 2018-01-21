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
  emailtext += 'Góðan daginn,' + enter() + enter();

  emailtext += 'Stella Rut heiti ég og hef samband við þig fyrir hönd Nörd, nemendafélags tölvunarfræði- og hugbúnaðarverfrkæðinema við Háskóla Íslands.' + enter() + enter();

  emailtext += 'Útskriftarhópur tölvunarfræði- og hugbúnaðarverkfræði stendur fyrir útgáfu tímaritsins Kóðinn sem gefinn er út til styrktar útskriftar- og námsferð verkfræðinema. Um er að ræða árlegt tímarit sem inniheldur umfjallanir um kennara, starfsemi deildarinnar, útskrifaða nemendur og afrek og verkefni núverandi nema við Iðnaðarverkfræði-, vélaverkfræði- og tölvunarfræðideild Háskóla Íslands. Kóðanum er dreift í allar 25 byggingar Háskóla Íslands og verður 15.000 nemendum og starfsmönnum aðgengilegt ásamt dreifingu á greinum á veraldarvefnum allan ársins hring. Ásamt því verður blaðið sent út til nýlegra útskrifaðra tölvunarfræði- og hugbúnaðarverkfræðinema.' + enter() + enter();

  emailtext += 'Eftirfarandi auglýsingar eru í boði:' + enter();
  emailtext += '- Baksíða kr. 180.000,-' + enter();
  emailtext += '- Heilsíða kr. 125.000,-' + enter();
  emailtext += '- 1/2 síða kr. 75.000,-' + enter();
  emailtext += '- 1/4 síða kr. 40.000,-' + enter();
  emailtext += '- Logo kr. 15.000,-' + enter() + enter();

  emailtext += 'Mér þætti vænt um ef þið sæjuð ykkur fært að styrkja nemendurna með auglýsingu í blaðinu, en útgáfa Kóðans er einn stærsti fjáröflunarþáttur ferðarinnar.' + enter() + enter();


  emailtext += 'Með von um samstarf,' + enter();
  emailtext += 'Stella Rut' + enter();
  emailtext += 'Gjaldkeri Nörd' + enter();
  emailtext += 'F.h. útskriftarnefndar' + enter();

  // Sends the email 
  
  const randomDelay = Math.floor(Math.random() * 800) + 100;
  setTimeout(() => {
    if(Mail) sendMailTo(emailtext, Name, Mail, 0);
  }, randomDelay);
};

// Simple way to add enter to a text string
let enter = () => " "+ "\r\n";

let globalMailCounter = 0;

// Sends the mail
let sendMailTo = (emailtext, Name, Mail, errorCount) => {
  // Options
  var mailOptions = {
    from: authData[2] ? authData[2] : authData[0] + '@gmail.com',
    to: Mail,
    subject: 'Kóðinn 2018 - auglýsing',
    text: emailtext,
  };
  // Send the mail
  transporter.sendMail(mailOptions, function(error, info){
    // If error occurs then retry
    if (error) {
      console.log("error on: " + Mail);
      console.log(error);
      console.log("Retrying...");
      if(errorCount > 7) {
        console.log(`Failed to send mail to ${Mail} 7 times, skipping`);
        return;
      } else {
        setTimeout(() => {
          sendMailTo(emailtext, Name, Mail, errorCount + 1);
        }, 2000);
      }
    } else {
      const outString = globalMailCounter + '\t Email sent to: ' + Mail + ' ' + info.response;
      console.log(outString);
      globalMailCounter++;
      fs.appendFile('out.txt',outString + '\n',() => {

      })

    }
  });
}
