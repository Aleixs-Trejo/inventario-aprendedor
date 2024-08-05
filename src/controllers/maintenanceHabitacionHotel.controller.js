const maintenanceRoomHotelCtrl = {};

const MaintenanceRoomHotel = require("../models/maintenanceRoomHotelModel");
const MaintenanceRoomHotelHistory = require("../models/maintenanceRoomHotelHistoryModel");
const RoomHotel = require("../models/roomHotelModel");
const StatusRoom = require("../models/statusRoomModel");
const User = require("../models/userModel");

// Renderizar vista de establecimiento de mantenimiento
maintenanceRoomHotelCtrl.renderRegisterMaintenanceRoomHotel = async (req, res) => {
  try {
    const {id} = req.params;
    const roomHotel = await RoomHotel.findById(id)
      .populate("usuarioRegistroHabitacionHotel")
      .populate({
        path: "habitacionHotel",
        populate: {
          path: "categoriaHabitacion"
        }
      })
      .populate("estadoHabitacionHotel")
      .lean();

    if (!roomHotel) {
      req.flash("wrong", "Esta habitación no existe.");
      return res.redirect("/hotel");
    }
    
    const statusRooms = await StatusRoom.find({
      eliminadoEstadoHabitacion: false,
      trabajosEnHabitacion: "yes"
      })
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
    console.log("roomHotel: ", roomHotel);
    console.log("statusRooms: ", statusRooms);
    res.render("hotel/maintenance-room/new-maintenance", {
      roomHotel,
      statusRooms,
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
maintenanceRoomHotelCtrl.registerMaintenanceRoomHotel = async (req, res) => {
  try {
    const {
      habitacionHotelMantenimiento,
      tipoMantenimiento,
      descripcionMantenimiento,
      usuarioMantenimiento
    } = req.body;

    console.log("req.body del mantenimiento: ", req.body);

    const isExistRoomHotelInMaintenance = await MaintenanceRoomHotel.findOne({
      habitacionHotelMantenimiento,
      finalizadoMantenimiento: false
    });

    if (isExistRoomHotelInMaintenance) {
      req.flash("wrong", "Esta habitación ya está en mantenimiento.");
      return res.redirect("/hotel");
    }

    const newMaintenanceRoomHotel = new MaintenanceRoomHotel({
      usuarioRegistroMantenimiento: req.user._id,
      habitacionHotelMantenimiento,
      tipoMantenimiento,
      descripcionMantenimiento,
      usuarioMantenimiento,
      finalizadoMantenimiento: false
    });
    
    // Cambiar el estado de la habitación al tipo elegido
    const statusRoom = await StatusRoom.findOne({_id: tipoMantenimiento});
    
    const roomHotel = await RoomHotel.findOne({_id: habitacionHotelMantenimiento})
      .populate({
        path: "habitacionHotel",
        populate: {
          path: "categoriaHabitacion"
        }
      })
      .populate("estadoHabitacionHotel");

    if (!roomHotel) {
      req.flash("wrong", "Esta habitación no existe.");
      return res.redirect("/hotel");
    }

    roomHotel.estadoHabitacionHotel = statusRoom._id;
    await roomHotel.save();
    await newMaintenanceRoomHotel.save();
    
    // Guardar el registro de mantenimiento en el historial
    const newMaintenanceRoomHotelHistory = new MaintenanceRoomHotelHistory({
      tipoHistorial: "Registro",
      mantenimientoHabitacionHotelHistorial: newMaintenanceRoomHotel._id
    });

    console.log("Nuevo registro de mantenimiento en el historial de habitación: ", newMaintenanceRoomHotelHistory);
    await newMaintenanceRoomHotelHistory.save();

    req.flash("success", "Estado establecido correctamente.");
    res.redirect("/hotel");

  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Renderizar finalización de mantenimiento de la habitación
maintenanceRoomHotelCtrl.renderDetailMaintenanceRoomHotel = async (req, res) => {
  try {
    const {id} = req.params;
    const maintenanceRoomHotel = await MaintenanceRoomHotel.findById(id)
      .populate("usuarioRegistroMantenimiento")
      .populate({
        path: "habitacionHotelMantenimiento",
        populate: {
          path: "habitacionHotel",
          populate: {
            path: "categoriaHabitacion"
          }
        }
      })
      .populate("tipoMantenimiento")
      .populate("usuarioMantenimiento")
      .lean();
    const userRole = req.user.trabajadorUsuario.rolTrabajador.nombreRol;
    console.log("maintenanceRoomHotel: ", maintenanceRoomHotel);
    res.render("hotel/maintenance-room/detail-maintenance", {
      maintenanceRoomHotel,
      userRole
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente. " + error);
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

maintenanceRoomHotelCtrl.finalizeMaintenanceRoomHotel = async (req, res) => {
  try {
    const {id} = req.params;
    const maintenanceRoomHotel = await MaintenanceRoomHotel.findById(id)
      .populate("usuarioRegistroMantenimiento")
      .populate({
        path: "habitacionHotelMantenimiento",
        populate: {
          path: "habitacionHotel",
          populate: {
            path: "categoriaHabitacion"
          }
        }
      })
      .populate("tipoMantenimiento")
      .populate("usuarioMantenimiento");

    console.log("maintenanceRoomHotel: ", maintenanceRoomHotel);

    if (!maintenanceRoomHotel) {
      req.flash("wrong", "Esta habitación no existe.");
      return res.redirect("/hotel");
    }

    // Encontrar estado "Disponible" de los estados
    const availableStatus = await StatusRoom.findOne({ nombreEstadoHabitacion: "Disponible" });

    if (!availableStatus) {
      req.flash("wrong", "No se encontró el estado disponible.");
      return res.redirect("/hotel");
    }

    // Encontrar la habitación y actualizar el estado
    const roomHotel = await RoomHotel.findOne({_id: maintenanceRoomHotel.habitacionHotelMantenimiento});

    if (!roomHotel) {
      req.flash("wrong", "Esta habitación no existe.");
      return res.redirect("/hotel");
    }

    roomHotel.estadoHabitacionHotel = availableStatus._id;
    await roomHotel.save();

    // Actualizar el finalizado a true
    maintenanceRoomHotel.finalizadoMantenimiento = true;
    await maintenanceRoomHotel.save();

    // Guardar el registro de mantenimiento en el historial
    const newMaintenanceRoomHotelHistory = new MaintenanceRoomHotelHistory({
      tipoHistorial: "Finalización",
      mantenimientoHabitacionHotelHistorial: maintenanceRoomHotel._id
    });
    
    console.log("Nuevo registro de mantenimiento en el historial de habitación: ", newMaintenanceRoomHotelHistory);
    await newMaintenanceRoomHotelHistory.save();

    req.flash("success", "Servicio finalizado correctamente.");
    res.redirect("/hotel");

  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente. " + error);
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

maintenanceRoomHotelCtrl.renderMaintenances = async (req, res) => {
  try {
    // Obtener todos los mantenimientos cuya propiedad finalizadoMantenimiento es false
    const maintenances = await MaintenanceRoomHotel.find({
      finalizadoMantenimiento: false
    })
      .populate("usuarioRegistroMantenimiento")
      .populate({
        path: "habitacionHotelMantenimiento",
        populate: {
          path: "habitacionHotel",
          populate: {
            path: "categoriaHabitacion"
          }
        }
      })
      .populate("tipoMantenimiento")
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

module.exports = maintenanceRoomHotelCtrl;