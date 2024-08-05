const userHistoryCtrl = {}

const UsersHistory = require("../models/userHistoryModel");

// Obtener Historial de Usuarios
userHistoryCtrl.renderUserHistory = async (req, res) => {
  try {
    const usersHistory = await UsersHistory.find()
    .populate({
      path: "usuarioHistorial",
      populate: {
        path: "trabajadorUsuario",
        populate: {
          path: "rolTrabajador"
        }
      }
    })
    .lean();
    res.render("users/history-users", {usersHistory});
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

module.exports = userHistoryCtrl;