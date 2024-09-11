const {Router} = require("express");
const router = Router();

const { 
  renderUserHistory 
} = require("../controllers/usersHistory.controller");

const { 
  isAuthenticated, 
  havePermission 
} = require("../helpers/auth");

// Mostrar historial de usuarios
router.get("/users/history", isAuthenticated, havePermission("historial-usuario"), renderUserHistory);

module.exports = router;