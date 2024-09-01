const usersRolCtrl = {};

const UserRol = require("../models/userRolModel");
const User = require("../models/userModel");
const Company = require("../models/companyModel");

//Creacion de roles
usersRolCtrl.renderRegisterUserRol = async (req, res) => {
  try {
    const user = await User.findOne({eliminadoUsuario: false}).lean();
    const company	= await Company.findOne({eliminadoCompany: false}).lean();

    if (!company) {
      return res.redirect("/company/register");
    }
    const base64Image = company.imagenCompany.toString("base64");
    console.log("Company: ", company);
    console.log("Base64 Image: ", base64Image);
    res.render("users-rol/new-user-rol", {user, base64Image, company});
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

usersRolCtrl.registerUserRol = async (req, res) => {
  try {
    const {
      nombreRol,
      descripcionRol,
      permisosRol
    } = req.body;

    console.log("req.body: ", req.body);
    console.log("permisosRol: ", permisosRol);

    const newUserRol = new UserRol({
        nombreRol,
        descripcionRol,
        permisosRol
      });
    await newUserRol.save() //Guardar en la BD
    req.flash("success", "Rol creado exitosamente");
    res.redirect("/users-rol");
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

//Mostrar roles y descripción
usersRolCtrl.renderUsersRol = async (req, res) => {
  try {
    const usersRol = await UserRol.find().lean();
    const userRole = req.user.trabajadorUsuario.rolTrabajador.nombreRol;
    res.render("users-rol/all-users-rol", {
      usersRol,
      userRole
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

//Editar roles
usersRolCtrl.renderEditUserRol = async (req, res) => {
  try {
    const userRol = await UserRol.findById(req.params.id).lean();
    res.render("users-rol/edit-user-rol", {userRol});
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

usersRolCtrl.updateUserRol = async (req, res) => {
  try {
    const {id} = req.params;
    await UserRol.findByIdAndUpdate(id, req.body);
    req.flash("success", "Rol actualizado exitosamente");
    res.redirect("/users-rol");
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

//Eliminar roles
usersRolCtrl.renderDeleteUserRol = async (req, res) => {
  try {
    const {id} = req.params;
    const rol = await UserRol.findById(id).lean();
    res.render("users-rol/delete-user-rol", {rol});
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}
usersRolCtrl.deleteUserRol = async (req, res) => {
  try {
    const {id} = req.params;
    await UserRol.findByIdAndDelete(id);
    req.flash("success", "Rol eliminado exitosamente");
    res.redirect("/users-rol");
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}


module.exports = usersRolCtrl;