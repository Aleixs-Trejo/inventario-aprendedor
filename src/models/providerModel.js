const {model} = require("mongoose");
const providerSchema = require("./Provider");

const Provider = model("Provider", providerSchema);
module.exports = Provider;