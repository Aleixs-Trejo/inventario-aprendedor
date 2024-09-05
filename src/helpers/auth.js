const helpers = {};

const User = require("../models/userModel");

helpers.isAuthenticated = async (req, res, next) => {
  // Verificar si hay usuarios registrados
  const users = await User.find({eliminadoUsuario: false})
    .populate({
      path: "trabajadorUsuario",
      populate: {
        path: "rolTrabajador"
      }
    })
    .lean();
  
  // Si no hay usuarios registrados, continuar sin autenticación
  if (users.length === 0) {
    return next();
  }

  if (req.isAuthenticated()){
    const userId = req.user._id;
    const user = await User.findById(userId)
      .populate({
        path: "trabajadorUsuario",
        populate: {
          path: "rolTrabajador"
        }
      })
      .lean();
    console.log("Usuario: ", user.usuario);
    console.log("Rol: ", user.trabajadorUsuario.rolTrabajador.nombreRol);
    console.log("Permisos: ", user.trabajadorUsuario.rolTrabajador.permisosRol);
    return next();
  }
  req.flash("wrong", "Debes iniciar sesión antes de continuar");
  res.redirect("/");
}

helpers.isAdmin = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId)
    .populate({
      path: "trabajadorUsuario",
      populate: {
        path: "rolTrabajador"
      }
    })
    .lean();
    if (user && user.trabajadorUsuario && user.trabajadorUsuario.rolTrabajador){
      const rol = user.trabajadorUsuario.rolTrabajador.nombreRol;
      if (rol === "Admin"){
        return next();
      }
    }
    req.flash("wrong", "No tienes permisos para realizar esta acción.");
    return res.redirect("/");
  } catch (error) {
    console.error("Error:", error);
    return next(error);
  }
}

helpers.isVendedor = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId)
    .populate({
      path: "trabajadorUsuario",
      populate: {
        path: "rolTrabajador"
      }
    })
    .lean();
    if (user && user.trabajadorUsuario && user.trabajadorUsuario.rolTrabajador){
      const rol = user.trabajadorUsuario.rolTrabajador.nombreRol;
      if (rol === "Admin" || rol === "Vendedor"){
        return next();
      }
    }
    req.flash("wrong", "No tienes permisos para realizar esta acción.");
    return res.redirect("/");
  } catch (error) {
    console.error("Error:", error);
    return next(error);
  }
}

helpers.isAlmacen = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId)
    .populate({
      path: "trabajadorUsuario",
      populate: {
        path: "rolTrabajador"
      }
    })
    .lean();
    if (user && user.trabajadorUsuario && user.trabajadorUsuario.rolTrabajador){
      const rol = user.trabajadorUsuario.rolTrabajador.nombreRol;
      if (rol === "Admin" || rol === "Almacen"){
        return next();
      }
    }
    req.flash("wrong", "No tienes permisos para realizar esta acción.");
    return res.redirect("/");
  } catch (error) {
    console.error("Error:", error);
    return next(error);
  }
}

helpers.isAlmacenVendedor = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId)
    .populate({
      path: "trabajadorUsuario",
      populate: {
        path: "rolTrabajador"
      }
    })
    .lean();
    if (user && user.trabajadorUsuario && user.trabajadorUsuario.rolTrabajador){
      const rol = user.trabajadorUsuario.rolTrabajador.nombreRol;
      if (rol === "Admin" || rol === "Almacen" || rol === "Vendedor"){
        return next();
      }
    }
    req.flash("wrong", "No tienes permisos para realizar esta acción.");
    return res.redirect("/");
  } catch (error) {
    console.error("Error:", error);
    return next(error);
  }
}

// Dar permisos a un rol según los permisos que se le han asignado
helpers.havePermission = (permission) => {
  const permisosRol = async (req, res, next) => {
    try {
      const userId = req.user._id;
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
        console.log("Rol: ", user.trabajadorUsuario.rolTrabajador);
        console.log("Usuario: ", user.usuario);
        console.log("RolNombre: ", user.trabajadorUsuario.rolTrabajador.nombreRol);
        console.log("Permisos: ", permisosRol);
        if (permisosRol.includes(permission)){
          console.log("Permisos incluidos", permission);
          return next();
        }
      }
      req.flash("wrong", "No tienes permisos para realizar esta acción.");
      return res.redirect("/");
    } catch (error) {
      console.error("Error:", error);
      return next(error);
    }
  }

  return permisosRol;
}

module.exports = helpers;