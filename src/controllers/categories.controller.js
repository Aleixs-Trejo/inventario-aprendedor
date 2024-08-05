const categoryCtrl = {};
const Category = require("../models/categoryModel");
const CategoryHistory = require("../models/categoryHistoryModel");

//Crear categoría
categoryCtrl.renderRegisterCategory = (req, res) => {
  try {
    res.render("categories/new-category")
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

      const newCategoryHistory = new CategoryHistory({
        tipoHistorial: "Registro",
        categoriaHistorial: categoryId
      });
      console.log("Guardando nuevo historial: ", newCategoryHistory)
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
    const userRole = req.user.trabajadorUsuario.rolTrabajador.nombreRol;
    res.render("categories/all-categories", {
      categories,
      userRole
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

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
    await Category.findByIdAndUpdate(id, req.body);
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

    await Category.findByIdAndUpdate(id, {eliminadoCategoria: true});

    // Añadir al historial
    const newcategoryHistory = new CategoryHistory({
      tipoHistorial: "Eliminado",
      categoriaHistorial: deletedCategory._id
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