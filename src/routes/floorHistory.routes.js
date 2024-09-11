const {Router} = require('express');
const router = Router();

const {
  renderFloorHistory
} = require('../controllers/floorHistoryController');

const {
  isAuthenticated,
  havePermission
} = require("../helpers/auth");

// Mostrar historial de pisos
router.get("/floors/history", isAuthenticated, havePermission("historial-piso-hotel"), renderFloorHistory);

module.exports = router;