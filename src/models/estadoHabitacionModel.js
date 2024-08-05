const {model} = require("mongoose");
const roomStateSchema = require("./EstadoHabitacion");

const RoomStatus = model("RoomState", roomStateSchema);

module.exports = RoomStatus;