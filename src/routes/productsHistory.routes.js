const {Router} = require("express");
const router = Router();

const {
  renderProductsHistory
} = require("../controllers/productsHistory.controller");

const {
  isAuthenticated,
  havePermission
} = require("../helpers/auth");

// Mostrar Historial
router.get("/products/history", isAuthenticated, havePermission("historial-producto"), renderProductsHistory);

module.exports = router;