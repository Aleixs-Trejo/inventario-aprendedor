const {Router} = require("express");
const router = Router();

const {
  renderRegisterRoomHotel,
  registerRoomHotel,
  renderRoomHotel,
  renderEditRoomHotel,
  updateRoomHotel,
  renderDeleteRoomHotel,
  deleteRoomHotel
} = require("../controllers/roomHotel.controller");

const {
  isAuthenticated,
  isAdmin
} = require("../helpers/auth");

// Renderizar formulario de nueva habitación de hotel
router.get("/rooms-hotel/register", isAuthenticated, isAdmin, renderRegisterRoomHotel);
// Registrar nueva habitación de hotel
router.post("/rooms-hotel/register", isAuthenticated, isAdmin, registerRoomHotel);

// Renderizar lista de habitaciones de hotel
router.get("/rooms-hotel", isAuthenticated, isAdmin, renderRoomHotel);

// Renderizar formulario de edición de habitación de hotel
router.get("/rooms-hotel/:id/edit", isAuthenticated, isAdmin, renderEditRoomHotel);
// Actualizar la habitación de hotel
router.post("/rooms-hotel/:id/edit", isAuthenticated, isAdmin, updateRoomHotel);

// Renderizar confirmación de eliminación de habitación de hotel
router.get("/rooms-hotel/:id/confirm-delete", isAuthenticated, isAdmin, renderDeleteRoomHotel);
// Eliminar la habitación de hotel
router.get("/rooms-hotel/:id/delete", isAuthenticated, isAdmin, deleteRoomHotel);

module.exports = router;