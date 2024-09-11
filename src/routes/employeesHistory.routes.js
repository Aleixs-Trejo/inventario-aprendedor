const {Router} = require("express");
const router = Router();

const {
  renderEmployeeHistory
} = require("../controllers/employeesHistory.controller");

const {
  isAuthenticated,
  havePermission
} = require("../helpers/auth");

// Mostrar Historial
router.get("/employees/history", isAuthenticated, havePermission("historial-trabajador"), renderEmployeeHistory);

module.exports = router;