const categoriesRoomHistoryCtrl = {};
const CategoriesRoomHistory = require("../models/categoryRoomHistoryModel");

// Renderizar el historial de categorias de habitación
categoriesRoomHistoryCtrl.renderCategoriesRoomHistory = async (req, res) => {
  try {
    // Buscar categorías de habitación en la BD
    const categoriesRoomHistory = await CategoriesRoomHistory.find()
      .populate({
        path: "categoriaHabitacionHistorial",
        populate: {
          path: "usuarioRegistroCategoriaHabitacion"
        }
      })
      .sort({createdAt: -1})
      .lean();

    res.render("hotel/categories-room/history-categories-room", {
      categoriesRoomHistory
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al cargar la vista, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

module.exports = categoriesRoomHistoryCtrl;