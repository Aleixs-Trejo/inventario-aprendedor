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
  isAdmin
} = require("../helpers/auth");

//Registro de usuarios
router.get("/users/register", renderRegisterUser);
router.post("/users/register", registerUser);

//Inicio de sesión
router.get("/users/login", renderLoginUser);
router.post("/users/login", login);

//Obtener usuarios
router.get("/users", isAuthenticated, isAdmin, renderUsers);

//Editar usuarios
router.get("/users/:id/edit", isAuthenticated, isAdmin, renderEditUser);
router.post("/users/:id/edit", isAuthenticated, isAdmin, updateUser);

//Eliminar usuario
router.get("/users/:id/confirm-delete", isAuthenticated, isAdmin, renderDeleteUser);
router.get("/users/:id/delete", isAuthenticated, isAdmin, deleteUser);

//Cerrar sesión
router.get("/users/logout", logOut);

module.exports = router;