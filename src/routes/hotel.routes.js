const {Router} = require("express");
const router = Router();

const { renderHotel } = require("../controllers/hotel.controller");

const {
  isAuthenticated
} = require("../helpers/auth");

// Mostrar la página de inicio
router.get("/hotel", isAuthenticated, renderHotel);

module.exports = router;