const { Router } = require("express");
const router = Router();

const {
  renderMaintenancesHistory
} = require("../controllers/maintenancesHistory.controller");

const {
  isAuthenticated,
  havePermission
} = require("../helpers/auth");

// Renderizar vista del historial
router.get("/maintenances/history", isAuthenticated, havePermission("historial-mantenimiento"), renderMaintenancesHistory);

module.exports = router;