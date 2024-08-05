const {Router} = require('express');
const router = Router();

const {
  renderFloorHistory
} = require('../controllers/floorHistoryController');

const {
  isAuthenticated,
  isAdmin
} = require("../helpers/auth");

// Mostrar historial de pisos
router.get("/floors/history", isAuthenticated, isAdmin, renderFloorHistory);

module.exports = router;