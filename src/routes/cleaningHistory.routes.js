const {Router} = require('express');
const router = Router();

const {
  renderCleaningHistory
} = require('../controllers/cleaningHistory.controller');

const {
  isAuthenticated,
  havePermission
} = require("../helpers/auth");

// Renderizar la vista de historial de limpiezas
router.get("/cleanings/history", isAuthenticated, havePermission("historial-limpieza-intermedia"), renderCleaningHistory);

module.exports = router;