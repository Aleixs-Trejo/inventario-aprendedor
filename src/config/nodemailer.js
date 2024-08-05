const nodemailer = require("nodemailer");
require("dotenv").config();

// Configuración del transporte
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

module.exports = transporter;