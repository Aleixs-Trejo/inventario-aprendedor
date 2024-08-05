const {Router} = require("express");
const router = Router();

const { renderRoomsHistory } = require("../controllers/roomsHistory.controller");

const { isAuthenticated, isAdmin } = require("../helpers/auth");

// Renderizar historial de habitaciones
router.get("/rooms/history", isAuthenticated, isAdmin, renderRoomsHistory);

module.exports = router;