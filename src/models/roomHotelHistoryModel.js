const {model} = require("mongoose");
const roomHotelHistorySchema = require("./RoomHotelHistory");

const roomHotelHistoryModel = model("RoomHotelHistory", roomHotelHistorySchema);

module.exports = roomHotelHistoryModel;