const { Router } = require("express");
const router = Router();

const {
  renderMaintenancesHistory
} = require("../controllers/maintenancesHistory.controller");

const {
  isAuthenticated,
  isAdmin
} = require("../helpers/auth");

// Renderizar vista del historial
router.get("/maintenances/history", isAuthenticated, isAdmin, renderMaintenancesHistory);

module.exports = router;