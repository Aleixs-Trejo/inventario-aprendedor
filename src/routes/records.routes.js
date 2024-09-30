const {Router} = require("express");
const router = Router();

const {
  renderRecords,
  exportToExcel
} = require("../controllers/record.controller");

const {
  isAuthenticated,
  havePermission
} = require("../helpers/auth");

// Renderizar registros
router.get("/records", isAuthenticated, havePermission("ver-registro"), renderRecords);

// Exportar registros a Excel
router.get("/records/export-excel", isAuthenticated, havePermission("exportar-registro"), exportToExcel);

module.exports = router;