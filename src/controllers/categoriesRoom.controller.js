const categoryRoomCtrl = {};

const CategoryRoom = require("../models/categoryRoomModel");
const CategoryRoomHistory = require("../models/categoryRoomHistoryModel");

// Renderizar formulario de nueva categoría de habitación
categoryRoomCtrl.renderRegisterCategoryRoom = (req, res) => {
  try {
    res.render("hotel/categories-room/new-category-room");
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al cargar la vista, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Registrar nueva categoría de habitación
categoryRoomCtrl.registerCategoryRoom = async (req, res) => {
  try {
    const {
      nombreCategoriaHabitacion,
      descripcionCategoriaHabitacion,
    } = req.body;

    console.log("req.body: ", req.body);

    const isExistName = await CategoryRoom.findOne({ nombreCategoriaHabitacion });
    if (isExistName){
      req.flash("wrong", "La categoría de habitación ya existe");
      return res.redirect("/categories-room");
    } else {
      const categoryRoomRegistrado = {
        usuarioRegistroCategoriaHabitacion: req.user._id,
        nombreCategoriaHabitacion,
        descripcionCategoriaHabitacion
      };

      const newCategoryRoom = new CategoryRoom(categoryRoomRegistrado);
      console.log("Registrando nueva categoría de habitación: ", newCategoryRoom);
      await newCategoryRoom.save(); //Guardar en la bd

      const categoryRoomId = newCategoryRoom._id;
      const newCategoryRoomHistory = new CategoryRoomHistory({
        tipoHistorial: "Registro",
        categoriaHabitacionHistorial: categoryRoomId
      });
      console.log("Guardando nuevo historial: ", newCategoryRoomHistory);
      await newCategoryRoomHistory.save(); //Guardar en el historial

      req.flash("success", "Categoría de habitación registrada exitosamente");
      res.redirect("/categories-room");
    }
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al registrar la categoría de habitación, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Mostrar todas las categorías de habitación
categoryRoomCtrl.renderCategoriesRoom = async (req, res) => {
  try {
    const categoriesRooms = await CategoryRoom.find({eliminadoCategoriaHabitacion: false})
      .populate("usuarioRegistroCategoriaHabitacion")
      .sort({createdAt: -1})
      .lean();
    
    const currentPage = `categories-room`;
    res.render("hotel/categories-room/all-categories-room", {
      categoriesRooms,
      currentPage
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al cargar las categorías de la vista, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Renderizar formulario de edición de categoría de habitación
categoryRoomCtrl.renderEditCategoryRoom = async (req, res) => {
  try {
    const {id} = req.params;
    const categoryRoom = await CategoryRoom.findById(id).lean();
    res.render("hotel/categories-room/edit-category-room", {categoryRoom});
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al cargar el formulario de edición de la categoría de habitación, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Actualizar categoría de habitación
categoryRoomCtrl.updateCategoryRoom = async (req, res) => {
  try {
    const {id} = req.params;
    await CategoryRoom.findByIdAndUpdate(id, req.body);
    req.flash("success", "Categoría de habitación actualizada exitosamente");
    res.redirect("/categories-room");
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al actualizar la categoría de habitación, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Renderizar confirmación de eliminación de categoría de habitación
categoryRoomCtrl.renderDeleteCategoryRoom = async (req, res) => {
  try {
    const {id} = req.params;
    const categoryRoom = await CategoryRoom.findById(id)
      .populate("usuarioRegistroCategoriaHabitacion")
      .lean();
    res.render("hotel/categories-room/delete-category-room", {categoryRoom});
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al cargar la confirmación de eliminación de la categoría de habitación, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Eliminar categoría de habitación
categoryRoomCtrl.deleteCategoryRoom = async (req, res) => {
  try {
    const {id} = req.params;
    const deletedCategoryRoom = await CategoryRoom.findById(id).lean();

    if (!deletedCategoryRoom) {
      req.flash("wrong", "La categoría de habitación no existe");
      return res.redirect("/categories-room");
    }

    await CategoryRoomHistory.findByIdAndUpdate(id, {eliminadoCategoriaHabitacion: true});

    // Añadir al historial de categorías de habitación
    const newCategoryRoomHistory = new CategoryRoomHistory({
      tipoHistorial: "Eliminado",
      categoriaHabitacionHistorial: deletedCategoryRoom._id
    });
    console.log("Guardando nuevo historial: ", newCategoryRoomHistory);
    await newCategoryRoomHistory.save(); //Guardar en el historial

    req.flash("success", "Categoría de habitación eliminada exitosamente");
    res.redirect("/categories-room");
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al eliminar la categoría de habitación, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};


module.exports = categoryRoomCtrl;