const {model} = require("mongoose");
const saleHotelSchema = require("./SaleHotel");

const SaleHotel = model("SaleHotel", saleHotelSchema);

module.exports = SaleHotel;