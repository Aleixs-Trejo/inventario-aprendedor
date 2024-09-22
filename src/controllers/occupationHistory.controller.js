const occupationHistoryCtrl = {};

const OccupationHistory = require('../models/occupationHistoryModel');

// Renderizar historial de ocupaciones de la habitación
occupationHistoryCtrl.renderOccupationHistory = async (req, res) => {
  try {
    const occupationHistory = await OccupationHistory.find()
      .populate({
        path: "ocupacionHistorial",
        populate: [
          { path: "habitacionOcupacion",
          populate: "pisoHabitacion categoriaHabitacion" },
          { path: "usuarioRegistroOcupacion", 
            populate: "trabajadorUsuario" }
        ]
      })
      .sort({createdAt: -1})
      .lean();

    res.render("hotel/occupations/history-occupations", {
      occupationHistory
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al cargar los detalles de la reserva, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

module.exports = occupationHistoryCtrl;