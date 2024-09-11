const nodemailer = require("nodemailer");
require("dotenv").config();

// Configuración del transporte usando el correo de Company.correoCompany
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD
  }
});

module.exports = transporter;