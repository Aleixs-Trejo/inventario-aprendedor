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
  havePermission
} = require("../helpers/auth");

const {
  maxCategories
} = require("../helpers/capacity");

//Crear categoría
router.get("/categories/register", isAuthenticated, havePermission("crear-categoria"), maxCategories, renderRegisterCategory);
router.post("/categories/register", isAuthenticated, havePermission("crear-categoria"), maxCategories, registerCategory);

//Mostrar Categorías
router.get("/categories", isAuthenticated, havePermission("ver-categoria"), renderCategories);

//Editar Categorías
router.get("/categories/:id/edit", isAuthenticated, havePermission("editar-categoria"),  renderEditCategory);
router.post("/categories/:id/edit", isAuthenticated, havePermission("editar-categoria"), updateCategory);

// Mostrar detalles de una categoría
router.get("/categories/:id/details", isAuthenticated, havePermission("ver-categoria-detalle"), renderDetailsCategory);

//Eliminar Categorías
router.get("/categories/:id/confirm-delete", isAuthenticated, havePermission("eliminar-categoria"), renderDeleteCategory);
router.get("/categories/:id/delete", isAuthenticated, havePermission("eliminar-categoria"), deleteCategory);

module.exports = router;