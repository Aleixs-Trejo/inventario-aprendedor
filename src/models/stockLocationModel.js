const {model} = require("mongoose");
const stockLocationSchema = require("./StockLocation");

const StockLocation = model("StockLocation", stockLocationSchema);
module.exports = StockLocation;