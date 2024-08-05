const {Router} = require('express');
const router = Router();

const {
  renderCheckOutHotelHistory
} = require('../controllers/checkOutHotelHistory.controller');

const {
  isAuthenticated,
  isAdmin
} = require("../helpers/auth");

// Renderizar la vista de historial de checkouts
router.get("/checkouts/history", isAuthenticated, isAdmin, renderCheckOutHotelHistory);

module.exports = router;