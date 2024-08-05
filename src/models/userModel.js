const {model} = require("mongoose");
const userSchema = require("./User");

const User = model("User", userSchema);

User.schema.methods.encryptPassword = userSchema.methods.encryptPassword;
User.schema.methods.matchPassword = userSchema.methods.matchPassword;

module.exports = User;