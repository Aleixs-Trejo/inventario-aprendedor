const {Router} = require("express");
const router = Router();

const {
  renderRegisterProduct,
  registerProduct,
  renderProducts,
  renderEditProduct,
  updateProduct,
  exportToExcel,
  deleteProduct,
  renderDeleteProduct,
  renderDetailsProduct,
} = require("../controllers/products.controller");

const {
  isAuthenticated,
  havePermission
} = require("../helpers/auth");

const {
  maxProducts
} = require("../helpers/capacity");

// Registrar Producto
router.get("/products/register", isAuthenticated, havePermission("crear-producto"), maxProducts, renderRegisterProduct);
router.post("/products/register", isAuthenticated, havePermission("crear-producto"), maxProducts, registerProduct);

// Ver Productos
router.get("/products", isAuthenticated, havePermission("ver-producto"), renderProducts);

// Editar Productos
router.get("/products/:id/edit", isAuthenticated, havePermission("editar-producto"), renderEditProduct);
router.post("/products/:id/edit", isAuthenticated, havePermission("editar-producto"), updateProduct);

// Ver detalles del producto
router.get("/products/:id/details", isAuthenticated, havePermission("ver-detalle-producto"), renderDetailsProduct);

// Exportar a Excel
router.get("/products/export-excel", isAuthenticated, havePermission("exportar-producto"), exportToExcel);

// Eliminar Productos
router.get("/products/:id/confirm-delete", isAuthenticated, havePermission("eliminar-producto"), renderDeleteProduct);
router.get("/products/:id/delete", isAuthenticated, havePermission("eliminar-producto"), deleteProduct);

module.exports = router;