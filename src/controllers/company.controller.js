const companyCtrl = {};

const Company = require("../models/companyModel");

// Renderizar vista para registrar empresa
companyCtrl.renderRegisterCompany = async (req, res) => {
  try {
    const existingCompany = await Company.findOne().lean();

    if (!existingCompany) {
      return res.render("company/new-company");
    }
    res.redirect("/")
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al renderizar la página de registro de empresa, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Registrar empresa
companyCtrl.registerCompany = async (req, res) => {
  try {
    const {
      rucCompany,
      nombreCompany,
      celularCompany,
      correoCompany,
      direccionCompany
    } = req.body;

    // Validar si hay otra empresa registrada
    const existingCompany = await Company.findOne().lean();

    if (!existingCompany) {
      // Validar campos obligatorios
      if (!rucCompany || !nombreCompany || !celularCompany || !correoCompany || !direccionCompany) {
        req.flash("wrong", "Los campos obligatorios no han sido llenados, intente nuevamente.");
        return res.redirect("/company/register");
      }

      const newCompany = new Company({
        rucCompany,
        nombreCompany,
        celularCompany,
        correoCompany,
        direccionCompany
      });

      await newCompany.save();
      req.flash("success", "Empresa registrada exitosamente.");
      return res.redirect("/user-role/register");
    } else {
      req.flash("wrong", "Ya tienes una empresa registrada.");
      return res.redirect("/");
    }
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al registrar la empresa, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

module.exports = companyCtrl;