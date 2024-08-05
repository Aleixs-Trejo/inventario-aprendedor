const stockLocationCtrl = {};
const StockLocation = require("../models/stockLocationModel");

//Registrar ubicación del stock
stockLocationCtrl.renderRegisterStockLocation = (req, res) => {
  try {
    res.render("stockLocations/new-stockLocation")
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

stockLocationCtrl.registerStockLocation = async (req, res) => {
  try {
    const {
      nombreStockUbicacion,
      descripcionStockUbicacion
    } = req.body;

    const nombreStock = await StockLocation.findOne({nombreStockUbicacion});

    if (nombreStock){
      req.flash("wrong", "Esta ubicación ya está registrada");
    } else{
      const newStockLocation = new StockLocation(
        {
          nombreStockUbicacion,
          descripcionStockUbicacion
        }
      );

      await newStockLocation.save(); //Guardar en la BD
      req.flash("success", "Ubicación registrada exitosamente");
      res.redirect("/stock-locations");
    }


  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

//Mostrar todas las ubicaciones
stockLocationCtrl.renderStockLocations = async (req, res) => {
  try {
    const stockLocations = await StockLocation.find().lean();
    const userRole = req.user.trabajadorUsuario.rolTrabajador.nombreRol;
    res.render("stockLocations/all-stockLocations", {
      stockLocations,
      userRole
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

//Editar una ubicación
stockLocationCtrl.renderEditStockLocation = async (req, res) => {
  try {
    const stockLocation = await StockLocation.findById(req.params.id).lean();
    res.render("stockLocations/edit-stockLocation", {stockLocation});
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

stockLocationCtrl.updateStockLocation = async (req, res) => {
  try {
    const {id} = req.params;
    await StockLocation.findByIdAndUpdate(id, req.body);
    req.flash("success", "Ubicacion actualizada exitosamente");
    res.redirect("/stock-locations");
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

//Eliminar una ubicación
stockLocationCtrl.renderDeleteStockLocation  = async (req, res) => {
  try {
    const {id} = req.params;
    const stockLocation = await StockLocation.findById(id).lean();
    res.render("stockLocations/delete-stockLocation", {stockLocation});
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}
stockLocationCtrl.deleteStockLocation  = async (req, res) => {
  try {
    const {id} = req.params;
    await StockLocation.findByIdAndDelete(id);
    req.flash("success", "Ubicación eliminada exitosamente");
    res.redirect("/stock-locations");
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

module.exports = stockLocationCtrl;