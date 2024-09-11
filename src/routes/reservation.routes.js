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
  registerSaleReservation,
  cancelSaleReservation
} = require("../controllers/reservation.controller");

const {
  isAuthenticated,
  havePermission
} = require("../helpers/auth");

// Renderizar formulario de reserva de habitación
router.get("/reservation/:id/register", isAuthenticated, havePermission("crear-reserva"), renderRegisterReservation);

// Registar reserva de habitación
router.post("/reservation/:id/register", isAuthenticated, havePermission("crear-reserva"), registerReservation);

// Renderizar todas las habitaciones reservadas
router.get("/reservations", isAuthenticated, havePermission("ver-reserva"), renderAllReservations);

// Cancelar reserva
router.get("/reservation/:id/cancel", isAuthenticated, havePermission("cancelar-reserva"), cancelReservation);

// Mostrar detalles de la ocupación de una habitación
router.get("/reservation/:id/details", isAuthenticated, havePermission("ver-detalle-reserva"), renderDetailsReservation);

// Renderizar formulario de edición de reserva
router.get("/reservation/:id/edit", isAuthenticated, havePermission("editar-reserva"), renderEditReservation);

// Actualizar la reserva
router.post("/reservation/:id/edit", isAuthenticated, havePermission("editar-reserva"), updateReservation);

// Ingresar huesped
router.get("/reservation/:id/entering", isAuthenticated, havePermission("ingresar-huesped"), confirmEntering);

// Renderizar formulario de venta a la reserva
router.get("/reservation/:id/sale", isAuthenticated, havePermission("venta-reserva"), renderSaleReservation);

// Registrar venta a la reserva
router.post("/reservation/:id/sale", isAuthenticated, havePermission("venta-reserva"), registerSaleReservation);

// Cancelar venta a la reserva
router.get("/reservation/:id/sale/cancel", isAuthenticated, havePermission("venta-reserva"), cancelSaleReservation);

// Renderizar limpieza intermedia
router.get("/reservation/:id/clean", isAuthenticated, havePermission("limpieza-reserva"), renderCleaningRoomReservation);

// Registrar limpieza intermedia
router.post("/reservation/:id/cleaning", isAuthenticated, havePermission("limpieza-reserva"), cleaningRoomReservation);

// Finalizar limpieza intermedia
router.get("/reservation/:id/clean/finalize", isAuthenticated, havePermission("limpieza-reserva"), finalizeCleaningRoomReservation);

// Render reservation checkout
router.get("/reservation/:id/checkout", isAuthenticated, havePermission("finalizar-reserva"), renderCheckOutReservation);

// Checkout reservation
router.post("/reservation/:id/checkout", isAuthenticated, havePermission("finalizar-reserva"), checkOutReservation);

module.exports = router;