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
  isAdmin
} = require("../helpers/auth");

// Renderizar formulario de nueva habitación
router.get("/rooms/register", isAuthenticated, isAdmin, renderRegisterRoom);
// Registrar nueva habitación
router.post("/rooms/register", isAuthenticated, isAdmin, registerRoom);

// Renderizar habitaciones
router.get("/rooms", isAuthenticated, isAdmin, renderRooms);

// Renderizar formulario de edición de habitación
router.get("/rooms/:id/edit", isAuthenticated, isAdmin, renderEditRoom);
// Actualizar habitación
router.post("/rooms/:id/edit", isAuthenticated, isAdmin, updateRoom);

// Mostrar detalles de una habitación
router.get("/rooms/:id/details", isAuthenticated, isAdmin, renderRoomDetails);

// Renderizar confirmación de eliminación de habitación
router.get("/rooms/:id/confirm-delete", isAuthenticated, isAdmin, renderDeleteRoom);
// Eliminar habitación
router.get("/rooms/:id/delete", isAuthenticated, isAdmin, deleteRoom);

module.exports = router;