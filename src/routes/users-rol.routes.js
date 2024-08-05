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
  isAdmin
} = require("../helpers/auth");

//Registro de Rol
router.get("/users-rol/register", renderRegisterUserRol);
router.post("/users-rol/register", registerUserRol);

//Mostrar Roles
router.get("/users-rol", isAuthenticated, isAdmin, renderUsersRol);

//Editar Roles
router.get("/users-rol/:id/edit", isAuthenticated, isAdmin, renderEditUserRol);
router.post("/users-rol/:id/edit", isAuthenticated, isAdmin, updateUserRol);

//Eliminar Roles
router.get("/users-rol/:id/confirm-delete", isAuthenticated, isAdmin, renderDeleteUserRol);
router.get("/users-rol/:id/delete", isAuthenticated, isAdmin, deleteUserRol);

module.exports = router;