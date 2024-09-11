const {Router} = require("express");
const router = Router();

const { renderCategoryHistory } = require("../controllers/categoriesHistory.controller");

const {
  isAuthenticated,
  havePermission
} = require("../helpers/auth")

// Mostrar historial de categorias
router.get("/categories/history", isAuthenticated, havePermission("historial-categoria"), renderCategoryHistory);

module.exports = router;