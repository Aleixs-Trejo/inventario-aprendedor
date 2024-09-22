const cleaningCtrl = {};

const Cleaning = require("../models/cleaningModel");
const Occupation = require("../models/occupationModel");
const Reservation = require("../models/reservationModel");

// Renderizar habitaciones en limpieza intermedia
cleaningCtrl.renderCleaning = async (req, res) => {
  try {
    // Buscar limpiezas intermedias que no han finalizado
    let cleanings = await Cleaning.find({ finalizadoLimpieza: false })
      .populate({
        path: "usuarioRegistroLimpieza usuarioACargoLimpieza",
        populate: { path: "trabajadorUsuario", populate: "rolTrabajador" }
      })
      .sort({ createdAt: -1 })
      .lean();

    // Poblamos referenciaEntidad basándonos en tipoEntidad
    for (const cleaning of cleanings) {
      if (cleaning.tipoEntidad === 'Occupation') {
        cleaning.referenciaEntidad = await Occupation.findById(cleaning.referenciaEntidad)
          .populate({ path: 'habitacionOcupacion', select: 'numeroHabitacion estadoHabitacion' })
          .lean();
      } else if (cleaning.tipoEntidad === 'Reservation') {
        cleaning.referenciaEntidad = await Reservation.findById(cleaning.referenciaEntidad)
          .populate({ path: 'habitacionReserva', select: 'numeroHabitacion estadoHabitacion' })
          .lean();
      }
    }

    const currentPage = `cleanings`;
    res.render("hotel/cleaning/all-cleanings", {
      cleanings,
      currentPage
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al cargar la lista de limpieza Intermedia, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

module.exports = cleaningCtrl;
