const {Router} = require("express");

const { renderRoomHotelHistory } = require("../controllers/roomHotelHistory.controller");

const {
  isAuthenticated,
  isAdmin
} = require("../helpers/auth");

const router = Router();

router.get("/rooms-hotel/history",isAuthenticated, isAdmin, renderRoomHotelHistory);

module.exports = router;