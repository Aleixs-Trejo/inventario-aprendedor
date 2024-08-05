const {Router} = require("express");
const router = Router();

const {
  renderAllSalesHotel,
  renderDetailsSalesHotel
} = require("../controllers/salesHotel.controller");

const {
  isAuthenticated,
  isAdmin
} = require("../helpers/auth");

// Renderizar las ventas a la habitación
router.get("/hotel/sales", isAuthenticated, isAdmin, renderAllSalesHotel);

// Mostrar detalles de una venta
router.get("/hotel/sales/:id/details", isAuthenticated, isAdmin, renderDetailsSalesHotel);

module.exports = router;