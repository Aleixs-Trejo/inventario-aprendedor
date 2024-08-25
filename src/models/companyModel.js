const {model} = require("mongoose");
const CompanySchema = require("./Company");
const Company = model("Company", CompanySchema);

module.exports = Company;