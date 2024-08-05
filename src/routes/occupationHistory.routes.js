const { Router } = require("express");
const router = Router();

const {
  renderOccupationHistory
} = require("../controllers/occupationHistory.controller");

const {
  isAuthenticated,
  isAdmin
} = require("../helpers/auth");

// Renderizar historial de ocupaciones de la habitación
router.get("/occupations/history", isAuthenticated, isAdmin, renderOccupationHistory);

module.exports = router;