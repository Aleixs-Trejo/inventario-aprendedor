const usersRolCtrl = {};
const UserRol = require("../models/userRolModel");


//Creacion de roles
usersRolCtrl.renderRegisterUserRol = (req, res) => {
  try {
    res.render("users-rol/new-user-rol");
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
      descripcionRol
    } = req.body;

    const newUserRol = new UserRol(
      {
        nombreRol,
        descripcionRol
      }
    );
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