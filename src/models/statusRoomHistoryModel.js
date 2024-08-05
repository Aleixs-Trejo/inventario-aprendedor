const {model} = require("mongoose");
const statusRoomHistorySchema = require("./StatusRoomHistory");

const StatusRoomHistory = model("StatusRoomHistory", statusRoomHistorySchema);

module.exports = StatusRoomHistory;