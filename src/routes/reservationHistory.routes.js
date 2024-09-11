const { Router } = require("express");
const router = Router();

const {
  renderReservationHistory
} = require("../controllers/reservationHistory.controller");

const {
  isAuthenticated,
  havePermission
} = require("../helpers/auth");

// Renderizar historial de reservas de habitación
router.get("/reservations/history", isAuthenticated, havePermission("historial-reserva"), renderReservationHistory);

module.exports = router;