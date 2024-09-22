const statusRoomHistoryCtrl = {};

const StatusRoomHistory = require('../models/statusRoomHistoryModel');

// Renderizar el historial de estados con paginación
statusRoomHistoryCtrl.renderStatusRoomHistory = async (req, res) => {
  try {
    // Buscar estados de habitación en la BD
    const statusRoomHistory = await StatusRoomHistory.find()
      .populate({
        path: "estadoHabitacionHistorial",
        populate: {
          path: "usuarioRegistroEstadoHabitacion"
        }
      })
      .sort({createdAt: -1})
      .lean();

    res.render("hotel/status-room/history-status-room", {
      statusRoomHistory
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al cargar la vista del historial, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};


module.exports = statusRoomHistoryCtrl;