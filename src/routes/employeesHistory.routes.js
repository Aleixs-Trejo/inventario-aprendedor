const {Router} = require("express");
const router = Router();

const {
  renderEmployeeHistory
} = require("../controllers/employeesHistory.controller");

const {
  isAuthenticated,
  isAdmin
} = require("../helpers/auth");

// Mostrar Historial
router.get("/employees/history", isAuthenticated, isAdmin, renderEmployeeHistory);

module.exports = router;