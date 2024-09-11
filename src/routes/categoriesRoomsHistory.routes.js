const {Router} = require("express");
const router = Router();

const {
  renderCategoriesRoomHistory
} = require("../controllers/categoriesRoomHistory.controller");

const {
  isAuthenticated,
  havePermission
} = require("../helpers/auth");

// Renderizar el historial de categorías de habitación
router.get("/categories-room/history", isAuthenticated, havePermission("historial-categoria-habitacion"), renderCategoriesRoomHistory);


module.exports = router;