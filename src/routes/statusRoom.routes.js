const {Router} = require('express');
const router = Router();

const {
  renderRegisterStatusRoom,
  registerStatusRoom,
  renderStatusRoom,
  renderEditStatusRoom,
  updateStatusRoom,
  renderDeleteStatusRoom,
  deleteStatusRoom
} = require("../controllers/statusRoom.controller");

const {
  isAuthenticated,
  isAdmin
} = require("../helpers/auth");

// Renderizar formulario de nuevo estado
router.get("/status-room/register", isAuthenticated, isAdmin, renderRegisterStatusRoom);
// Registrar nuevo estado
router.post("/status-room/register", isAuthenticated, isAdmin, registerStatusRoom);

// Mostrar listado de estados
router.get("/status-room", isAuthenticated, isAdmin, renderStatusRoom);

// Renderizar formulario de edición de estado
router.get("/status-room/:id/edit", isAuthenticated, isAdmin, renderEditStatusRoom);
// Actualizar estado
router.post("/status-room/:id/edit", isAuthenticated, isAdmin, updateStatusRoom);

// Renderizar confirmación de eliminación
router.get("/status-room/:id/confirm-delete", isAuthenticated, isAdmin, renderDeleteStatusRoom);
// Eliminar estado
router.get("/status-room/:id/delete", isAuthenticated, isAdmin, deleteStatusRoom);

module.exports = router;