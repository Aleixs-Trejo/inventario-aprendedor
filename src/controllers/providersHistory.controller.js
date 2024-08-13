const providerHistoryCtrl = {};

const ProviderHistory = require('../models/providerHistoryModel');

// Mostrar historial de proveedores
providerHistoryCtrl.renderProvidersHistory = async (req, res) => {
  try {
    const providersHistory = await ProviderHistory.find()
      .populate({
        path: "usuarioHistorial",
        populate: {
          path: "trabajadorUsuario",
          populate: "rolTrabajador"
        }
      })
      .populate({
        path: "proveedorHistorial",
        populate: {
          path: "usuarioRegistroProveedor"
        }
      })
      .sort({createdAt: -1})
      .lean();
    res.render("providers/history-providers", {providersHistory})
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente");
    console.error("Error:", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

module.exports = providerHistoryCtrl;