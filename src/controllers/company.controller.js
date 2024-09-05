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

    const {
      filename
    } = req.file;

    const imagenCompany = filename;

    console.log("req.body: ", req.body);
    console.log("req.file: ", req.file);

    // Validar si hay otra empresa registrada
    const existingCompany = await Company.findOne().lean();

    if (!existingCompany) {
      // Validar campos obligatorios
      if (!rucCompany) {
        req.flash("wrong", "El campo RUC no ha sido llenado, intente nuevamente.");
        console.log("El campo RUC no ha sido llenado, intente nuevamente.");
        return res.redirect("/company/register");
      }
      if (!nombreCompany) {
        req.flash("wrong", "El campo Nombre no ha sido llenado, intente nuevamente.");
        console.log("El campo Nombre no ha sido llenado, intente nuevamente.");
        return res.redirect("/company/register");
      }
      if (!celularCompany) {
        req.flash("wrong", "El campo Celular no ha sido llenado, intente nuevamente.");
        console.log("El campo Celular no ha sido llenado, intente nuevamente.");
        return res.redirect("/company/register");
      }
      if (!correoCompany) {
        req.flash("wrong", "El campo Correo no ha sido llenado, intente nuevamente.");
        console.log("El campo Correo no ha sido llenado, intente nuevamente.");
        return res.redirect("/company/register");
      }
      if (!direccionCompany) {
        req.flash("wrong", "El campo Dirección no ha sido llenado, intente nuevamente.");
        console.log("El campo Dirección no ha sido llenado, intente nuevamente.");
        return res.redirect("/company/register");
      }
      if (!req.file) {
        req.flash("wrong", "El campo Imagen no ha sido llenado, intente nuevamente. Por favor, sube una imagen.");
        console.log("El campo Imagen no ha sido llenado, intente nuevamente.");
        return res.redirect("/company/register");
      }

      const newCompany = new Company({
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