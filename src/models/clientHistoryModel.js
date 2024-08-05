const {model} = require("mongoose");
const clientHistorySchema = require("./ClientHistory");

const ClientHistorySchema = model("clientHistory", clientHistorySchema);

module.exports = ClientHistorySchema;