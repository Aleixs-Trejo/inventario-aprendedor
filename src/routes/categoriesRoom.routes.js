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
  havePermission
} = require("../helpers/auth");

// Renderizar formulario de creación de categoría
router.get("/categories-room/register", isAuthenticated, havePermission("crear-categoria-habitacion"), renderRegisterCategoryRoom);
// Registrar categoría
router.post("/categories-room/register", isAuthenticated, havePermission("crear-categoria-habitacion"), registerCategoryRoom);

// Renderizar formulario de edición de categoría
router.get("/categories-room/:id/edit", isAuthenticated, havePermission("editar-categoria-habitacion"), renderEditCategoryRoom);
// Actualizar categoría
router.post("/categories-room/:id/edit", isAuthenticated, havePermission("editar-categoria-habitacion"), updateCategoryRoom);

//Renderizar listado de categorías
router.get("/categories-room", isAuthenticated, havePermission("ver-categoria-habitacion"), renderCategoriesRoom);

// Renderizar confirmación de eliminación de categoría
router.get("/categories-room/:id/confirm-delete", isAuthenticated, havePermission("eliminar-categoria-habitacion"), renderDeleteCategoryRoom);
// Eliminar categoría
router.get("/categories-room/:id/delete", isAuthenticated, havePermission("eliminar-categoria-habitacion"), deleteCategoryRoom);

module.exports = router;