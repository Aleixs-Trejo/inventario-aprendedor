const cleaningHistoryCtrl = {};

const CleaningHistory = require('../models/cleaningHistoryModel');
const Cleaning = require('../models/cleaningModel');
const Occupation = require('../models/occupationModel');
const Reservation = require('../models/reservationModel');

// Renderizar historial de limpieza de la habitación
cleaningHistoryCtrl.renderCleaningHistory = async (req, res) => {
  try {
    // Primero poblamos limpiezaHistorial
    let cleaningHistory = await CleaningHistory.find()
      .populate({
        path: "limpiezaHistorial",
        populate: [
          {
            path: "usuarioRegistroLimpieza",
            populate: { path: "trabajadorUsuario", populate: "rolTrabajador" }
          },
          {
            path: "usuarioACargoLimpieza",
            populate: { path: "trabajadorUsuario", populate: "rolTrabajador" }
          }
        ]
      })
      .sort({ createdAt: -1 })
      .lean();

    // Poblamos referenciaEntidad basándonos en tipoEntidad
    for (const history of cleaningHistory) {
      if (history.limpiezaHistorial) {
        if (history.limpiezaHistorial.tipoEntidad === 'Occupation') {
          history.limpiezaHistorial.referenciaEntidad = await Occupation.findById(history.limpiezaHistorial.referenciaEntidad).populate({path: "habitacionOcupacion", select: "numeroHabitacion"}).lean();
        } else if (history.limpiezaHistorial.tipoEntidad === 'Reservation') {
          history.limpiezaHistorial.referenciaEntidad = await Reservation.findById(history.limpiezaHistorial.referenciaEntidad).populate({path: "habitacionReserva", select: "numeroHabitacion"}).lean();
        }
      }
    }

    res.render("hotel/cleaning/cleaning-history", {
      cleaningHistory
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al cargar el historial de limpieza, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

module.exports = cleaningHistoryCtrl;
