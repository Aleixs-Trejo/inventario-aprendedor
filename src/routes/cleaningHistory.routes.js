const {Router} = require('express');
const router = Router();

const {
  renderCleaningHistory
} = require('../controllers/cleaningHistory.controller');

const {
  isAuthenticated,
  isAdmin
} = require("../helpers/auth");

// Renderizar la vista de historial de limpiezas
router.get("/cleanings/history", isAuthenticated, isAdmin, renderCleaningHistory);

module.exports = router;