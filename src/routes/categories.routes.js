const {Router} = require("express");
const router = Router();

const {
  renderRegisterCategory,
  registerCategory,
  renderCategories,
  renderEditCategory,
  updateCategory,
  deleteCategory,
  renderDeleteCategory,
  renderDetailsCategory
} = require("../controllers/categories.controller");
const {
  isAuthenticated,
  isAdmin,
  isAlmacen
} = require("../helpers/auth");

//Crear categoría
router.get("/categories/register", isAuthenticated, isAlmacen, renderRegisterCategory);
router.post("/categories/register", isAuthenticated, isAlmacen, registerCategory);

//Mostrar Categorías
router.get("/categories", isAuthenticated, isAlmacen, renderCategories);

//Editar Categorías
router.get("/categories/:id/edit", isAuthenticated, isAlmacen,  renderEditCategory);
router.post("/categories/:id/edit", isAuthenticated, isAlmacen, updateCategory);

// Nostrar detalles de una categoría
router.get("/categories/:id/details", isAuthenticated, isAdmin, renderDetailsCategory);

//Eliminar Categorías
router.get("/categories/:id/confirm-delete", isAuthenticated, isAdmin, renderDeleteCategory);
router.get("/categories/:id/delete", isAuthenticated, isAdmin, deleteCategory);

module.exports = router;