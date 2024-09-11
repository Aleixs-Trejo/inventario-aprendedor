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
  havePermission
} = require("../helpers/auth");

// Renderizar formulario de ocupación de la habitación
router.get("/occupation/:id/register", isAuthenticated, havePermission("crear-ocupacion"), renderRegisterOccupation);
// Registar ocupación de la habitación
router.post("/occupation/:id/register", isAuthenticated, havePermission("crear-ocupacion"), registerOccupation);

// Renderizar todas las ocupaciones de la habitación
router.get("/occupations", isAuthenticated, havePermission("ver-ocupacion"), renderAllOccupations);

// Renderizar detalles de una ocupación de la habitación
router.get("/occupation/:id/details", isAuthenticated, havePermission("ver-detalle-ocupacion"), renderDetailOccupation);

// Renderizar formulario para editar la ocupación de la habitación
router.get("/occupation/:id/edit", isAuthenticated, havePermission("editar-ocupacion"), renderEditOccupation);

// Actualizar la ocupación de la habitación
router.post("/occupation/:id/edit", isAuthenticated, havePermission("editar-ocupacion"), updateOccupation);

// Renderizar formulario de venta de la ocupación
router.get("/occupation/:id/sale", isAuthenticated, havePermission("venta-ocupacion"), renderSaleOccupation);

// Registrar venta de la ocupación
router.post("/occupation/:id/sale", isAuthenticated, havePermission("venta-ocupacion"), registerSaleOccupation);

// Cancelar venta de la ocupación
router.get("/occupation/sale/:id/cancel", isAuthenticated, havePermission("venta-ocupacion"), cancelSaleOccupation);

// Renderizar formulario de limpieza intermedia
router.get("/occupation/:id/clean", isAuthenticated, havePermission("limpieza-ocupacion"), renderCleaningRoomOccupation);

// Limpieza intermedia de la habitación
router.post("/occupation/:id/cleaning", isAuthenticated, havePermission("limpieza-ocupacion"), cleaningRoomOccupation);

// Finalizar limpieza intermedia de la habitación
router.get("/occupation/:id/clean/finalize", isAuthenticated, havePermission("limpieza-ocupacion"), finalizeCleaningRoomOccupation);

// Renderizar checkout la ocupación
router.get("/occupation/:id/checkout", isAuthenticated, havePermission("finalizar-ocupacion"), renderCheckOutHotel);

// Checkout la ocupación
router.post("/occupation/:id/checkout", isAuthenticated, havePermission("finalizar-ocupacion"), checkOutHotel);

module.exports = router;