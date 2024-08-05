const { Router } = require("express");
const router = Router();

const {
  renderRegisterOccupation,
  registerOccupation,
  renderAllOccupations,
  renderDetailOccupation,
  renderCleaningRoomOccupation,
  cleaningRoomOccupation,
  finalizeCleaningRoomOccupation,
  renderEditOccupation,
  updateOccupation,
  renderCheckOutHotel,
  checkOutHotel,
  renderSaleOccupation,
  registerSaleOccupation,
  cancelSaleOccupation,
} = require("../controllers/occupation.controller");

const {
  isAuthenticated,
  isAdmin
} = require("../helpers/auth");

// Renderizar formulario de ocupación de la habitación
router.get("/occupation/:id/register", isAuthenticated, isAdmin, renderRegisterOccupation);
// Registar ocupación de la habitación
router.post("/occupation/:id/register", isAuthenticated, isAdmin, registerOccupation);

// Renderizar todas las ocupaciones de la habitación
router.get("/occupations", isAuthenticated, isAdmin, renderAllOccupations);

// Renderizar detalles de una ocupación de la habitación
router.get("/occupation/:id/details", isAuthenticated, isAdmin, renderDetailOccupation);

// Renderizar formulario para editar la ocupación de la habitación
router.get("/occupation/:id/edit", isAuthenticated, isAdmin, renderEditOccupation);

// Actualizar la ocupación de la habitación
router.post("/occupation/:id/edit", isAuthenticated, isAdmin, updateOccupation);

// Renderizar formulario de venta de la ocupación
router.get("/occupation/:id/sale", isAuthenticated, isAdmin, renderSaleOccupation);

// Registrar venta de la ocupación
router.post("/occupation/:id/sale", isAuthenticated, isAdmin, registerSaleOccupation);

// Cancelar venta de la ocupación
router.get("/occupation/sale/:id/cancel", isAuthenticated, isAdmin, cancelSaleOccupation);

// Renderizar formulario de limpieza intermedia
router.get("/occupation/:id/clean", isAuthenticated, isAdmin, renderCleaningRoomOccupation);

// Limpieza intermedia de la habitación
router.post("/occupation/:id/cleaning", isAuthenticated, isAdmin, cleaningRoomOccupation);

// Finalizar limpieza intermedia de la habitación
router.get("/occupation/:id/clean/finalize", isAuthenticated, isAdmin, finalizeCleaningRoomOccupation);

// Renderizar checkout la ocupación
router.get("/occupation/:id/checkout", isAuthenticated, isAdmin, renderCheckOutHotel);

// Checkout la ocupación
router.post("/occupation/:id/checkout", isAuthenticated, isAdmin, checkOutHotel);

module.exports = router;