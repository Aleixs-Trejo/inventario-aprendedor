const {Router} = require("express");
const router = Router();

const {
  renderRegisterProvider,
  registerProvider,
  renderProviders,
  renderEditProvider,
  updateProvider,
  deleteProvider,
  renderDeleteProvider,
  exportToExcel,
  renderProviderDetails
} = require("../controllers/providers.controller");

const {
  isAuthenticated,
  havePermission
} = require("../helpers/auth");

const {
  maxProviders
} = require("../helpers/capacity");

//Registrar Proveedor
router.get("/providers/register", isAuthenticated, havePermission("crear-proveedor"), maxProviders, renderRegisterProvider);
router.post("/providers/register", isAuthenticated, havePermission("crear-proveedor"), maxProviders, registerProvider);

//Mostrar Proveedores
router.get("/providers", isAuthenticated, havePermission("ver-proveedor"), renderProviders);

//Editar Proveedor
router.get("/providers/:id/edit", isAuthenticated, renderEditProvider);
router.post("/providers/:id/edit", isAuthenticated, havePermission("editar-proveedor"), updateProvider);

// Mostrar detalles del proveedor
router.get("/providers/:id/details", isAuthenticated, havePermission("ver-proveedor-detalle"), renderProviderDetails);

// Exportar a Excel
router.get("/providers/export-excel", isAuthenticated, havePermission("exportar-proveedor"), exportToExcel);

//Eliminar Proveedor
router.get("/providers/:id/confirm-delete", isAuthenticated, renderDeleteProvider);
router.get("/providers/:id/delete", isAuthenticated, havePermission("eliminar-proveedor"), deleteProvider);

module.exports = router;