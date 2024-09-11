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
  havePermission
} = require("../helpers/auth");

//Crear clientes
router.get("/clients/register", isAuthenticated, havePermission("crear-cliente"), renderRegisterClient);
router.post("/clients/register", isAuthenticated, havePermission("crear-cliente"), registerClient);

//Mostrar clientes
router.get("/clients", isAuthenticated, havePermission("ver-cliente"), renderClients);

// Mostrar detalle de cliente
router.get("/client/:id/details", isAuthenticated, havePermission("ver-cliente-detalle"), renderDetailsClient);

//Editar cliente
router.get("/clients/:id/edit", isAuthenticated, havePermission("editar-cliente"), renderEditClient);
router.post("/clients/:id/edit", isAuthenticated, havePermission("editar-cliente"), updateClient);

//Eliminar Cliente
router.get("/clients/:id/confirm-delete", isAuthenticated, havePermission("eliminar-cliente"), renderDeleteClient);
router.get("/clients/:id/delete", isAuthenticated, havePermission("eliminar-cliente"), deleteClient);

module.exports = router;