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
} = require("../controllers/products.controller");

const {
  isAuthenticated,
  isAdmin,
  isAlmacen,
  isAlmacenVendedor
} = require("../helpers/auth");

// Registrar Producto
router.get("/products/register", isAuthenticated, isAlmacen, renderRegisterProduct);
router.post("/products/register", isAuthenticated, isAlmacen, registerProduct);

// Ver Productos
router.get("/products", isAuthenticated, isAlmacenVendedor, renderProducts);

// Editar Productos
router.get("/products/:id/edit", isAuthenticated, isAlmacen, renderEditProduct);
router.post("/products/:id/edit", isAuthenticated, isAlmacen, updateProduct);

// Exportar a Excel
router.get("/products/export-excel", isAuthenticated, isAdmin, exportToExcel);

// Eliminar Productos
router.get("/products/:id/confirm-delete", isAuthenticated, isAdmin, renderDeleteProduct);
router.get("/products/:id/delete", isAuthenticated, isAdmin, deleteProduct);

module.exports = router;