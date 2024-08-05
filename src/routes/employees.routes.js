const {Router} = require("express");
const router = Router();

const {
  renderRegisterEmployee,
  registerEmployee,
  renderEmployees,
  renderEditEmployee,
  updateEmployee,
  deleteEmployee,
  renderDeleteEmployee,
  exportToExcel
} = require("../controllers/employees.controller");

const {
  isAuthenticated,
  isAdmin
} = require("../helpers/auth");

//Registro de trabajador
router.get("/employees/register", renderRegisterEmployee);
router.post("/employees/register", registerEmployee);

//Mostrar Trabajadores
router.get("/employees", isAuthenticated, isAdmin, renderEmployees);

//Editar Trabajador
router.get("/employees/:id/edit", isAuthenticated, isAdmin, renderEditEmployee);
router.post("/employees/:id/edit", isAuthenticated, isAdmin, updateEmployee);

//Eliminar Trabajador
router.get("/employees/:id/confirm-delete", isAuthenticated, isAdmin, renderDeleteEmployee);
router.get("/employees/:id/delete", isAuthenticated, isAdmin, deleteEmployee);

// Exportar Excel
router.get("/employees/export-excel", isAuthenticated, isAdmin, exportToExcel);

module.exports = router;