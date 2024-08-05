const {model} = require("mongoose");
const statusRoomSchema = require("./StatusRoom");

const StatusRoom = model("StatusRoom", statusRoomSchema);

module.exports = StatusRoom;