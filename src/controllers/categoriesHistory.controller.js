const categoryHistoryCtrl = {};
const CategoryHistory = require('../models/categoryHistoryModel');

// Mostrar el historial de categorias
categoryHistoryCtrl.renderCategoryHistory = async (req, res) => {
  try {
    const categoriesHistory = await CategoryHistory.find()
    .populate({
      path: "usuarioHistorial",
      populate: {
        path: "trabajadorUsuario",
        populate: "rolTrabajador"
      }
    })
    .populate({
      path: "categoriaHistorial",
      populate: {
        path: "usuarioRegistroCategoria"
      }
    })
    .sort({createdAt: -1})
    .lean();
    console.log("Historial de Categorias: ", categoriesHistory);
    res.render('categories/categories-history', {categoriesHistory});
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

module.exports = categoryHistoryCtrl;