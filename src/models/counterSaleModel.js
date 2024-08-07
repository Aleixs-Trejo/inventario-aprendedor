const {model} = require("mongoose");
const counterSaleSchema = require("./CounterSale");

const CounterSale = model("CounterSale", counterSaleSchema);

module.exports = CounterSale;