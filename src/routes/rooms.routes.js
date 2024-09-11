const {Router} = require("express");
const router = Router();

const {
  renderRegisterRoom,
  registerRoom,
  renderRooms,
  renderEditRoom,
  updateRoom,
  renderDeleteRoom,
  deleteRoom,
  renderRoomDetails
} = require("../controllers/rooms.controller");

const {
  isAuthenticated,
  havePermission
} = require("../helpers/auth");

// Renderizar formulario de nueva habitación
router.get("/rooms/register", isAuthenticated, havePermission("crear-habitacion"), renderRegisterRoom);
// Registrar nueva habitación
router.post("/rooms/register", isAuthenticated, havePermission("crear-habitacion"), registerRoom);

// Renderizar habitaciones
router.get("/rooms", isAuthenticated, havePermission("ver-habitacion"), renderRooms);

// Renderizar formulario de edición de habitación
router.get("/rooms/:id/edit", isAuthenticated, havePermission("editar-habitacion"), renderEditRoom);
// Actualizar habitación
router.post("/rooms/:id/edit", isAuthenticated, havePermission("editar-habitacion"), updateRoom);

// Mostrar detalles de una habitación
router.get("/rooms/:id/details", isAuthenticated, havePermission("ver-detalle-habitacion"), renderRoomDetails);

// Renderizar confirmación de eliminación de habitación
router.get("/rooms/:id/confirm-delete", isAuthenticated, havePermission("eliminar-habitacion"), renderDeleteRoom);
// Eliminar habitación
router.get("/rooms/:id/delete", isAuthenticated, havePermission("eliminar-habitacion"), deleteRoom);

module.exports = router;