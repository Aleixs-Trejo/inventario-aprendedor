const maintenanceRoomCtrl = {};

const MaintenanceRoom = require("../models/maintenanceRoomModel");
const MaintenanceRoomHistory = require("../models/maintenanceRoomHistoryModel");
const Room = require("../models/roomModel");
const User = require("../models/userModel");

// Renderizar vista de establecimiento de mantenimiento
maintenanceRoomCtrl.renderRegisterMaintenanceRoom = async (req, res) => {
  try {
    const {id} = req.params;
    const room = await Room.findById(id)
      .populate({
        path: "usuarioRegistroHabitacion",
        populate: "trabajadorUsuario"
      })
      .populate("pisoHabitacion")
      .populate("categoriaHabitacion")
      .lean();

      const users = await User.find({eliminadoUsuario: false})
        .populate({
          path: "trabajadorUsuario",
          populate: {
            path: "rolTrabajador"
          }
        })
        .lean();
    
    const userRole = req.user.trabajadorUsuario.rolTrabajador.nombreRol;
    console.log("room: ", room);
    res.render("hotel/maintenance-room/new-maintenance", {
      room,
      users,
      userRole
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Registrar mantenimiento de establecimiento
maintenanceRoomCtrl.registerMaintenanceRoom = async (req, res) => {
  try {
    const {
      habitacionMantenimiento,
      tipoMantenimiento,
      descripcionMantenimiento,
      usuarioMantenimiento
    } = req.body;

    console.log("req.body del mantenimiento: ", req.body);

    const isExistRoomInMaintenance = await MaintenanceRoom.findOne({
      habitacionMantenimiento,
      finalizadoMantenimiento: false
    });

    if (isExistRoomInMaintenance) {
      req.flash("wrong", "Esta habitación ya está en mantenimiento.");
      return res.redirect("/hotel");
    }

    const newMaintenanceRoom = new MaintenanceRoom({
      usuarioRegistroMantenimiento: req.user._id,
      habitacionMantenimiento,
      tipoMantenimiento,
      descripcionMantenimiento,
      usuarioMantenimiento,
      finalizadoMantenimiento: false
    });

    
    const room = await Room.findById(habitacionMantenimiento);

    room.estadoHabitacion = tipoMantenimiento;
    await room.save();
    await newMaintenanceRoom.save();
    
    // Guardar el registro de mantenimiento en el historial
    const newMaintenanceRoomHistory = new MaintenanceRoomHistory({
      tipoHistorial: "Registro",
      mantenimientoHabitacionHistorial: newMaintenanceRoom._id
    });

    console.log("Nuevo registro de mantenimiento en el historial de habitación: ", newMaintenanceRoomHistory);
    await newMaintenanceRoomHistory.save();

    req.flash("success", "Estado establecido correctamente.");
    res.redirect("/hotel");

  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Renderizar finalización de mantenimiento de la habitación
maintenanceRoomCtrl.renderDetailMaintenanceRoom = async (req, res) => {
  try {
    const {id} = req.params;
    const maintenanceRoom = await MaintenanceRoom.findById(id)
      .populate("usuarioRegistroMantenimiento")
      .populate({
        path: "habitacionMantenimiento",
        populate: "categoriaHabitacion"
      })
      .populate("usuarioMantenimiento")
      .lean();
    const userRole = req.user.trabajadorUsuario.rolTrabajador.nombreRol;
    console.log("maintenanceRoom: ", maintenanceRoom);
    res.render("hotel/maintenance-room/detail-maintenance", {
      maintenanceRoom,
      userRole
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente. " + error);
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

maintenanceRoomCtrl.finalizeMaintenanceRoom = async (req, res) => {
  try {
    const {id} = req.params;
    const maintenanceRoom = await MaintenanceRoom.findById(id)
      .populate("usuarioRegistroMantenimiento")
      .populate({
        path: "habitacionMantenimiento",
        populate: "categoriaHabitacion"
      })
      .populate("tipoMantenimiento")
      .populate("usuarioMantenimiento");

    console.log("maintenanceRoom: ", maintenanceRoom);

    if (!maintenanceRoom) {
      req.flash("wrong", "Esta habitación no existe.");
      return res.redirect("/hotel");
    }

    // Encontrar la habitación y actualizar el estado
    const room = await Room.findById(maintenanceRoom.habitacionMantenimiento);

    if (!room) {
      req.flash("wrong", "Esta habitación no existe.");
      return res.redirect("/hotel");
    }

    room.estadoHabitacion = "Disponible";
    await room.save();

    // Actualizar el finalizado a true
    maintenanceRoom.finalizadoMantenimiento = true;
    await maintenanceRoom.save();

    // Guardar el registro de mantenimiento en el historial
    const newMaintenanceRoomHistory = new MaintenanceRoomHistory({
      tipoHistorial: "Finalización",
      mantenimientoHabitacionHistorial: maintenanceRoom._id
    });
    
    console.log("Nuevo registro de mantenimiento en el historial de habitación: ", newMaintenanceRoomHistory);
    await newMaintenanceRoomHistory.save();

    req.flash("success", "Servicio finalizado correctamente.");
    res.redirect("/hotel");

  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente. " + error);
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

maintenanceRoomCtrl.renderMaintenances = async (req, res) => {
  try {
    // Obtener todos los mantenimientos cuya propiedad finalizadoMantenimiento es false
    const maintenances = await MaintenanceRoom.find({
      finalizadoMantenimiento: false
    })
      .populate("usuarioRegistroMantenimiento")
      .populate({
        path: "habitacionMantenimiento",
        populate: "categoriaHabitacion"
      })
      .populate("usuarioMantenimiento")
      .sort({createdAt: -1})
      .lean();

    console.log("maintenances: ", maintenances);

    const userRole = req.user.trabajadorUsuario.rolTrabajador.nombreRol;
    res.render("hotel/maintenance-room/all-maintenances", {
      maintenances,
      userRole
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente. " + error);
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

module.exports = maintenanceRoomCtrl;