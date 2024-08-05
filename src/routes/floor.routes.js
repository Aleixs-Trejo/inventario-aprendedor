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
  isAdmin
} = require("../helpers/auth");

// Renderizar formulario de nuevo piso
router.get("/floors/register", isAuthenticated, isAdmin, renderRegisterFloor);
// Registrar nuevo piso
router.post("/floors/register", isAuthenticated, isAdmin, registerFloor);

// Mostrar pisos
router.get("/floors", isAuthenticated, isAdmin, renderFloors);

// Renderizar formulario de edición de piso
router.get("/floor/:id/edit", isAuthenticated, isAdmin, renderEditFloor);
// Actualizar el piso
router.post("/floor/:id/edit", isAuthenticated, isAdmin, updateFloor);

// Renderizar confirmación de eliminación de piso
router.get("/floor/:id/confirm-delete", isAuthenticated, isAdmin, renderDeleteFloor);
// Eliminar piso
router.get("/floor/:id/delete", isAuthenticated, isAdmin, deleteFloor);

module.exports = router;