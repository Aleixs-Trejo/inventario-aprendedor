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
  isAlmacen,
  isAlmacenVendedor,
  isAdmin
} = require("../helpers/auth");

//Registrar producto en almacén
router.get("/stores/register", isAuthenticated, isAlmacen, renderRegisterStore);
router.post("/stores/register", isAuthenticated, isAlmacen, registerStore);

//Mostrar almacén
router.get("/stores", isAuthenticated, isAlmacenVendedor, renderStores);

// Obtener productos menores a su stock minimo
router.get("/stores/low-stock-count", isAuthenticated, isAlmacenVendedor, findLowStockProducts);

//Editar producto de almacén
router.get("/stores/:id/edit", isAuthenticated, isAlmacen, renderEditStore);
router.post("/stores/:id/edit", isAuthenticated, isAlmacen, updateStore);

// Mostrar datos detallados de un producto en el almacén
router.get("/stores/:id/details", isAuthenticated, isAlmacen, renderDetailsStore);

// Exportar a Excel
router.get("/stores/export-excel", isAuthenticated, isAdmin, exportToExcel);

//Eliminar producto de almacén
router.get("/stores/:id/confirm-delete", isAuthenticated, isAdmin, renderDeleteStore);
router.get("/stores/:id/delete", isAuthenticated, isAdmin, deleteStore);

module.exports = router;