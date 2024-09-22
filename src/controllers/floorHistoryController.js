const floorHistoryCtrl = {};

const FloorHistory = require("../models/floorHistoryModel");

// Mostrar historial de pisos
floorHistoryCtrl.renderFloorHistory = async (req, res) => {
  try {
    // Cargar todos los datos de la BD
    const floorsHistory = await FloorHistory.find()
      .populate({
        path: "pisoHabitacionHistorial",
        populate: "usuarioRegistroPiso"
      })
      .lean();

    res.render("hotel/floors/history-floors", {
      floorsHistory
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al cargar los datos, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

module.exports = floorHistoryCtrl;