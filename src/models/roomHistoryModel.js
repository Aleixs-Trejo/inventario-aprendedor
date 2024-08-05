const {model} = require("mongoose");
const roomHistorySchema = require("./RoomHistory");

const RoomHistory = model("RoomHistory", roomHistorySchema);

module.exports = RoomHistory;