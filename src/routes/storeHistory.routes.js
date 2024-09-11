const {Router} = require('express');
const router = Router();

const {
  renderStoreHistory
} = require("../controllers/storeHistory.controller");

const {
  isAuthenticated,
  havePermission
} = require('../helpers/auth');

//Mostrar historial
router.get('/stores/history', isAuthenticated, havePermission("historial-almacen"), renderStoreHistory);

module.exports = router;