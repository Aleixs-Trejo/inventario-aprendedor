const storeHotelHistoryCtrl = {}

const StoreHotelHistory = require('../models/storeHotelHistoryModel');

// Mostrar historial de productos en el almacén del hotel
storeHotelHistoryCtrl.renderAllStoreHotelHistory = async (req, res) => {
  try {
    const storeHotelHistory = await StoreHotelHistory.find()
      .populate({
        path: "almacenHotelHistorial",
        populate: [
          { path: "usuarioRegistroAlmacenHotel" },
          { path: "productoAlmacenHotel", populate: [
            { path: "categoriaProducto" },
            { path: "proveedorProducto" }
          ]}
        ]
      })
      .lean();

    res.render("hotel/store-hotel/history-store-hotel", {
      storeHotelHistory
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al mostrar la vista de historial de productos en el almacén, intente nuevamente.");
    console.error("Error:", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

module.exports = storeHotelHistoryCtrl;