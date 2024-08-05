const {Router} = require("express");
const router = Router();

const {
  renderSalesHistory
} = require("../controllers/salesHistory.controller");

const {
  isAuthenticated,
  isAdmin
} = require("../helpers/auth");

// Obtener historial de ventas
router.get("/sales/history", isAuthenticated, isAdmin, renderSalesHistory);

module.exports = router;