const {model} = require("mongoose");

const balanceHotelHistorySchema = require("./BalanceHotelHistory");
const BalanceHotelHistory = model("BalanceHotelHistory", balanceHotelHistorySchema);

module.exports = BalanceHotelHistory;