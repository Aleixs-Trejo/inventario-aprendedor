const {Router} = require('express');
const router = Router();

const {
  renderCleaning
} = require('../controllers/cleaning.controller');

const {
  isAuthenticated,
  havePermission
} = require("../helpers/auth");

// Renderizar la vista de limpieza intermedia
router.get("/cleanings", isAuthenticated, havePermission("ver-limpieza-intermedia"), renderCleaning);

module.exports = router;