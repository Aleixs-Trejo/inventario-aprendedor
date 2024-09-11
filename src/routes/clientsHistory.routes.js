const {Router} = require("express");
const router = Router();

const { renderClientsHistory } = require("../controllers/clientsHistory.controller");

const {
  isAuthenticated,
  havePermission
} = require("../helpers/auth");

// Mostrar todo el historial de clientes
router.get("/clients/history", isAuthenticated, havePermission("historial-cliente"), renderClientsHistory);

module.exports = router;