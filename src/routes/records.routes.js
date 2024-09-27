const {Router} = require("express");
const router = Router();

const {
  renderRecords
} = require("../controllers/record.controller");

const {
  isAuthenticated,
  havePermission
} = require("../helpers/auth");

// Renderizar registros
router.get("/records", isAuthenticated, havePermission("ver-registro"), renderRecords);

module.exports = router;