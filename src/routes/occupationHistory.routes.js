const { Router } = require("express");
const router = Router();

const {
  renderOccupationHistory
} = require("../controllers/occupationHistory.controller");

const {
  isAuthenticated,
  havePermission
} = require("../helpers/auth");

// Renderizar historial de ocupaciones de la habitación
router.get("/occupations/history", isAuthenticated, havePermission("historial-ocupacion"), renderOccupationHistory);

module.exports = router;