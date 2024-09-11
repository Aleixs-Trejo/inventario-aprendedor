const {Router} = require("express");
const router = Router();

const {
  renderStatusRoomHistory
} = require("../controllers/statusRoomHistory.controller");

const {
  isAuthenticated,
  havePermission
} = require("../helpers/auth");

// Renderizar Historial de estados
router.get("/status-room/history", isAuthenticated, havePermission("historial-estado-habitacion"), renderStatusRoomHistory);

module.exports = router;