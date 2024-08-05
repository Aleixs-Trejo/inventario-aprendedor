const {model} = require("mongoose");

const checkOutHotelSchema = require("./CheckOutHotel");
const CheckOutHotel = model("CheckOutHotel", checkOutHotelSchema);

module.exports = CheckOutHotel;