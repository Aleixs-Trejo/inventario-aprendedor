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
  isAdmin,
  isAlmacen
} = require("../helpers/auth");

//Registrar nueva ubicacion
router.get("/stock-locations/register", isAuthenticated, isAlmacen, renderRegisterStockLocation);
router.post("/stock-locations/register", isAuthenticated, isAlmacen, registerStockLocation);

//Mostrar Ubicaciones
router.get("/stock-locations", isAuthenticated, isAlmacen, renderStockLocations);

//Editar una ubicación
router.get("/stock-locations/:id/edit", isAuthenticated, isAlmacen, renderEditStockLocation);
router.post("/stock-locations/:id/edit", isAuthenticated, isAlmacen, updateStockLocation);

//Eliminar una ubicación
router.get("/stock-locations/:id/confirm-delete", isAuthenticated, isAdmin, renderDeleteStockLocation);
router.get("/stock-locations/:id/delete", isAuthenticated, isAdmin, deleteStockLocation);

module.exports = router;