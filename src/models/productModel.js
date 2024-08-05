const {model} = require("mongoose");
const productSchema = require("./Product");

const Product = model("Product", productSchema);

module.exports = Product;