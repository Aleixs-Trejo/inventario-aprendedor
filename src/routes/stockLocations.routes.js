const {Router} = require("express");
const router = Router();

const {
  renderRegisterStockLocation,
  registerStockLocation,
  renderStockLocations,
  renderEditStockLocation,
  updateStockLocation,
  deleteStockLocation,
  renderDeleteStockLocation
} = require("../controllers/stockLocations.controller");

const {
  isAuthenticated,
  havePermission
} = require("../helpers/auth");

const {
  maxStockLocations
} = require("../helpers/capacity");

//Registrar nueva ubicacion
router.get("/stock-locations/register", isAuthenticated, havePermission("crear-sucursal"), maxStockLocations, renderRegisterStockLocation);
router.post("/stock-locations/register", isAuthenticated, havePermission("crear-sucursal"), maxStockLocations, registerStockLocation);

//Mostrar Ubicaciones
router.get("/stock-locations", isAuthenticated, havePermission("ver-sucursal"), renderStockLocations);

//Editar una ubicación
router.get("/stock-locations/:id/edit", isAuthenticated, havePermission("editar-sucursal"), renderEditStockLocation);
router.post("/stock-locations/:id/edit", isAuthenticated, havePermission("editar-sucursal"), updateStockLocation);

//Eliminar una ubicación
router.get("/stock-locations/:id/confirm-delete", isAuthenticated, havePermission("eliminar-sucursal"), renderDeleteStockLocation);
router.get("/stock-locations/:id/delete", isAuthenticated, havePermission("eliminar-sucursal"), deleteStockLocation);

module.exports = router;