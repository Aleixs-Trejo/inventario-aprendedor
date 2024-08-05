const {model} = require("mongoose");
const storeHotelHistorySchema = require("./StoreHotelHistory");
const StoreHotelHistory = model("StoreHotelHistory", storeHotelHistorySchema);

module.exports = StoreHotelHistory;