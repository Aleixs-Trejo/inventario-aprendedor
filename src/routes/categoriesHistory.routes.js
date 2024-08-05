const {Router} = require("express");
const router = Router();

const { renderCategoryHistory } = require("../controllers/categoriesHistory.controller");

const {
  isAuthenticated,
  isAdmin
} = require("../helpers/auth")

// Mostrar historial de categorias
router.get("/categories/history", isAuthenticated, isAdmin, renderCategoryHistory);

module.exports = router;