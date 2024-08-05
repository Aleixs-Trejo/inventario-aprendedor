const helpers = {};

const User = require("../models/userModel");

helpers.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()){
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
      console.log("Usuario: ", user.usuario);
      console.log("Rol: ", rol);
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
      console.log("Usuario: ", user.usuario);
      console.log("Rol: ", rol);
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
      console.log("Usuario: ", user.usuario);
      console.log("Rol: ", rol);
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
      console.log("Usuario: ", user.usuario);
      console.log("Rol: ", rol);
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

module.exports = helpers;