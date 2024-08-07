const {Router} = require("express");
const router = Router();

const {
  renderRegisterClient,
  registerClient,
  renderClients,
  renderEditClient,
  updateClient,
  deleteClient,
  renderDeleteClient,
  renderDetailsClient
} = require("../controllers/clients.controller");

const {
  isAuthenticated,
  isAdmin,
  isVendedor
} = require("../helpers/auth");

//Crear clientes
router.get("/clients/register", isAuthenticated, isVendedor, renderRegisterClient);
router.post("/clients/register", isAuthenticated, isVendedor, registerClient);

//Mostrar clientes
router.get("/clients", isAuthenticated, isVendedor, renderClients);

// Mostrar detalle de cliente
router.get("/client/:id/details", isAuthenticated, isAdmin, renderDetailsClient);

//Editar cliente
router.get("/clients/:id/edit", isAuthenticated, isVendedor, renderEditClient);
router.post("/clients/:id/edit", isAuthenticated, isVendedor, updateClient);

//Eliminar Cliente
router.get("/clients/:id/confirm-delete", isAuthenticated, isAdmin, renderDeleteClient);
router.get("/clients/:id/delete", isAuthenticated, isAdmin, deleteClient);

module.exports = router;