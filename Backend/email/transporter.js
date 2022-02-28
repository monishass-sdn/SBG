const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, 

  auth: {
    type:'OAUTH2',
    user: process.env.CLEINT_EMAIL_ADRESS,
    serviceClient:process.env.EMAIL_CLIENT_ID,
    privateKey:process.env.EMAIL_PRIVATE_KEY
  },
  });


  module.exports = transporter;