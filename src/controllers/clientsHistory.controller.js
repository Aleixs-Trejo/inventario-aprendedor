const clientHistoryCtrl = {};
const ClientHistory = require('../models/clientHistoryModel');

// Renderizar historial de clientes
clientHistoryCtrl.renderClientsHistory = async (req, res) => {
  try {
    const clientsHistory = await ClientHistory.find()
    .populate({
      path: "clienteHistorial",
      populate: {
        path: "usuarioRegistroCliente"
      }
    })
    .lean();
    console.log("Historial de Clientes: ", clientsHistory)
    res.render("clients/history-clients", {clientsHistory});
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

module.exports = clientHistoryCtrl;