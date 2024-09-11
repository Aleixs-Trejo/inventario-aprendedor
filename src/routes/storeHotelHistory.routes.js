const {Router} = require("express");
const router = Router();

const {
  renderAllStoreHotelHistory
} = require("../controllers/storeHotelHistory.controller");

const {
  isAuthenticated,
  havePermission
} = require("../helpers/auth");

// Mostrar historial de productos en almacén
router.get("/store-hotel/history", isAuthenticated, havePermission("historial-producto-almacen"), renderAllStoreHotelHistory);

module.exports = router;