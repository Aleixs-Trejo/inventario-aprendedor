const {model} = require("mongoose");

const providerHistorySchema = require("./ProviderHistory");
const ProviderHistory = model("ProviderHistory", providerHistorySchema);

module.exports = ProviderHistory;