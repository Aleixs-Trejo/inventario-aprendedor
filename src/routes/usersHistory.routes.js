const {Router} = require("express");
const router = Router();

const { 
  renderUserHistory 
} = require("../controllers/usersHistory.controller");

const { 
  isAuthenticated, 
  isAdmin 
} = require("../helpers/auth");

// Mostrar historial de usuarios
router.get("/users/history", isAuthenticated, isAdmin, renderUserHistory);

module.exports = router;