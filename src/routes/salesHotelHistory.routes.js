const {Router} = require("express");
const router = Router();

const {
  renderSalesHotelHistory,
  renderSalesHotelHistoryDetails
} = require("../controllers/salesHotelHistory.controller");

const {
  isAuthenticated,
  isAdmin
} = require("../helpers/auth");

// Renderizar las ventas a la habitación
router.get("/hotel/sales/history", isAuthenticated, isAdmin, renderSalesHotelHistory);

// Renderizar detalles de la venta a la habitación
router.get("/hotel/sales/history/:id/details", isAuthenticated, isAdmin, renderSalesHotelHistoryDetails);

module.exports = router;