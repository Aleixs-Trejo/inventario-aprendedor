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
  havePermission
} = require("../helpers/auth");

// Buscar cliente
router.get("/sales/search-client/:dniCliente", isAuthenticated, havePermission("crear-venta"), searchClient);

// Registrar venta
router.get("/sales/register", isAuthenticated, havePermission("crear-venta"), renderRegisterSale);
router.post("/sales/register", isAuthenticated, havePermission("crear-venta"), registerSale);

// Mostrar ventas
router.get("/sales", isAuthenticated, havePermission("ver-ventas"), renderSales);

// Mostrar detalle de Venta
router.get("/sales/:id/details", isAuthenticated, havePermission("ver-detalle-venta"), renderDetailSale);

// Mostrar voucher de venta
router.get("/sales/:id/voucher", isAuthenticated, havePermission("ticket-venta"), renderVoucherSale);

// Mostrar Boleta de venta
router.get("/sales/:id/bill", isAuthenticated, havePermission("boleta-venta"), renderBillSale);

// Descargar boleta en PDF
router.get("/sales/:id/download", isAuthenticated, havePermission("email-venta"), generateBillPDF);

// Cancelar Venta
router.get("/sales/:id/cancel", isAuthenticated, havePermission("cancelar-venta"), cancelSale);

// Exportar a Excel ventas pendientes
router.get("/sales/export-excel", isAuthenticated, havePermission("exportar-venta"), exportPendingSalesToExcel);

// Cerrar caja
router.get("/sales/confirm-all", isAuthenticated, havePermission("cerrar-caja-venta"), closeRegister);

// Mostrar detalles de cada cierre de caja
router.get("/sales-history/:id/detail-close-register", isAuthenticated, havePermission("ver-detalle-cierre-venta"), renderDetailCloseRegister);

// Obtener todos los balances
router.get("/sales/balance", isAuthenticated, havePermission("ver-balance"), renderBalanceSales);

// Exportar balances a excel
router.get("/sales/balance/export-excel", isAuthenticated, havePermission("exportar-balance"), exportToExcelBalance);

module.exports = router;