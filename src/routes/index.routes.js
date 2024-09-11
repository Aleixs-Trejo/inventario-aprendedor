const {Router} = require("express");
const router = Router();

const {renderIndex} = require("../controllers/index.controller");

const {
  renderLoginUser,
  login
} = require("../controllers/users.controller");

const {
  isAuthenticated
} = require("../helpers/auth");

//Mostrar formulario de inicio de sesión
router.get("/", renderLoginUser);
router.post("/users/login", login);

//Mostrar la principal al iniciar sesión
router.get("/principal", isAuthenticated, renderIndex);

module.exports = router;