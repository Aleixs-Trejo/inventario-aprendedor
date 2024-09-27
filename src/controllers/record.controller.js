const recordCtrl = {};

const Record = require("../models/recordModel");

// Renderzar vista de registros
recordCtrl.renderRecords = async (req, res) => {
  try {
    const records = await Record.find()
      .populate({
        path: "usuarioRegistroRegistro",
        populate: {
          path: "trabajadorUsuario",
          populate: "rolTrabajador"
        }
      })
      .populate({
        path: "productoRegistro"
      })
      .populate("sucursalRegistro")
      .populate("ventaAsociada")
      .populate("proveedorProductoRegistro")
      .populate("categoriaProductoRegistro")
      .sort({createdAt: -1})
      .lean();

    console.log("Registros: ", records);

    res.render("records/all-records", {
      records
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al mostrar los registros, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

module.exports = recordCtrl;