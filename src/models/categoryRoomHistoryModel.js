const {model} = require("mongoose");
const categoryRoomHistorySchema = require("./CategoryRoomHistory");

const CategoryRoomHistory = model("CategoryRoomHistory", categoryRoomHistorySchema);

module.exports = CategoryRoomHistory;