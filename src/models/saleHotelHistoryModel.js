const {model} = require("mongoose");
const saleHotelHistorySchema = require("./SaleHotelHistory");

const SaleHotelHistory = model("SaleHotelHistory", saleHotelHistorySchema);

module.exports = SaleHotelHistory;