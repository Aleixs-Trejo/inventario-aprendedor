const {Router} = require("express");
const router = Router();

const upload = require("../config/multer");

const {
  renderRegisterCompany,
  registerCompany,
  renderDetailsCompany,
  updateCompany
} = require("../controllers/company.controller");

const {
  isAuthenticated,
  havePermission
} = require("../helpers/auth");

const {
  maxCompanies
} = require("../helpers/capacity");

// Renderizar vista para registrar empresa
router.get("/company/register", maxCompanies, renderRegisterCompany);

// Registrar compañia
router.post("/company/register", maxCompanies, upload.single("imagenCompany"), registerCompany);

// Mostrar detalles de una compañía
router.get("/company/:id/details", isAuthenticated, havePermission("ver-company"), renderDetailsCompany);

// Editar detalles de una compañía
router.post("/company/:id/update", isAuthenticated, havePermission("editar-company"), upload.single("imagenCompany"), updateCompany);

module.exports = router;