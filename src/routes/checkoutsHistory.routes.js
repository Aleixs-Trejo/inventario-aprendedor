const {Router} = require('express');
const router = Router();

const {
  renderCheckOutHotelHistory
} = require('../controllers/checkOutHotelHistory.controller');

const {
  isAuthenticated,
  havePermission
} = require("../helpers/auth");

// Renderizar la vista de historial de checkouts
router.get("/checkouts/history", isAuthenticated, havePermission("historial-checkout-hotel"), renderCheckOutHotelHistory);

module.exports = router;