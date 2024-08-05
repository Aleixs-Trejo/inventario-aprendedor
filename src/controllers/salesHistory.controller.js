const salesHistoryCtrl = {}
const SalesHistory = require("../models/salesHistoryModel");

// Renderizar lavista del historial de ventas cerradas
salesHistoryCtrl.renderSalesHistory = async (req, res) => {
  try {
    // Renderizar las ventas cerradas
    const salesHistory = await SalesHistory.find()
      .populate("usuarioCierreVenta")
      .populate({
        path: "ventaHistorial.cierreVentas",
        populate: [
          { path: "usuarioVenta",
            populate: {
              path: "trabajadorUsuario",
              populate: "rolTrabajador"
            }
          },
          { path: "clienteVenta" },
          { path: "productosVenta.productoVenta",
            populate: {
              path: "almacenProducto",
              populate: {
                path: "proveedorProducto categoriaProducto"
              }
            }
          },
        ]
      })
      .sort({createdAt: -1})
      .lean();
    
    const userRole = req.user.trabajadorUsuario.rolTrabajador.nombreRol;

    console.log("Hisotrial de ventas: ", salesHistory);
    res.render("sales/history-sales", {
      salesHistory,
      userRole
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

module.exports = salesHistoryCtrl;