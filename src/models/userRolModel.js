const { model } = require("mongoose");

const userRolSchema = require("./UserRol");

const UserRol = model("UserRol", userRolSchema);
module.exports = UserRol;