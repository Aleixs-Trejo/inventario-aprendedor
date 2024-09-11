const companyCtrl = {};

const Company = require("../models/companyModel");

// Renderizar vista para registrar empresa
companyCtrl.renderRegisterCompany = async (req, res) => {
  try {
    const existingCompanies = await Company.find({eliminadoCompany: false}).lean();

    if (existingCompanies && existingCompanies.length >= process.env.MAX_COMPANIES) {
      req.flash("wrong", "Ya tienes más de " + process.env.MAX_COMPANIES + " empresas registradas.");
      console.log(`Máximo número de Compañías alcanzado, el máximo permitido es de ${process.env.MAX_COMPANIES} y tienes ${existingCompanies.length}`);
      return res.redirect("/");
    }
    return res.render("company/new-company");
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al renderizar la página de registro de empresa, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Métdo para validar los campos de registro
const validateCompanyFields = req => {
  const {
    comercioCompany,
    rucCompany,
    nombreCompany,
    celularCompany,
    correoCompany,
    direccionCompany
  } = req.body;

  if (!comercioCompany) return "El campo Comercio no ha sido llenado";
  if (!rucCompany) return "El campo RUC no ha sido llenado";
  if (!nombreCompany) return "El campo Nombre no ha sido llenado";
  if (!celularCompany) return "El campo Celular no ha sido llenado";
  if (!correoCompany) return "El campo Correo no ha sido llenado";
  if (!direccionCompany) return "El campo Dirección no ha sido llenado";
  if (!req.file) return "El campo Imagen no ha sido llenado";

  return null;
};

// Registrar empresa
companyCtrl.registerCompany = async (req, res) => {
  try {
    const {
      comercioCompany,
      rucCompany,
      nombreCompany,
      celularCompany,
      correoCompany,
      direccionCompany
    } = req.body;

    const validationError = validateCompanyFields(req);
    if (validationError) {
      req.flash("wrong", validationError + ", intente nuevamente.");
      console.log("Error al validar campos de registro: ", validationError);
      return res.redirect("/company/register");
    }

    const imagenCompany = req.file.filename;

    // Validar si hay otra empresa registrada
    const existingCompanies = await Company.find({eliminadoCompany: false}).lean();

    if (existingCompanies && existingCompanies.length >= process.env.MAX_COMPANIES) {
      req.flash("wrong", "Ya tienes más de " + process.env.MAX_COMPANIES + " empresas registradas.");
      console.log(`Máximo número de Compañías alcanzado, el máximo permitido es de ${process.env.MAX_COMPANIES} y tienes ${existingCompanies.length}`);
      return res.redirect("/");
    }

    const newCompany = new Company({
      comercioCompany,
      rucCompany,
      nombreCompany,
      celularCompany,
      correoCompany,
      direccionCompany,
      imagenCompany
    });

    await newCompany.save();
    req.flash("success", "Empresa registrada exitosamente.");
    console.log("Empresa registrada exitosamente.");
    return res.redirect("/users-rol/register");
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al registrar la empresa, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Mostrar detalles de la empresa
companyCtrl.renderDetailsCompany = async (req, res) => {
  try {
    const {id} = req.params;
    const company = await Company.findById(id).lean();

    if (!company) {
      req.flash("wrong", "No se ha encontrado la empresa con ese ID.");
      return res.redirect("/");
    }

    res.render("company/details-company", {
      company
    })
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al mostrar los detalles de la empresa, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Renderizar configuraciones para editar datos de la empresa
companyCtrl.renderEditCompany = async (req, res) => {
  try {
    const {id} = req.params;
    const company = await Company.findById(id).lean();

    if (!company) {
      req.flash("wrong", "No se ha encontrado la empresa con ese ID.");
      return res.redirect("/");
    }

    res.render("company/details-company", {
      company
    })
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al renderizar la página de configuración de la empresa, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Actualizar datos de la empresa
companyCtrl.updateCompany = async (req, res) => {
  try {
    const {id} = req.params;
    const {
      rucCompany,
      nombreCompany,
      celularCompany,
      correoCompany,
      direccionCompany,
      imagenCompany
    } = req.body;

    if (!rucCompany || !nombreCompany || !celularCompany || !correoCompany || !direccionCompany || !imagenCompany) {
      req.flash("wrong", "Los campos obligatorios no han sido llenados, intente nuevamente.");
      return res.redirect(`company/${id}/edit`);
    }

    await Company.findByIdAndUpdate(id, req.body);
    req.flash("success", "Datos de la empresa actualizados exitosamente.");
    return res.redirect("/");
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al actualizar la empresa, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

module.exports = companyCtrl;