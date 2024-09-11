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
  havePermission
} = require("../helpers/auth");

// Renderizar formulario de registro de producto en almacén
router.get("/store-hotel/register", isAuthenticated, havePermission("registrar-producto-almacen"), renderRegisterStoreHotel);
// Registrar producto en almacén
router.post("/store-hotel/register", isAuthenticated, havePermission("registrar-producto-almacen"), registerStoreHotel);

// Mostrar listado de productos en almacén
router.get("/store-hotel", isAuthenticated, havePermission("ver-producto-almacen"), renderAllStoreHotel);

// Renderizar formulario de edición de producto en almacén
router.get("/store-hotel/:id/edit", isAuthenticated, havePermission("editar-producto-almacen"), renderEditStoreHotel);
// Actualizar producto en almacén
router.post("/store-hotel/:id/edit", isAuthenticated, havePermission("editar-producto-almacen"), updateStoreHotel);

// Renderizar formulario de eliminación de producto en almacén
router.get("/store-hotel/:id/confirm-delete", isAuthenticated, havePermission("eliminar-producto-almacen"), renderDeleteStoreHotel);
// Eliminar producto en almacén
router.get("/store-hotel/:id/delete", isAuthenticated, havePermission("eliminar-producto-almacen"), deleteStoreHotel);

module.exports = router;