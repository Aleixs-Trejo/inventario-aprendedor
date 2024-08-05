const {Router} = require('express');
const router = Router();

const {
  renderBalanceHotel
} = require("../controllers/balanceHotel.controller");

const {
  isAuthenticated,
  isAdmin
} = require("../helpers/auth")

// Renderizar balances del hotel
router.get("/hotel/balance", isAuthenticated, isAdmin, renderBalanceHotel);

module.exports = router;