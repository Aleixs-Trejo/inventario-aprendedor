const {model} = require("mongoose");
const categorySchema = require("./Category");

const Category = model("Category", categorySchema);
module.exports = Category;