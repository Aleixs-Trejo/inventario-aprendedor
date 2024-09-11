const {Router} = require('express');
const router = Router();

const {
  renderRegisterFloor,
  registerFloor,
  renderFloors,
  renderEditFloor,
  updateFloor,
  renderDeleteFloor,
  deleteFloor
} = require('../controllers/floor.controller');

const {
  isAuthenticated,
  havePermission
} = require("../helpers/auth");

// Renderizar formulario de nuevo piso
router.get("/floors/register", isAuthenticated, havePermission("crear-piso-hotel"), renderRegisterFloor);
// Registrar nuevo piso
router.post("/floors/register", isAuthenticated, havePermission("crear-piso-hotel"), registerFloor);

// Mostrar pisos
router.get("/floors", isAuthenticated, havePermission("ver-piso-hotel"), renderFloors);

// Renderizar formulario de edición de piso
router.get("/floor/:id/edit", isAuthenticated, havePermission("editar-piso-hotel"), renderEditFloor);
// Actualizar el piso
router.post("/floor/:id/edit", isAuthenticated, havePermission("editar-piso-hotel"), updateFloor);

// Renderizar confirmación de eliminación de piso
router.get("/floor/:id/confirm-delete", isAuthenticated, havePermission("eliminar-piso-hotel"), renderDeleteFloor);
// Eliminar piso
router.get("/floor/:id/delete", isAuthenticated, havePermission("eliminar-piso-hotel"), deleteFloor);

module.exports = router;