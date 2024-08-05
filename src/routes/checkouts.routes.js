const {Router} = require('express');
const router = Router();

const {
  renderCheckOuts,
  closeCheckOuts,
  renderCheckOutDetails
} = require('../controllers/checkOutHotel.controller');

const {
  isAuthenticated,
  isAdmin
} = require("../helpers/auth");

// Renderizar los checkouts
router.get("/checkouts", isAuthenticated, isAdmin, renderCheckOuts);

// Cerrar checkOuts
router.get("/checkouts/close", isAuthenticated, isAdmin, closeCheckOuts);

// Detalles de checkout
router.get("/checkout/:id/details", isAuthenticated, isAdmin, renderCheckOutDetails);

module.exports = router;