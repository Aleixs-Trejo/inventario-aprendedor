const {Router} = require('express');
const router = Router();

const {
  renderBalanceHotel
} = require("../controllers/balanceHotel.controller");

const {
  isAuthenticated,
  havePermission
} = require("../helpers/auth")

// Renderizar balances del hotel
router.get("/hotel/balance", isAuthenticated, havePermission("ver-balance-hotel"), renderBalanceHotel);

module.exports = router;