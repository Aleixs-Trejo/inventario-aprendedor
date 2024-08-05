const {model} = require("mongoose");
const cleaningSchema = require("./Cleaning");

const Cleaning = model("Cleaning", cleaningSchema);

module.exports = Cleaning;