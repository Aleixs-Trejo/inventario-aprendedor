const {model} = require("mongoose");
const salesHistorySchema = require("./SalesHistory");

const SalesHistory = model("SalesHistory", salesHistorySchema);
module.exports = SalesHistory;