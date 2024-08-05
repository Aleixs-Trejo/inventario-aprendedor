const {model} = require("mongoose");
const roomHotelSchema = require("./RoomHotel");

const roomHotelModel = model("RoomHotel", roomHotelSchema);

module.exports = roomHotelModel;