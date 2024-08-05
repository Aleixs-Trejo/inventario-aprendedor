const {model} = require("mongoose");
const recordSchema = require("./Record");

const Record = model("Record", recordSchema);
module.exports = Record;