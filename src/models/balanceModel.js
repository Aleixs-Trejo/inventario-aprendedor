const {model} = require("mongoose");
const balanceSchema = require("./Balance");

const Balance = model("Balance", balanceSchema);

module.exports = Balance;