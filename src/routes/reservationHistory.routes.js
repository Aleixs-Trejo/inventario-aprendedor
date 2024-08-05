const { Router } = require("express");
const router = Router();

const {
  renderReservationHistory
} = require("../controllers/reservationHistory.controller");

const {
  isAuthenticated,
  isAdmin
} = require("../helpers/auth");

// Renderizar historial de reservas de habitación
router.get("/reservations/history", isAuthenticated, isAdmin, renderReservationHistory);

module.exports = router;