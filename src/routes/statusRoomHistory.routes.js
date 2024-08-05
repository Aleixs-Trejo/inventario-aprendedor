const {Router} = require("express");
const router = Router();

const { renderStatusRoomHistory } = require("../controllers/statusRoomHistory.controller");

const { isAuthenticated, isAdmin } = require("../helpers/auth");

// Renderizar Historial de estados
router.get("/status-room/history", isAuthenticated, isAdmin, renderStatusRoomHistory);

module.exports = router;