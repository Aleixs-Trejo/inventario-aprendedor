const {Router} = require("express");
const router = Router();

const {
  renderProvidersHistory
} = require("../controllers/providersHistory.controller");

const {
  isAuthenticated,
  havePermission
} = require("../helpers/auth");

// Mostrar Historial de Proveedores
router.get("/providers/history", isAuthenticated, havePermission("historial-proveedor"), renderProvidersHistory);

module.exports = router;