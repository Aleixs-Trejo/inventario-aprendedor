const {Router} = require('express');
const router = Router();

const {
  renderCheckOuts,
  closeCheckOuts,
  renderCheckOutDetails
} = require('../controllers/checkOutHotel.controller');

const {
  isAuthenticated,
  havePermission
} = require("../helpers/auth");

// Renderizar los checkouts
router.get("/checkouts", isAuthenticated, havePermission("ver-checkout-hotel"), renderCheckOuts);

// Cerrar checkOuts
router.get("/checkouts/close", isAuthenticated, havePermission("cerrar-checkout-hotel"), closeCheckOuts);

// Detalles de checkout
router.get("/checkout/:id/details", isAuthenticated, havePermission("ver-detalle-checkout-hotel"), renderCheckOutDetails);

module.exports = router;