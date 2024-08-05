const reservationHistoryCtrl = {};

const ReservationHistory = require('../models/reservationHistoryModel');

// Renderizar historial de reservas de habitación
reservationHistoryCtrl.renderReservationHistory = async (req, res) => {
  try {
    const reservationHistory = await ReservationHistory.find()
      .populate({
        path: "reservacionHistorial",
        populate: {
          path: "usuarioReserva"
        }
      })
      .populate({
        path: "reservacionHistorial",
        populate: {
          path: "habitacionReserva",
          populate: "pisoHabitacion categoriaHabitacion"
        }
      })
      .sort({createdAt: -1})
      .lean();

    const userRole = req.user.trabajadorUsuario.rolTrabajador.nombreRol;
    console.log("Reservation History: ", reservationHistory);
    res.render("hotel/reservation/history-reservations", {
      reservationHistory,
      userRole
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al cargar los detalles de la reserva, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

module.exports = reservationHistoryCtrl;