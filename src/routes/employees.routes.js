const {Router} = require("express");
const router = Router();

const {
  renderRegisterEmployee,
  registerEmployee,
  renderEmployees,
  renderEditEmployee,
  updateEmployee,
  renderDetailsEmployee,
  deleteEmployee,
  renderDeleteEmployee,
  exportToExcel
} = require("../controllers/employees.controller");

const {
  isAuthenticated,
  havePermission
} = require("../helpers/auth");

//Registro de trabajador
router.get("/employees/register", isAuthenticated, havePermission("crear-trabajador"), renderRegisterEmployee);
router.post("/employees/register", isAuthenticated, havePermission("crear-trabajador"), registerEmployee);

//Mostrar Trabajadores
router.get("/employees", isAuthenticated, havePermission("ver-trabajador"), renderEmployees);

//Editar Trabajador
router.get("/employees/:id/edit", isAuthenticated, havePermission("editar-trabajador"), renderEditEmployee);
router.post("/employees/:id/edit", isAuthenticated, havePermission("editar-trabajador"), updateEmployee);

// Mostrar detalles del trabajador
router.get("/employees/:id/details", isAuthenticated, havePermission("ver-trabajador-detalle"), renderDetailsEmployee);

//Eliminar Trabajador
router.get("/employees/:id/confirm-delete", isAuthenticated, havePermission("eliminar-trabajador"), renderDeleteEmployee);
router.get("/employees/:id/delete", isAuthenticated, havePermission("eliminar-trabajador"), deleteEmployee);

// Exportar Excel
router.get("/employees/export-excel", isAuthenticated, havePermission("exportar-trabajador"), exportToExcel);

module.exports = router;