const statusRoomCtrl = {};

const StatusRoom = require("../models/statusRoomModel");
const StatusRoomHistory = require("../models/statusRoomHistoryModel");

// Renderizar formulario de nueva estado de la habitación
statusRoomCtrl.renderRegisterStatusRoom = async (req, res) => {
  try {
    res.render("hotel/status-room/new-status-room");
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al cargar la vista, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Registrar nuevo estado de la habitación
statusRoomCtrl.registerStatusRoom = async (req, res) => {
  try {
    const {
      nombreEstadoHabitacion,
      descripcionEstadoHabitacion,
      trabajosEnHabitacion
    } = req.body;

    const isExistName = await StatusRoom.findOne({nombreEstadoHabitacion, eliminadoEstadoHabitacion: false});
    if (isExistName){
      req.flash("wrong", "El estado de la habitación ya existe");
      return res.redirect("/status-room");
    } else {
      const statusRoomRegistrado = {
        usuarioRegistroEstadoHabitacion: req.user._id,
        nombreEstadoHabitacion,
        descripcionEstadoHabitacion,
        trabajosEnHabitacion
      };

      const newStatusRoom = new StatusRoom(statusRoomRegistrado);

      console.log("Registrando nuevo estado de la habitación: ", newStatusRoom);
      console.log("Nuevo estado de la habitación: ", newStatusRoom);
      await newStatusRoom.save(); //Guardar en la bd

      const statusRoomId = newStatusRoom._id;

      const newStatusRoomHistory = new StatusRoomHistory({
        tipoHistorial: "Registro",
        estadoHabitacionHistorial: statusRoomId
      });
      console.log("Guardando nuevo historial: ", newStatusRoomHistory)
      await newStatusRoomHistory.save(); //Guardar en el historial

      req.flash("success", "Estado de la habitación registrado exitosamente");
      res.redirect("/status-room");
    }
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al registrar el estado de la habitación, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Mostrar todos los estados de habitación
statusRoomCtrl.renderStatusRoom = async (req, res) => {
  try {
    const statusRooms = await StatusRoom.find({eliminadoEstadoHabitacion: false})
      .populate("usuarioRegistroEstadoHabitacion")
      .sort({createdAt: -1})
      .lean();
    const userRole = req.user.trabajadorUsuario.rolTrabajador.nombreRol;
    const currentPage = `status-room`;
    res.render("hotel/status-room/all-status-room", {
      statusRooms,
      currentPage,
      userRole
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al cargar la vista, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Renderizar formulario de edición de estado de la habitación
statusRoomCtrl.renderEditStatusRoom = async (req, res) => {
  try {
    const {id} = req.params;
    const statusRoom = await StatusRoom.findById(id).lean();
    res.render("hotel/status-room/edit-status-room", {statusRoom});
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al cargar el formulario de edición, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Actualizar estado de la habitación
statusRoomCtrl.updateStatusRoom = async (req, res) => {
  try {
    const {id} = req.params;
    await StatusRoom.findByIdAndUpdate(id, req.body);
    req.flash("success", "Estado de la habitación actualizado exitosamente");
    res.redirect("/status-room");
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al actualizar el estado de la habitación, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Renderizar confirmación de eliminación de estado de la habitación
statusRoomCtrl.renderDeleteStatusRoom = async (req, res) => {
  try {
    const {id} = req.params;
    const statusRoom = await StatusRoom.findById(id)
      .populate("usuarioRegistroEstadoHabitacion")
      .lean();
    res.render("hotel/status-room/delete-status-room", {statusRoom});
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al cargar ela confirmación de eliminación, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Eliminar estado de la habitación
statusRoomCtrl.deleteStatusRoom = async (req, res) => {
  try {
    const {id} = req.params;
    const deletedStatusRoom = await StatusRoom.findById(id);

    if (!deletedStatusRoom) {
      req.flash("wrong", "El estado de la habitación no existe");
      return res.redirect("/status-room");
    }

    await StatusRoom.findByIdAndUpdate(id, {eliminadoEstadoHabitacion: true});

    // Añadir al historial de estados de habitación
    const newStatusRoomHistory = new StatusRoomHistory({
      tipoHistorial: "Eliminado",
      estadoHabitacionHistorial: deletedStatusRoom._id
    });
    console.log("Guardando nuevo historial: ", newStatusRoomHistory);
    await newStatusRoomHistory.save(); //Guardar en el historial

    req.flash("success", "Estado de la habitación eliminado exitosamente");
    res.redirect("/status-room");
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al eliminar el estado de la habitación, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};


module.exports = statusRoomCtrl;