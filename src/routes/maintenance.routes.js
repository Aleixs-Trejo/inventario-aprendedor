const {Router} = require('express');
const router = Router();

const {
  renderRegisterMaintenanceRoom,
  registerMaintenanceRoom,
  renderDetailMaintenanceRoom,
  finalizeMaintenanceRoom,
  renderMaintenances
} = require('../controllers/maintenanceRoomcontroller');

const {
  isAuthenticated,
  isAdmin
} = require("../helpers/auth");

// Renderizar vista de mantenimiento
router.get("/maintenance/:id/register", isAuthenticated, isAdmin, renderRegisterMaintenanceRoom);
// Registrar Mantenimiento
router.post("/maintenance/:id/register", isAuthenticated, isAdmin, registerMaintenanceRoom);

// Mostrar detalle de mantenimiento
router.get("/maintenance/:id/details", isAuthenticated, isAdmin, renderDetailMaintenanceRoom);

// Finalizar mantenimiento
router.get("/maintenance/:id/finalize", isAuthenticated, isAdmin, finalizeMaintenanceRoom);

// Mostrar mantenimientos activos
router.get("/maintenances", isAuthenticated, isAdmin, renderMaintenances);

module.exports = router;