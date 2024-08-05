const {Router} = require("express");
const router = Router();

const {
  renderRegisterRecord,
  registerRecord,
  renderRecords,
  renderEditRecord,
  updateRecord,
  deleteRecord,
  renderDeleteRecord
} = require("../controllers/records.controller");

const {
  isAuthenticated,
  isAdmin
} = require("../helpers/auth");

//Registro de ipo de registro
router.get("/records/register", isAuthenticated, isAdmin, renderRegisterRecord);
router.post("/records/register", isAuthenticated, isAdmin, registerRecord);

//Mostrar Tipos de Registro
router.get("/records", isAuthenticated, isAdmin, renderRecords);

//Editar y actualizar tipos de registro
router.get("/records/:id/edit", isAuthenticated, isAdmin, renderEditRecord);
router.post("/records/:id/edit", isAuthenticated, isAdmin, updateRecord);

//Eliminar tipo de registro
router.get("/records/:id/confirm-delete", isAuthenticated, isAdmin, renderDeleteRecord);
router.get("/records/:id/delete", isAuthenticated, isAdmin, deleteRecord);

module.exports = router;