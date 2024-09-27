const helpers = {};

const User = require("../models/userModel");

helpers.isAuthenticated = async (req, res, next) => {
  if (req.headers["x-puppeteer-request"]) {
    return next();
  }

  // Verificar si hay usuarios registrados
  const users = await User.find({eliminadoUsuario: false})
    .populate({
      path: "trabajadorUsuario",
      populate: {
        path: "rolTrabajador",
        populate: "permisosRol"
      }
    })
    .lean();
  
  // Si no hay usuarios registrados, continuar sin autenticación
  if (users.length === 0) {
    return next();
  }

  if (req.isAuthenticated() && req.user){
    return next();
  }
  req.flash("wrong", "Debes iniciar sesión antes de continuar");
  res.redirect("/");
}

// Dar permisos a un rol según los permisos que se le han asignado
helpers.havePermission = (permission) => {
  const permisosRol = async (req, res, next) => {
    try {
      const users = await User.find({eliminadoUsuario: false})
        .populate({
          path: "trabajadorUsuario",
          populate: {
            path: "rolTrabajador"
          }
        })
        .lean();

      if (permission === "crear-rol" && users.length === 0) {
        return next();
      }
      if (permission === "crear-trabajador" && users.length === 0) {
        return next();
      }
      if (permission === "crear-usuario" && users.length === 0) {
        return next();
      }

      const userId = req.user;
      const user = await User.findById(userId)
        .populate({
          path: "trabajadorUsuario",
          populate: {
            path: "rolTrabajador"
          }
        })
        .lean();

      if (user && user.trabajadorUsuario && user.trabajadorUsuario.rolTrabajador){
        const { permisosRol } = user.trabajadorUsuario.rolTrabajador;
        if (permisosRol.includes(permission)){
          return next();
        }

      }
      if (permission === "email-venta" || permission === "boleta-venta") {
        return next();
      }
      req.flash("wrong", "No tienes permisos para realizar esta acción.");
      console.log(`No tienes permiso para: ${permission}`);
      return res.redirect("/");
    } catch (error) {
      console.error("Error:", error);
      return next(error);
    }
  }

  return permisosRol;
}

module.exports = helpers;