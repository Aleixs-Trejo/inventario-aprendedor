const usersRolCtrl = {};

const UserRol = require("../models/userRolModel");
const User = require("../models/userModel");
const Employee = require("../models/employeeModel");
const Company = require("../models/companyModel");

//Creacion de roles
usersRolCtrl.renderRegisterUserRol = async (req, res) => {
  try {
    const user = await User.findOne({eliminadoUsuario: false}).lean();
    const company	= await Company.findOne({eliminadoCompany: false}).lean();

    if (!company) {
      return res.redirect("/company/register");
    }

    res.render("users-rol/new-user-rol", {
      user
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

usersRolCtrl.registerUserRol = async (req, res) => {
  try {
    const employees = await Employee.find({eliminadoTrabajador: false})
      .populate({
        path: "usuarioRegistroTrabajador",
        populate: {
          path: "trabajadorUsuario",
          populate: "rolTrabajador"
        }
      })
      .populate("rolTrabajador")
      .lean();

    const {
      nombreRol,
      descripcionRol,
      permisosRol
    } = req.body;

    if (!permisosRol) {
      req.flash("wrong", "Debe seleccionar al menos un permiso");
      return res.redirect("/users-rol/register");
    }

    const newUserRol = new UserRol({
        nombreRol,
        descripcionRol,
        permisosRol
      });
    await newUserRol.save() //Guardar en la BD
    req.flash("success", "Rol creado exitosamente");
    if (employees.length === 0) {
      console.log("Employees: ", employees.length);
      return res.redirect("/employees/register");
    }
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

    const currentPage = `users-rol`;
    res.render("users-rol/all-users-rol", {
      usersRol,
      currentPage
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
    const {id} = req.params;
    const userRol = await UserRol.findById(id).lean();
    console.log("userRole: ", userRol);
    res.render("users-rol/edit-user-rol", {
      userRol
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

usersRolCtrl.updateUserRol = async (req, res) => {
  try {
    const {id} = req.params;
    const userRol = await UserRol.findById(id).lean();
    const permisosRol = req.body.permisosRol;
    const permisosNuevos = userRol.permisosRol.filter(permisos => !permisosRol.includes(permisos));
    console.log("Permisos totales: ", permisosRol);
    console.log("Permisos nuevos: ", permisosNuevos);
    await UserRol.findByIdAndUpdate(id, {
      nombreRol: req.body.nombreRol,
      descripcionRol: req.body.descripcionRol,
      permisosRol
    });
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
    res.render("users-rol/delete-user-rol", {
      rol
    });
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