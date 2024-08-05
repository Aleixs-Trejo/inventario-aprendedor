const {model} = require("mongoose");
const storeSchema = require("./Store");

const Store = model("Store", storeSchema);
module.exports = Store;