const {model} = require("mongoose");

const userHistorySchema = require("./UserHistory");
const UserHistory = model("UserHistory", userHistorySchema);

module.exports = UserHistory;