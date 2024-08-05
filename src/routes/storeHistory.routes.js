const {Router} = require('express');
const router = Router();

const {
  renderStoreHistory
} = require("../controllers/storeHistory.controller");

const {
  isAuthenticated,
  isAdmin
} = require('../helpers/auth');

//Mostrar historial
router.get('/stores/history', isAuthenticated, isAdmin, renderStoreHistory);

module.exports = router;