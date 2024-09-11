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
  havePermission
} = require("../helpers/auth");

// Renderizar formulario de nuevo estado
router.get("/status-room/register", isAuthenticated, havePermission("crear-estado-habitacion"), renderRegisterStatusRoom);
// Registrar nuevo estado
router.post("/status-room/register", isAuthenticated, havePermission("crear-estado-habitacion"), registerStatusRoom);

// Mostrar listado de estados
router.get("/status-room", isAuthenticated, havePermission("ver-estado-habitacion"), renderStatusRoom);

// Renderizar formulario de edición de estado
router.get("/status-room/:id/edit", isAuthenticated, havePermission("editar-estado-habitacion"), renderEditStatusRoom);
// Actualizar estado
router.post("/status-room/:id/edit", isAuthenticated, havePermission("editar-estado-habitacion"), updateStatusRoom);

// Renderizar confirmación de eliminación
router.get("/status-room/:id/confirm-delete", isAuthenticated, havePermission("eliminar-estado-habitacion"), renderDeleteStatusRoom);
// Eliminar estado
router.get("/status-room/:id/delete", isAuthenticated, havePermission("eliminar-estado-habitacion"), deleteStatusRoom);

module.exports = router;