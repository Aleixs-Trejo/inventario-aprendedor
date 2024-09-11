const {Router} = require("express");
const router = Router();

const {
  renderSalesHotelHistory,
  renderSalesHotelHistoryDetails
} = require("../controllers/salesHotelHistory.controller");

const {
  isAuthenticated,
  havePermission
} = require("../helpers/auth");

// Renderizar las ventas a la habitación
router.get("/hotel/sales/history", isAuthenticated, havePermission("historial-venta-hotel"), renderSalesHotelHistory);

// Renderizar detalles de la venta a la habitación
router.get("/hotel/sales/history/:id/details", isAuthenticated, havePermission("ver-detalle-historial-venta-hotel"), renderSalesHotelHistoryDetails);

module.exports = router;