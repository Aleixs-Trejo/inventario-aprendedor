const {Router} = require("express");
const router = Router();

const {
  renderRegisterSale,
  registerSale,
  renderSales,
  renderDetailSale,
  renderVoucherSale,
  renderBillSale,
  cancelSale,
  closeRegister,
  renderBalanceSales,
  renderDetailCloseRegister,
  searchClient,
  exportToExcelBalance,
  exportPendingSalesToExcel,
  generateBillPDF,
} = require("../controllers/sales.controller");

const {
  isAuthenticated,
  isAdmin,
  isVendedor
} = require("../helpers/auth");

// Buscar cliente
router.get("/sales/search-client/:dniCliente", isAuthenticated, isVendedor, searchClient);

// Registrar venta
router.get("/sales/register", isAuthenticated, isVendedor, renderRegisterSale);
router.post("/sales/register", isAuthenticated, isVendedor, registerSale);

// Mostrar ventas
router.get("/sales", isAuthenticated, isVendedor, renderSales);

// Mostrar detalle de Venta
router.get("/sales/:id/details", isAuthenticated, isVendedor, renderDetailSale);

// Mostrar voucher de venta
router.get("/sales/:id/voucher", isAuthenticated, isVendedor, renderVoucherSale);

// Mostrar Boleta de venta
router.get("/sales/:id/bill", renderBillSale);

// Descargar boleta en PDF
router.get("/sales/:id/download", isAuthenticated, isVendedor, generateBillPDF);

// Cancelar Venta
router.get("/sales/:id/cancel", isAuthenticated, isVendedor, cancelSale);

// Exportar a Excel ventas pendientes
router.get("/sales/export-excel", isAuthenticated, isVendedor, exportPendingSalesToExcel);

// Cerrar caja
router.get("/sales/confirm-all", isAuthenticated, isVendedor, closeRegister);

// Mostrar detalles de cada cierre de caja
router.get("/sales-history/:id/detail-close-register", isAuthenticated, isVendedor, renderDetailCloseRegister);

// Obtener todos los balances
router.get("/sales/balance", isAuthenticated, isAdmin, renderBalanceSales);

// Exportar balances a excel
router.get("/sales/balance/export-excel", isAuthenticated, isAdmin, exportToExcelBalance);

module.exports = router;