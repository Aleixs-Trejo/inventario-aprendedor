const {model} = require("mongoose");
const employeeHistorySchema = require("./EmployeeHistory");

const EmployeeHistorySchema = model("EmployeeHistory", employeeHistorySchema);

module.exports = EmployeeHistorySchema;