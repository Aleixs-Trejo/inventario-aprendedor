const storeHistoryCtrl = {};

const StoreHistory = require("../models/storeHistoryModel");

// Mostrar Historial
storeHistoryCtrl.renderStoreHistory = async (req, res) => {
  try {
    const storeHistory = await StoreHistory.find()
      .populate({
        path: "usuarioHistorial",
        populate: {
          path: "trabajadorUsuario",
          populate: "rolTrabajador"
        }
      })
      .populate({
        path: "almacenHistorial",
        populate: [
          { path: "almacenUsuario" },
          { path: "almacenProducto", populate: [
            { path: "proveedorProducto" },
            { path: "categoriaProducto" }
          ] },
          { path: "almacenStockUbicacion" }
        ]
      })
      .populate({
        path: "almacenProductoHistorial",
        populate: "proveedorProducto categoriaProducto"
      })
      .populate({
        path: "almacenStockUbicacionHistorial"
      })
      .sort({createdAt: -1})
      .lean();
    res.render("stores/history-stores.hbs", {storeHistory});
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al mostrar la historial de almacenes, intente nuevamente.");
    console.error("Error:", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

module.exports = storeHistoryCtrl;