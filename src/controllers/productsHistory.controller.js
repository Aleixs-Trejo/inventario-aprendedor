const productHistoryCtrl = {};

const ProductHistory = require("../models/productHistoryModel");

// Mostrar el historial
productHistoryCtrl.renderProductsHistory = async (req, res) => {
  try {
    const productsHistory = await ProductHistory.find()
    .populate({
      path: "usuarioHistorial",
      populate: {
        path: "trabajadorUsuario",
        populate: "rolTrabajador"
      }
    })
    .populate({
      path: "productoHistorial",
      populate: [
        { path: "usuarioProducto" },
        { path: "proveedorProducto",
        populate: {
          path: "nombreProveedor"
          }
        },
        { path: "categoriaProducto", 
          populate: {
            path: "nombreCategoria"
          }
        }
      ]
    })
    .populate("proveedorProductoHistorial")
    .populate("categoriaProductoHistorial")
    .sort({createdAt: -1})
    .lean();

    res.render("products/history-products", {
      productsHistory
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente");
    console.error("Error:", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

module.exports = productHistoryCtrl;