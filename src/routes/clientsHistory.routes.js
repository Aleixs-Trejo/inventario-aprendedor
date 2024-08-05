const {Router} = require("express");
const router = Router();

const { renderClientsHistory } = require("../controllers/clientsHistory.controller");

const {
  isAuthenticated,
  isAdmin
} = require("../helpers/auth");

// Mostrar todo el historial de clientes
router.get("/clients/history", isAuthenticated, isAdmin, renderClientsHistory);

module.exports = router;