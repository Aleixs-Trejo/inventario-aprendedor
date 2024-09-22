const categoryCtrl = {};
const Category = require("../models/categoryModel");
const CategoryHistory = require("../models/categoryHistoryModel");

//Crear categoría
categoryCtrl.renderRegisterCategory = async (req, res) => {
  try {
    const existingCategories = await Category.find({eliminadoCategoria: false}).lean();

    if (existingCategories && existingCategories.length >= process.env.MAX_CATEGORIES) {
      req.flash("wrong", "Ya tienes más de " + process.env.MAX_CATEGORIES + " categorías registradas.");
      console.log(`Máximo número de categorías alcanzado, el máximo permitido es de ${process.env.MAX_CATEGORIES} y tienes ${existingCategories.length}`);
      return res.redirect("/");
    }
    res.render("categories/new-category");
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}
categoryCtrl.registerCategory = async (req, res) => {
  try {
    const {
      nombreCategoria,
      descripcionCategoria
    } = req.body;

    const existingCategories = await Category.find({eliminadoCategoria: false}).lean();

    if (existingCategories && existingCategories.length >= process.env.MAX_CATEGORIES) {
      req.flash("wrong", "Ya tienes más de " + process.env.MAX_CATEGORIES + " categorías registradas.");
      console.log(`Máximo número de categorías alcanzado, el máximo permitido es de ${process.env.MAX_CATEGORIES} y tienes ${existingCategories.length}`);
      return res.redirect("/");
    }

    const nombreCategory = await Category.findOne({nombreCategoria}); //Buscar si ya existe la categoría
    if (nombreCategory){
      req.flash("wrong", "La Categoría ya existe");
    } else {
      const categoriaRegistrada = {
        usuarioRegistroCategoria: req.user._id,
        nombreCategoria,
        descripcionCategoria,
      };

      const newCategory = new Category(categoriaRegistrada);

      console.log("Guardando nueva categoría: ", newCategory)
      await newCategory.save(); //Guardar en la bd

      const categoryId = newCategory._id;
      const nombreCategoriaHistorial = newCategory.nombreCategoria;
      const descripcionCategoriaHistorial = newCategory.descripcionCategoria;

      const newCategoryHistory = new CategoryHistory({
        tipoHistorial: "Registro",
        usuarioHistorial: req.user._id,
        categoriaHistorial: categoryId,
        nombreCategoriaHistorial,
        descripcionCategoriaHistorial
      });
      await newCategoryHistory.save(); //Guardar en el historial

      req.flash("success", "Categoría registrada exitosamente");
      res.redirect("/categories");
    }
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

//Mostrar Categorías
categoryCtrl.renderCategories = async (req, res) => {
  try {
    const categories = await Category.find({eliminadoCategoria: false})
    .populate("usuarioRegistroCategoria")
    .lean();
    const currentPage = `categories`;
    res.render("categories/all-categories", {
      categories,
      currentPage
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

// Mostrar información histórica de una categoría
categoryCtrl.renderDetailsCategory = async (req, res) => {
  try {
    const {id} = req.params;
    const category = await Category.findById(id)
      .populate({
        path: "usuarioRegistroCategoria",
        populate: {
          path: "trabajadorUsuario",
          populate: "rolTrabajador"
        }
      })
      .lean();
    const categoryHistory = await CategoryHistory.find({categoriaHistorial: id})
      .populate({
        path: "usuarioHistorial",
        populate: {
          path: "trabajadorUsuario",
          populate: "rolTrabajador"
        }
      })
      .populate("categoriaHistorial")
      .sort({createdAt: -1})
      .lean();
    res.render("categories/details-category", {
      category,
      categoryHistory
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al mostrar la información de la categoría, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

//Editar y actualizar Categorías
categoryCtrl.renderEditCategory = async (req, res) =>{
  try {
    const category = await Category.findById(req.params.id).lean();
    res.render("categories/edit-category", {category});
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

categoryCtrl.updateCategory = async (req, res) => {
  try {
    const {id} = req.params;
    const categoryUpdated =await Category.findByIdAndUpdate(id, req.body, {new: true});

    const categoryId = categoryUpdated._id;
    const nombreCategoriaHistorial = categoryUpdated.nombreCategoria;
    const descripcionCategoriaHistorial = categoryUpdated.descripcionCategoria;
    // Añadir al historial
    const newcategoryHistory = new CategoryHistory({
      tipoHistorial: "Modificado",
      usuarioHistorial: req.user._id,
      categoriaHistorial: categoryId,
      nombreCategoriaHistorial,
      descripcionCategoriaHistorial
    });

    await newcategoryHistory.save();

    req.flash("success", "Categoría actualizada exitosamente");
    res.redirect("/categories");
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

//Eliminar categoría
categoryCtrl.renderDeleteCategory = async (req, res) => {
  try {
    const {id} = req.params;
    const category = await Category.findById(id)
    .populate("usuarioRegistroCategoria")
    .lean();
    res.render("categories/delete-category", {category});
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

categoryCtrl.deleteCategory = async (req, res) => {
  try {
    const {id} = req.params;
    const deletedCategory = await Category.findById(id).lean();

    if (!deletedCategory){
      req.flash("wrong", "La categoría no existe");
      return res.redirect("/categories");
    }

    const categoryDeleted = await Category.findByIdAndUpdate(id, {eliminadoCategoria: true}, {new: true});

    const categoryId = categoryDeleted._id;
    const nombreCategoriaHistorial = categoryDeleted.nombreCategoria;
    const descripcionCategoriaHistorial = categoryDeleted.descripcionCategoria;

    // Añadir al historial
    const newcategoryHistory = new CategoryHistory({
      tipoHistorial: "Eliminado",
      usuarioHistorial: req.user._id,
      categoriaHistorial: categoryId,
      nombreCategoriaHistorial,
      descripcionCategoriaHistorial
    });

    await newcategoryHistory.save(); //Guardar en el historial

    req.flash("success", "Categoría eliminada exitosamente");
    res.redirect("/categories");
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

module.exports = categoryCtrl;