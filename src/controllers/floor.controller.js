const floorCtrl = {};

const Floor = require("../models/floorModel");
const FloorHistory = require("../models/floorHistoryModel");

// Renderizar formulario de nueva habitación
floorCtrl.renderRegisterFloor = async (req, res) =>{
  try {
    const userRole = req.user.trabajadorUsuario.rolTrabajador.nombreRol;
    res.render("hotel/floors/new-floor", {
      userRole
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al cargar el formulario de nuevo piso, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

floorCtrl.registerFloor = async (req, res) => {
  try {
    const {
      numeroPiso,
      descripcionPiso
    } = req.body;
    console.log("Req.body: ", req.body);

    const isExistsFloor = await Floor.findOne({numeroPiso});

    if (isExistsFloor) {
      req.flash("wrong", "Ya existe el piso, intente registrarlo de nuevo.");
      res.redirect("/floors");
    }

    const newFloor = new Floor({
      usuarioRegistroPiso: req.user._id,
      numeroPiso,
      descripcionPiso
    });
    console.log("Nuevo piso: ", newFloor);

    const floorId = newFloor._id;

    // Agregar al historial el producto registrado
    const newFloorHistory = new FloorHistory({
      tipoHistorial: "registro",
      pisoHabitacionHistorial: floorId,
    });

    console.log("Nuevo historial: ", newFloorHistory);
    await newFloor.save();
    await newFloorHistory.save();

    req.flash("success", "Piso registrado exitosamente");
    res.redirect("/floors");
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al registrar un piso, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Mostrar pisos
floorCtrl.renderFloors = async (req, res) => {
  try {
    // Cargar todos los datos de la BD
    const floors = await Floor.find({eliminadoPiso: false})
      .populate("usuarioRegistroPiso")
      .lean();

    const userRole = req.user.trabajadorUsuario.rolTrabajador.nombreRol;
    const currentPage = `floors`;
    res.render("hotel/floors/all-floors", {
      floors,
      currentPage,
      userRole
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al cargar los datos, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Mostrar formulario de edición de piso
floorCtrl.renderEditFloor = async (req, res) => {
  try {
    const {id} = req.params;
    const floor = await Floor.findById(id)
      .lean();
  
    if (!floor) {
      req.flash("wrong", "La piso no existe");
      return res.redirect("/floors");
    };

    const userRole = req.user.trabajadorUsuario.rolTrabajador.nombreRol;
    res.render("hotel/floors/edit-floor", {
      floor,
      userRole
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al cargar el formulario de edición, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Actualizar el piso
floorCtrl.updateFloor = async (req, res) => {
  try {
    const {id} = req.params;
    await Floor.findByIdAndUpdate(id, req.body);
    req.flash("success", "Piso actualizado exitosamente");
    res.redirect("/floors");
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al actualizar el piso, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Renderizar confirmación de eliminación de piso
floorCtrl.renderDeleteFloor = async (req, res) => {
  try {
    const {id} = req.params;
    const floor = await Floor.findById(id)
      .populate("usuarioRegistroPiso")
      .lean();
    
    const userRole = req.user.trabajadorUsuario.rolTrabajador.nombreRol;
    res.render("hotel/floors/delete-floor", {floor, userRole});
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al cargar la eliminación, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Eliminar el piso
floorCtrl.deleteFloor = async (req, res) => {
  try {
    const {id} = req.params;
    const deletedFloor = await Floor.findById(id)
      .lean();

    if (!deletedFloor) {
      req.flash("wrong", "La piso no existe");
      return res.redirect("/floors");
    };

    // Eliminar el piso
    await Floor.findByIdAndUpdate(id, {eliminadoPiso: true});

    const deletedFloorId = deletedFloor._id;

    // Agregar al historial el producto eliminado
    const newFloorHistory = new FloorHistory({
      tipoHistorial: "Eliminado",
      pisoHabitacionHistorial: deletedFloorId
    });
    console.log("New Floor History: ", newFloorHistory);
    await newFloorHistory.save();

    req.flash("success", "Piso eliminado exitosamente");
    res.redirect("/floors");
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al eliminar el piso, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

module.exports = floorCtrl;