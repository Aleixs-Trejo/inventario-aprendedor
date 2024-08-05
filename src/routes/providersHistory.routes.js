const {Router} = require("express");
const router = Router();

const {
  isAuthenticated,
  isAdmin
} = require("../helpers/auth");
const {
  renderProvidersHistory
} = require("../controllers/providersHistory.controller");

// Mostrar Historial de Proveedores
router.get("/providers/history", isAuthenticated, isAdmin, renderProvidersHistory);

module.exports = router;