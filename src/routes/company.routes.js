const {Router} = require("express");
const router = Router();

const {
  renderRegisterCompany,
  registerCompany,
  renderDetailsCompany
} = require("../controllers/company.controller");

// Renderizar vista para registrar empresa
router.get("/company/register", renderRegisterCompany);

// Registrar compañia
router.post("/company/register", registerCompany);

// Mostrar detalles de una compañía
router.get("/company/:id/details", renderDetailsCompany);

module.exports = router;