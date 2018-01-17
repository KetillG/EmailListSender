Send Mail in node
===================

Sending mail from csv file. 

How To
-----------
#### Set up
- Download repo
- npm install
- Create auth.txt under ./ containing "Gmail address","Gmail 3rd party app Password". Note: do not add @gmail.com. An optional parameter is a 3rd email that is connected to your gmail to be the sender email (e.g. your hi mail, you must include a full email address here). See 3rd party password here: https://www.google.com/settings/security/lesssecureapps

#### Other things needed
Set up the csv like the Example.csv is set up and splitting on ';' First column is the name and second is the email.

#### Sending mail
- node app.js --list=Example.csv

#### Output
- Message notifying you of the app state
- Message for the status each sent email
