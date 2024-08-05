const {Router} = require("express");
const router = Router();

const {
  renderAllStoreHotelHistory
} = require("../controllers/storeHotelHistory.controller");

const {
  isAuthenticated,
  isAdmin
} = require("../helpers/auth");

// Mostrar historial de productos en almacén
router.get("/store-hotel/history", isAuthenticated, isAdmin, renderAllStoreHotelHistory);

module.exports = router;