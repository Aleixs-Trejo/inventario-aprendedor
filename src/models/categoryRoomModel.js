const {model} = require("mongoose");
const categoryRoomSchema = require("./CategoryRoom");

const CategoryRoom = model("CategoryRoom", categoryRoomSchema);

module.exports = CategoryRoom;