const {model} = require("mongoose");

const balanceHotelSchema = require("./BalanceHotel");
const BalanceHotel = model("BalanceHotel", balanceHotelSchema);

module.exports = BalanceHotel;