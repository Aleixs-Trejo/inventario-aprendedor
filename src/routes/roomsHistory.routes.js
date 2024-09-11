const {Router} = require("express");
const router = Router();

const {
  renderRoomsHistory
} = require("../controllers/roomsHistory.controller");

const {
  isAuthenticated,
  havePermission
} = require("../helpers/auth");

// Renderizar historial de habitaciones
router.get("/rooms/history", isAuthenticated, havePermission("historial-habitacion"), renderRoomsHistory);

module.exports = router;