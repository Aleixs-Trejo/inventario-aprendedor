const express = require("express");
const exphbs = require("express-handlebars");
const path = require("node:path");
const morgan = require("morgan");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const coockieParser = require("cookie-parser");
const { formatDateTime } = require("./helpers/date");
const { formatCurrency } = require("./helpers/currency");
const Company = require("./models/companyModel");

//Initialization
const app = express();
require("./config/passport");

// Settings
app.set("PORT", process.env.PORT);
app.set("views", path.join(__dirname, "views"));
app.engine(".hbs", exphbs.engine(
  {
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
    helpers: {
      eq: function (a, b){
        return a.toString() == b.toString();
      },
      or: (...args) => args[0] || args[1],
      formatDateTime,
      formatCurrency,
    }
  }
));
app.set("view engine", ".hbs");

//Middlewares
app.use(morgan("dev"));
app.use(express.urlencoded({extended: false}));
app.use(coockieParser());
app.use(session(
  {
    secret: "secreto",
    resave: true,
    saveUninitialized: true
  }
));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
// Middleware para analizar cuerpos de solicitud JSON
app.use(express.json());

//Global Variables
app.use(async (req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.wrong = req.flash("wrong");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  try {
    const company = await Company.findOne({eliminadoCompany: false}).lean();
    req.company = company;
    res.locals.company = company;

    if (company) {
      res.locals.logoUrl = company.imagenCompany ? `/uploads/${company.imagenCompany}` : `/assets/logo-aprendedor.webp`;
    } else {
      res.locals.logoUrl = `/assets/logo-aprendedor.webp`;
    }
  } catch (error) {
    console.log("Error al obtener la company: ", error);
  }
  next();
})

//Routes
app.use(require("./routes/company.routes"));
app.use(require("./routes/index.routes"));
app.use(require("./routes/products.routes"));
app.use(require("./routes/users.routes"));
app.use(require("./routes/clients.routes"));
app.use(require("./routes/users-rol.routes"));
app.use(require("./routes/employees.routes"));
app.use(require("./routes/categories.routes"));
app.use(require("./routes/providers.routes"));
app.use(require("./routes/stockLocations.routes"));
app.use(require("./routes/stores.routes"));
app.use(require("./routes/sales.routes"));
app.use(require("./routes/storeHistory.routes"));
app.use(require("./routes/categoriesHistory.routes"));
app.use(require("./routes/clientsHistory.routes"));
app.use(require("./routes/employeesHistory.routes"));
app.use(require("./routes/productsHistory.routes"));
app.use(require("./routes/providersHistory.routes"));
app.use(require("./routes/usersHistory.routes"));
app.use(require("./routes/salesHistory.routes"));
app.use(require("./routes/hotel.routes"));
app.use(require("./routes/categoriesRoom.routes"));
app.use(require("./routes/categoriesRoomsHistory.routes"));
app.use(require("./routes/statusRoom.routes"));
app.use(require("./routes/statusRoomHistory.routes"));
app.use(require("./routes/floor.routes"))
app.use(require("./routes/floorHistory.routes"))
app.use(require("./routes/rooms.routes"));
app.use(require("./routes/roomsHistory.routes"));
app.use(require("./routes/maintenance.routes"));
app.use(require("./routes/maintenanceHistory.routes"));
app.use(require("./routes/reservation.routes"));
app.use(require("./routes/reservationHistory.routes"));
app.use(require("./routes/occupation.routes"));
app.use(require("./routes/occupationHistory.routes"));
app.use(require("./routes/storeHotel.routes"));
app.use(require("./routes/storeHotelHistory.routes"));
app.use(require("./routes/cleanings.routes"));
app.use(require("./routes/cleaningHistory.routes"));
app.use(require("./routes/checkouts.routes"));
app.use(require("./routes/checkoutsHistory.routes"));
app.use(require("./routes/balanceHotel.routes"));
app.use(require("./routes/salesHotel.routes"));
app.use(require("./routes/salesHotelHistory.routes"));

//Static Files
app.use(express.static(path.join(__dirname, "public")));

/* // Redirigir a principal en caso de que la ruta no exista
app.use((req, res, next) => {
  res.status(404).redirect("/");
}); */

module.exports = app;