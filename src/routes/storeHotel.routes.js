const {Router} = require("express");
const router = Router();

const {
  renderRegisterStoreHotel,
  registerStoreHotel,
  renderAllStoreHotel,
  renderEditStoreHotel,
  updateStoreHotel,
  renderDeleteStoreHotel,
  deleteStoreHotel
} = require("../controllers/storeHotel.controller");

const {
  isAuthenticated,
  isAdmin
} = require("../helpers/auth");

// Renderizar formulario de registro de producto en almacén
router.get("/store-hotel/register", isAuthenticated, isAdmin, renderRegisterStoreHotel);
// Registrar producto en almacén
router.post("/store-hotel/register", isAuthenticated, isAdmin, registerStoreHotel);

// Mostrar listado de productos en almacén
router.get("/store-hotel", isAuthenticated, isAdmin, renderAllStoreHotel);

// Renderizar formulario de edición de producto en almacén
router.get("/store-hotel/:id/edit", isAuthenticated, isAdmin, renderEditStoreHotel);
// Actualizar producto en almacén
router.post("/store-hotel/:id/edit", isAuthenticated, isAdmin, updateStoreHotel);

// Renderizar formulario de eliminación de producto en almacén
router.get("/store-hotel/:id/confirm-delete", isAuthenticated, isAdmin, renderDeleteStoreHotel);
// Eliminar producto en almacén
router.get("/store-hotel/:id/delete", isAuthenticated, isAdmin, deleteStoreHotel);

module.exports = router;