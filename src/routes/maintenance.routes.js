const {Router} = require('express');
const router = Router();

const {
  renderRegisterMaintenanceRoom,
  registerMaintenanceRoom,
  renderDetailMaintenanceRoom,
  finalizeMaintenanceRoom,
  renderMaintenances
} = require('../controllers/maintenanceRoom.controller');

const {
  isAuthenticated,
  havePermission
} = require("../helpers/auth");

// Renderizar vista de mantenimiento
router.get("/maintenance/:id/register", isAuthenticated, havePermission("crear-mantenimiento"), renderRegisterMaintenanceRoom);
// Registrar Mantenimiento
router.post("/maintenance/:id/register", isAuthenticated, havePermission("crear-mantenimiento"), registerMaintenanceRoom);

// Mostrar detalle de mantenimiento
router.get("/maintenance/:id/details", isAuthenticated, havePermission("ver-detalle-mantenimiento"), renderDetailMaintenanceRoom);

// Finalizar mantenimiento
router.get("/maintenance/:id/finalize", isAuthenticated, havePermission("finalizar-mantenimiento"), finalizeMaintenanceRoom);

// Mostrar mantenimientos activos
router.get("/maintenances", isAuthenticated, havePermission("ver-mantenimiento"), renderMaintenances);

module.exports = router;