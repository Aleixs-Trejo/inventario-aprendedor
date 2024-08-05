const { Router } = require("express");
const router = Router();

const {
  renderRegisterReservation,
  registerReservation,
  renderDetailsReservation,
  renderAllReservations,
  renderCleaningRoomReservation,
  cleaningRoomReservation,
  finalizeCleaningRoomReservation,
  renderEditReservation,
  updateReservation,
  confirmEntering,
  renderCheckOutReservation,
  checkOutReservation,
  cancelReservation,
  renderSaleReservation,
  registerSaleReservation
} = require("../controllers/reservation.controller");

const {
  isAuthenticated,
  isAdmin
} = require("../helpers/auth");

// Renderizar formulario de reserva de habitación
router.get("/reservation/:id/register", isAuthenticated, isAdmin, renderRegisterReservation);

// Registar reserva de habitación
router.post("/reservation/:id/register", isAuthenticated, isAdmin, registerReservation);

// Renderizar todas las habitaciones reservadas
router.get("/reservations", isAuthenticated, isAdmin, renderAllReservations);

// Cancelar reserva
router.get("/reservation/:id/cancel", isAuthenticated, isAdmin, cancelReservation);

// Mostrar detalles de la ocupación de una habitación
router.get("/reservation/:id/details", isAuthenticated, isAdmin, renderDetailsReservation);

// Renderizar formulario de edición de reserva
router.get("/reservation/:id/edit", isAuthenticated, isAdmin, renderEditReservation);

// Actualizar la reserva
router.post("/reservation/:id/edit", isAuthenticated, isAdmin, updateReservation);

// Ingresar huesped
router.get("/reservation/:id/entering", isAuthenticated, isAdmin, confirmEntering);

// Renderizar formulario de venta a la reserva
router.get("/reservation/:id/sale", isAuthenticated, isAdmin, renderSaleReservation);

// Registrar venta a la reserva
router.post("/reservation/:id/sale", isAuthenticated, isAdmin, registerSaleReservation);

// Renderizar limpieza intermedia
router.get("/reservation/:id/clean", isAuthenticated, isAdmin, renderCleaningRoomReservation);

// Registrar limpieza intermedia
router.post("/reservation/:id/cleaning", isAuthenticated, isAdmin, cleaningRoomReservation);

// Finalizar limpieza intermedia
router.get("/reservation/:id/clean/finalize", isAuthenticated, isAdmin, finalizeCleaningRoomReservation);

// Render reservation checkout
router.get("/reservation/:id/checkout", isAuthenticated, isAdmin, renderCheckOutReservation);

// Checkout reservation
router.post("/reservation/:id/checkout", isAuthenticated, isAdmin, checkOutReservation);

module.exports = router;