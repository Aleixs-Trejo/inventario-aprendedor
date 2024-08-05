const {model} = require("mongoose");
const roomSchema = require("./Room");

const Room = model("Room", roomSchema);

module.exports = Room;