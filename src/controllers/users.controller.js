const usersCtrl = {};

const passport = require("passport");
const User = require("../models/userModel");
const Employee = require("../models/employeeModel");
const UserHistory = require("../models/userHistoryModel");

//Registrar usuarios
usersCtrl.renderRegisterUser = async (req, res) => {
  try {
    // Empleados que no han sido eliminados
    const employees = await Employee.find({ eliminadoTrabajador: false })
    .populate({
      path: "rolTrabajador",
      populate: {
        path: "nombreRol"
      }
    })
    .lean();

    console.log("Empleados: ", employees);
    res.render("users/new-user", { employees });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente");
    console.log(error);
  }
}
usersCtrl.registerUser = async (req, res) => {
  try {
    console.log(req.body);
    const errors = [];
    const {
      trabajadorUsuario,
      usuario,
      password,
      confirm_password
    } = req.body;

    console.log(req.body);

    if (password != confirm_password){
      errors.push({text: "Las contraseñas no coinciden"});
    } else if (password.length < 4){
      errors.push({text: "La contraseña debe tener al menos 4 caracteres"});
    } else if (errors.length > 0){
      res.render("users/new-user", {
        errors,
        usuario
      })
    } else{
      const usuarioUser = await User.findOne({usuario, eliminadoUsuario: false});
      const trabajadorUser = await User.findOne({trabajadorUsuario, eliminadoUsuario: false});
      if (usuarioUser) {
        req.flash("wrong", "El usuario ya está registrado");
        res.redirect("/users/register");
      } else if (trabajadorUser) {
        req.flash("wrong", "El trabajador ya está registrado");
        res.redirect("/users/register");
      } else {
        const trabajador = await Employee.findById(trabajadorUsuario);

        if (!trabajador) {
          req.flash("wrong", "Trabajador no encontrado");
          return res.redirect("/users/register");
        }

        const newUser = new User({
          trabajadorUsuario: trabajador._id,
          usuario,
          password
          });
        newUser.password = await newUser.encryptPassword(password);

        console.log("Nuevo usuario registrado: ", newUser);
        await newUser.save(); //Guardar en la BD

        const userId = newUser._id;

        const newUserHistory = new UserHistory({
          tipoHistorial: "Registro",
          usuarioHistorial: userId
        });

        console.log("Nuevo historial de Usuario: ", newUserHistory);
        await newUserHistory.save();

        req.flash("success", "Usuario registrado exitosamente");
        res.redirect("/users");
      }
    }
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente");
    console.log(error);
  }
}

//Inicio de sesión
usersCtrl.renderLoginUser = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/principal");
  }
  res.render("users/login");
}

usersCtrl.login = (req, res, next) => {
  // Autenticar con Passport
  passport.authenticate("local", (err, user, _) => {
    if (err) { return next(err); }
    if (!user) {
      // Si el usuario no se autentica correctamente, redirigir al inicio de sesión con un mensaje de error
      req.flash("wrong", "Datos inválidos");
      return res.redirect("/");
    }
    console.log("Usuario: ", user)
    // Si el usuario se autentica correctamente, iniciar sesión en la sesión y redirigir al usuario
    req.login(user, (err) => {
      if (err) return next(err);
      req.flash("success", "Sesión iniciada correctamente");
      return res.redirect("/principal");
    });
  })(req, res, next);
};

//Mostrar todos los usuarios
usersCtrl.renderUsers = async (req, res) => {
  try {
    const users = await User.find({eliminadoUsuario: false})
      .populate({
        path: 'trabajadorUsuario',
        match: { eliminadoTrabajador: false }, // Filtrar trabajadores no eliminados
        populate: { path: 'rolTrabajador' }
      })
      .lean();

    // Filtrar los usuarios que tengan un trabajador asociado no eliminado
    const filteredUsers = users.filter(user => user.trabajadorUsuario !== null);

    // const userRole = req.user.trabajadorUsuario.rolTrabajador.nombreRol || null;
    res.render("users/all-users", {
      users: filteredUsers
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente");
    console.log(error);
  }
}

//Editar usuarios
usersCtrl.renderEditUser = async (req, res) => {
  try {
    const {id} = req.params;
    const usuario = await User.findById(id)
      .populate({
        path: "trabajadorUsuario",
        populate: {
          path: "rolTrabajador"
        }
      })
      .lean();
    const employees = await Employee.find({ eliminadoTrabajador: false })
      .populate("rolTrabajador")
      .lean();
    console.log("Empleado:", usuario.trabajadorUsuario);
    res.render("users/edit-user", {
      usuario,
      employees: employees.reduce((acc, employee) => {
        acc[employee._id] = employee;
        return acc;
      }, {})
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente");
    console.log(error);
  }
}
usersCtrl.updateUser = async (req, res) => {
  try {
    const {id} = req.params;
    const {password, ...updateData} = req.body;

    //verificar contraseña actualizada
    if (password){
      const encryptedPassword = await User.schema.methods.encryptPassword(password);
      //Actualizar datos incluyendo contraseña
      await User.findByIdAndUpdate(id, {...updateData, password: encryptedPassword});
    } else{
      //Actualizar datos si no se cambia la contraseña
      await User.findByIdAndUpdate(id, updateData);
    }
    req.flash("success", "Usuario actualizado exitosamente");
    res.redirect("/users");
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente");
    console.log(error);
  }
}

//Eliminar usuario
usersCtrl.renderDeleteUser = async (req, res) => {
  try {
    const {id} = req.params;
    const userToDelete = await User.findById(id)
    .populate({
      path: "trabajadorUsuario",
      populate: {
        path: "rolTrabajador"
      }
    })
    .lean();
    res.render("users/delete-user", {userToDelete});
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente");
    console.log(error);
  }
}
usersCtrl.deleteUser = async (req, res) => {
  try {
    const {id} = req.params;

    const deletedUser = await User.findById(id)
    .populate({
      path: "trabajadorUsuario",
      populate: {
        path: "rolTrabajador"
      }
    }).lean();

    if (!deletedUser) {
      req.flash("wrong", "Usuario no encontrado");
      return res.redirect("/users");
    }

    console.log("Usuario eliminado: ", deletedUser);
    await User.findByIdAndUpdate(id, {eliminadoUsuario: true});
    console.log("Usuario actualizado: ", deletedUser);
    const deletedUserId = deletedUser._id;

    const newUserHistory = new UserHistory({
      tipoHistorial: "Eliminado",
      usuarioHistorial: deletedUserId
    });

    console.log("Nuevo historial de Usuario: ", newUserHistory);
    await newUserHistory.save();

    req.flash("success", "Usuario eliminado exitosamente");
    res.redirect("/users");
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente");
    console.log(error);
  }
}

//Cerrar Sesión
usersCtrl.logOut = (req, res) => {
  req.logout((err) => {
    if (err) {return next(err);}
    req.flash("success", "Sesión cerrada correctamente");
    res.redirect("/")
  })
}

module.exports = usersCtrl;