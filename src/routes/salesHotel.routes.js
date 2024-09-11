const {Router} = require("express");
const router = Router();

const {
  renderAllSalesHotel,
  renderDetailsSalesHotel
} = require("../controllers/salesHotel.controller");

const {
  isAuthenticated,
  havePermission
} = require("../helpers/auth");

// Renderizar las ventas a la habitación
router.get("/hotel/sales", isAuthenticated, havePermission("ver-venta-hotel"), renderAllSalesHotel);

// Mostrar detalles de una venta
router.get("/hotel/sales/:id/details", isAuthenticated, havePermission("ver-detalle-venta-hotel"), renderDetailsSalesHotel);

module.exports = router;