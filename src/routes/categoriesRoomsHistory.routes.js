const {Router} = require("express");
const router = Router();

const { renderCategoriesRoomHistory } = require("../controllers/categoriesRoomHistory.controller");

const { isAuthenticated, isAdmin } = require("../helpers/auth");

// Renderizar el historial de categorías de habitación
router.get("/categories-room/history", isAuthenticated, isAdmin, renderCategoriesRoomHistory)


module.exports = router;