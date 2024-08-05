const {model} = require("mongoose");
const clientSchema = require("./Client");

const Client =  model("Client", clientSchema);
module.exports = Client;