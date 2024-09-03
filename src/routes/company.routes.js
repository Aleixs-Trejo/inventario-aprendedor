const {Router} = require("express");
const router = Router();

const upload = require("../config/multer");

const {
  renderRegisterCompany,
  registerCompany,
  renderDetailsCompany
} = require("../controllers/company.controller");

// Renderizar vista para registrar empresa
router.get("/company/register", renderRegisterCompany);

// Registrar compañia
router.post("/company/register", upload.single("imagenCompany"), registerCompany);

// Mostrar detalles de una compañía
router.get("/company/:id/details", renderDetailsCompany);

module.exports = router;