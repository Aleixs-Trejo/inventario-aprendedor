const {Router} = require('express');
const router = Router();

const {
  renderCleaning
} = require('../controllers/cleaning.controller');

const {
  isAuthenticated,
  isAdmin
} = require("../helpers/auth");

// Renderizar la vista de limpieza intermedia
router.get("/cleanings", isAuthenticated, isAdmin, renderCleaning);

module.exports = router;