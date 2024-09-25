const nodemailer = require("nodemailer");
require("dotenv").config();
const Company = require("../models/companyModel");

// Configuración del transporte usando el correo de Company.correoCompany

const createTransporter = async () => {
  try {
    const company = await Company.findOne({eliminadoCompany: false}).lean();
    if (!company) {
      throw new Error("No hay empresa registrada.");
    }
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: company.correoCompany,
        pass: process.env.GMAIL_PASS
      }
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al enviar el PDF a correo, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

module.exports = { createTransporter };