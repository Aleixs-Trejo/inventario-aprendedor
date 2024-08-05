const {Router} = require("express");
const router = Router();

const {
  renderProductsHistory
} = require("../controllers/productsHistory.controller");

const {
  isAuthenticated,
  isAlmacenVendedor
} = require("../helpers/auth");

// Mostrar Historial
router.get("/products/history", isAuthenticated, isAlmacenVendedor, renderProductsHistory);

module.exports = router;