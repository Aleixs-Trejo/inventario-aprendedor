const {Router} = require("express");
const router = Router();

const {
  renderRegisterUserRol,
  registerUserRol,
  renderUsersRol,
  renderEditUserRol,
  updateUserRol,
  deleteUserRol,
  renderDeleteUserRol
} = require("../controllers/users-rol.controller");
const {
  isAuthenticated,
  havePermission
} = require("../helpers/auth");

//Registro de Rol
router.get("/users-rol/register", isAuthenticated,havePermission("crear-rol"), renderRegisterUserRol);
router.post("/users-rol/register", isAuthenticated,havePermission("crear-rol"), registerUserRol);

//Mostrar Roles
router.get("/users-rol", isAuthenticated, havePermission("ver-rol"), renderUsersRol);

//Editar Roles
router.get("/users-rol/:id/edit", isAuthenticated, havePermission("editar-rol"), renderEditUserRol);
router.post("/users-rol/:id/edit", isAuthenticated, havePermission("editar-rol"), updateUserRol);

//Eliminar Roles
router.get("/users-rol/:id/confirm-delete", isAuthenticated, havePermission("eliminar-rol"), renderDeleteUserRol);
router.get("/users-rol/:id/delete", isAuthenticated, havePermission("eliminar-rol"), deleteUserRol);

module.exports = router;