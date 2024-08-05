const { model } = require("mongoose");
const employeeSchema = require("./Employee");

const Employee = model("Employee", employeeSchema);
module.exports = Employee;