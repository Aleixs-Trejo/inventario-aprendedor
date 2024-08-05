const {model} = require("mongoose");
const cleaningHistorySchema = require("./CleaningHistory");

const CleaningHistory = model("CleaningHistory", cleaningHistorySchema);

module.exports = CleaningHistory;