const roomsHistoryCtrl = {};
const RoomHistory = require("../models/roomHistoryModel");

// Renderizar historial de habitaciones
roomsHistoryCtrl.renderRoomsHistory = async (req, res) => {
  try {
    // Cargar todos los datos de la BD
    const roomsHistory = await RoomHistory.find()
      .populate({
        path: "usuarioHistorial",
        populate: {
          path: "trabajadorUsuario",
          populate: "rolTrabajador"
        }
      })
      .populate({
        path: "habitacionHistorial",
        populate: {
          path: "usuarioRegistroHabitacion pisoHabitacion categoriaHabitacion",
        }
      })
      .sort({createdAt: -1})
      .lean();

    res.render("hotel/rooms/history-rooms", {
      roomsHistory
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al cargar el historial de habitaciones, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

module.exports = roomsHistoryCtrl;