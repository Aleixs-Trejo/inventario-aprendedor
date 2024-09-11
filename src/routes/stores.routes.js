const {Router} = require("express");
const router = Router();

const {
  renderRegisterStore,
  registerStore,
  renderStores,
  renderEditStore,
  updateStore,
  exportToExcel,
  deleteStore,
  renderDeleteStore,
  findLowStockProducts,
  renderDetailsStore
} = require("../controllers/stores.controller");

const {
  isAuthenticated,
  havePermission
} = require("../helpers/auth");

//Registrar producto en almacén
router.get("/stores/register", isAuthenticated, havePermission("crear-almacen"), renderRegisterStore);
router.post("/stores/register", isAuthenticated, havePermission("crear-almacen"), registerStore);

//Mostrar almacén
router.get("/stores", isAuthenticated, havePermission("ver-almacen"), renderStores);

// Obtener productos menores a su stock minimo
router.get("/stores/low-stock-count", isAuthenticated, havePermission("alertas-almacen"), findLowStockProducts);

//Editar producto de almacén
router.get("/stores/:id/edit", isAuthenticated, havePermission("editar-almacen"), renderEditStore);
router.post("/stores/:id/edit", isAuthenticated, havePermission("editar-almacen"), updateStore);

// Mostrar datos detallados de un producto en el almacén
router.get("/stores/:id/details", isAuthenticated, havePermission("ver-detalle-almacen"), renderDetailsStore);

// Exportar a Excel
router.get("/stores/export-excel", isAuthenticated, havePermission("exportar-almacen"), exportToExcel);

//Eliminar producto de almacén
router.get("/stores/:id/confirm-delete", isAuthenticated, havePermission("eliminar-almacen"), renderDeleteStore);
router.get("/stores/:id/delete", isAuthenticated, havePermission("eliminar-almacen"), deleteStore);

module.exports = router;