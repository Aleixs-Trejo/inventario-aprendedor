const {model} = require("mongoose");

const productHistorySchema = require("./ProductHistory");
const ProductHistory = model("ProductHistory", productHistorySchema);

module.exports = ProductHistory;