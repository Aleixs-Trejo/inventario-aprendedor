const {model} = require("mongoose");
const saleSchema = require("./Sale");

const Sale = model("Sale", saleSchema);
module.exports = Sale;