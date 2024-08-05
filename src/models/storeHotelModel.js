const {model} = require("mongoose");
const storeHotelSchema = require("./StoreHotel");
const StoreHotel = model("StoreHotel", storeHotelSchema);

module.exports = StoreHotel;