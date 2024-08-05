const {Router} = require("express");
const router = Router();

const { renderHotel } = require("../controllers/hotel.controller");

const { isAuthenticated, isAdmin } = require("../helpers/auth");

// Mostrar la página de inicio
router.get("/hotel", isAuthenticated, isAdmin, renderHotel);

module.exports = router;