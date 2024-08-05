const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const User = require("../models/userModel");

passport.use(new localStrategy(
  {
    usernameField: "usuario",
    passwordField: "password"
  }, async (username, password, done) => {
    //Comparar usuarios
    const user = await User.findOne({usuario: username});
    if (!user){
      return done(null, false, {message: "No existe el usuario"});
    } else {
      //Comparar contraseñas
      const matchPass = await user.matchPassword(password);
      if (matchPass){
        return done(null, user);
      } else{
        return done(null, false, {message: "Contraseña incorrecta"});
      }
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id)
    .populate({
      path: "trabajadorUsuario",
      populate: {
        path: "rolTrabajador"
      }
    })
    .lean();
    done(null, user);
  } catch (error) {
    done(error, null);
    console.log(error);
  }
});
