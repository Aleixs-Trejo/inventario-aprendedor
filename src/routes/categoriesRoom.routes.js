const {Router} = require("express");
const router = Router();

const {
  renderRegisterCategoryRoom,
  registerCategoryRoom,
  renderEditCategoryRoom,
  updateCategoryRoom,
  renderCategoriesRoom,
  renderDeleteCategoryRoom,
  deleteCategoryRoom
} = require("../controllers/categoriesRoom.controller");

const {
  isAuthenticated,
  isAdmin
} = require("../helpers/auth");

// Renderizar formulario de creación de categoría
router.get("/categories-room/register", isAuthenticated, isAdmin, renderRegisterCategoryRoom);
// Registrar categoría
router.post("/categories-room/register", isAuthenticated, isAdmin, registerCategoryRoom);

// Renderizar formulario de edición de categoría
router.get("/categories-room/:id/edit", isAuthenticated, isAdmin, renderEditCategoryRoom);
// Actualizar categoría
router.post("/categories-room/:id/edit", isAuthenticated, isAdmin, updateCategoryRoom);

//Renderizar listado de categorías
router.get("/categories-room", isAuthenticated, isAdmin, renderCategoriesRoom);

// Renderizar confirmación de eliminación de categoría
router.get("/categories-room/:id/confirm-delete", isAuthenticated, isAdmin, renderDeleteCategoryRoom);
// Eliminar categoría
router.get("/categories-room/:id/delete", isAuthenticated, isAdmin, deleteCategoryRoom);

module.exports = router;