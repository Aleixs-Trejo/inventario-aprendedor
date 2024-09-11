const {Router} = require("express");
const router = Router();

const {
  renderSalesHistory
} = require("../controllers/salesHistory.controller");

const {
  isAuthenticated,
  havePermission
} = require("../helpers/auth");

// Obtener historial de ventas
router.get("/sales/history", isAuthenticated, havePermission("historial-venta"), renderSalesHistory);

module.exports = router;