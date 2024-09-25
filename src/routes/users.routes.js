const {Router} = require("express");
const router = Router();

const {
  renderRegisterUser,
  registerUser,
  renderLoginUser,
  login,
  logOut,
  renderUsers,
  renderEditUser,
  updateUser,
  deleteUser,
  renderDeleteUser
} = require("../controllers/users.controller");

const {
  isAuthenticated,
  havePermission
} = require("../helpers/auth");


const {
  maxEmployees
} = require("../helpers/capacity");


//Registro de usuarios
router.get("/users/register", isAuthenticated, havePermission("crear-usuario"), maxEmployees, renderRegisterUser);
router.post("/users/register", isAuthenticated, havePermission("crear-usuario"), maxEmployees, registerUser);

//Inicio de sesión
router.get("/users/login", renderLoginUser);
router.post("/users/login", login);

//Obtener usuarios
router.get("/users", isAuthenticated, havePermission("ver-usuario"), renderUsers);

//Editar usuarios
router.get("/users/:id/edit", isAuthenticated, havePermission("editar-usuario"), renderEditUser);
router.post("/users/:id/edit", isAuthenticated, havePermission("editar-usuario"), updateUser);

//Eliminar usuario
router.get("/users/:id/confirm-delete", isAuthenticated, havePermission("eliminar-usuario"), renderDeleteUser);
router.get("/users/:id/delete", isAuthenticated, havePermission("eliminar-usuario"), deleteUser);

//Cerrar sesión
router.get("/users/logout", logOut);

module.exports = router;