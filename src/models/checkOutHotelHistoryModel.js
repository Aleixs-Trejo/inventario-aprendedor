const {model} = require("mongoose");

const checkOutHotelHistorySchema = require("./CheckOutHotelHistory");
const CheckOutHotelHistory = model("CheckOutHotelHistory", checkOutHotelHistorySchema);

module.exports = CheckOutHotelHistory;