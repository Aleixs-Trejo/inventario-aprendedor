const recordCtrl = {};
const Record = require("../models/recordModel");

//Registrar el tipo de registro
recordCtrl.renderRegisterRecord = (req, res) => {
  try {
    res.render("records/new-record");
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

recordCtrl.registerRecord = async (req, res) => {
  try {
    const {
      nombreRegistro,
      descripcionRegistro
    } = req.body;

    const nombreRecord = await Record.findOne({nombreRegistro});

    if (nombreRecord){
      req.flash("wrong", "El tipo de registro ya existe");
    } else {
      const newRecord = new Record(
        {
          nombreRegistro,
          descripcionRegistro
        }
      );

      await newRecord.save(); //Guardar en la BD
      req.flash("success", "Tipo de Registro creado exitosamente");
      res.redirect("/records");
    }
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

//Mostrar todos los registros
recordCtrl.renderRecords = async (req, res) => {
  try {
    const records = await Record.find().lean();
    const userRole = req.user.trabajadorUsuario.rolTrabajador.nombreRol;
    res.render("records/all-records", {
      records,
      userRole
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

//Editar registros
recordCtrl.renderEditRecord = async (req, res) => {
  try {
    const {id} = req.params;
    const record = await Record.findById(id).lean();
    console.log("Editando registro: ", record)
    res.render("records/edit-record", {record});
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

recordCtrl.updateRecord = async (req, res) => {
  try {
    const {id} = req.params;
    await Record.findByIdAndUpdate(id, req.body);
    req.flash("success", "Registro actualizado exitosamente");
    res.redirect("/records");
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

//Eliminar registros
recordCtrl.renderDeleteRecord = async (req, res) => {
  try {
    const {id} = req.params;
    const record = await Record.findById(id).lean();
    res.render("records/delete-record", {record});
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}
recordCtrl.deleteRecord = async (req, res) => {
  try {
    const {id} = req.params;
    await Record.findByIdAndDelete(id);
    req.flash("success", "Registro eliminado exitosamente");
    res.redirect("/records");
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

module.exports = recordCtrl;