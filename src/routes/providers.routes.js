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
  isAdmin,
  isAlmacen
} = require("../helpers/auth");

//Registrar Proveedor
router.get("/providers/register", isAuthenticated, isAlmacen, renderRegisterProvider);
router.post("/providers/register", isAuthenticated, isAlmacen, registerProvider);

//Mostrar Proveedores
router.get("/providers", isAuthenticated, isAlmacen, renderProviders);

//Editar Proveedor
router.get("/providers/:id/edit", isAuthenticated, isAlmacen, renderEditProvider);
router.post("/providers/:id/edit", isAuthenticated, isAlmacen, updateProvider);

// Mostrar detalles del proveedor
router.get("/providers/:id/details", isAuthenticated, isAdmin, renderProviderDetails);

// Exportar a Excel
router.get("/providers/export-excel", isAuthenticated, isAdmin, exportToExcel);

//Eliminar Proveedor
router.get("/providers/:id/confirm-delete", isAuthenticated, isAdmin, renderDeleteProvider);
router.get("/providers/:id/delete", isAuthenticated, isAdmin, deleteProvider);

module.exports = router;