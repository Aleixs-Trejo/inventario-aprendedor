const maintenancesHistoryCtrl = {};

const MaintenancesHistory = require("../models/maintenanceRoomHistoryModel");

// Mostrar todos los historiales de mantenimiento
maintenancesHistoryCtrl.renderMaintenancesHistory = async (req, res) => {
  try {
    const maintenancesHistory = await MaintenancesHistory.find()
      .populate({
        path: "mantenimientoHabitacionHistorial",
        populate: [
          { path: "usuarioRegistroMantenimiento" },
          { path: "habitacionMantenimiento"},
          { path: "tipoMantenimiento" },
          { path: "usuarioMantenimiento" }
        ]
      })
      .sort({createdAt: -1})
      .lean();

    res.render("hotel/maintenance-room/history-maintenances", {
      maintenancesHistory
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al cargar la vista, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

module.exports = maintenancesHistoryCtrl;