const roomHotelHistoryCtrl = {};

const RoomHotelHistory = require("../models/roomHotelHistoryModel");

// Renderizar vista de registro de habitación de hotel
roomHotelHistoryCtrl.renderRoomHotelHistory = async (req, res) => {
  try {
    const roomsHotelHistory = await RoomHotelHistory.find()
      .populate({
        path: "habitacionHotelHistorial",
        populate: [
          { path: "usuarioRegistroHabitacionHotel" },
          { path: "estadoHabitacionHotel" },
          { path: "habitacionHotel",
            populate: "categoriaHabitacion"
          }
        ]
      })
      .sort({ createdAt: -1 })
      .lean();
    const userRole = req.user.trabajadorUsuario.rolTrabajador.nombreRol;
    res.render("hotel/rooms-hotel/history-rooms-hotel", {
      roomsHotelHistory,
      userRole
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al cargar el formulario de nueva habitación, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

module.exports = roomHotelHistoryCtrl;