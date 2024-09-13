const indexCtrl = {};
const moment = require("moment");

const Users = require("../models/userModel");
const Sales = require("../models/saleModel");
const Products = require("../models/productHistoryModel");
const UsersHistory = require("../models/userHistoryModel");
const Company = require("../models/companyModel");

// Minimarket
const StoreHistory = require("../models/storeHistoryModel");

// Hotel
const Room = require("../models/roomModel");
const RoomHistory = require("../models/roomHistoryModel");
const CategoryRooms = require("../models/categoryRoomModel");
const MaintenanceRoom = require("../models/maintenanceRoomModel");
const Reservation = require("../models/reservationModel");
const Occupation = require("../models/occupationModel");

indexCtrl.renderIndex = async (req, res) => {
  try {
    const company = await Company.findOne({eliminadoCompany: false}).lean();

    if (!company) {
      return res.redirect("/");
    }

    const currentUser = req.user;

    const permisosRole = currentUser.trabajadorUsuario.rolTrabajador.permisosRol;

    // Obtener la fecha de inicio de la semana actual
    const startOfWeek = moment().startOf("week").toDate();

    //buscar el usuario en la bd
    const user = await Users.findById(currentUser._id)
      .populate({
        path: "trabajadorUsuario",
        populate: {
          path: "rolTrabajador",
          model: "UserRol"
        }
      })
      .sort({createdAt: -1})
      .lean();

    // Obtener las ventas
    const sales = await Sales.find({ createdAt: { $gte: startOfWeek } })
      .populate({
        path: "usuarioVenta",
        populate: {
          path: "trabajadorUsuario",
          populate: {
            path: "rolTrabajador"
          }
        }
      })
      .populate("clienteVenta")
      .sort({createdAt: -1})
      .lean();

    // Obtener los productos registrados
    const products = await Products.find({ createdAt: { $gte: startOfWeek } })
      .populate({
        path: "productoHistorial",
        populate: [
          { path: "usuarioProducto" },
          { path: "proveedorProducto" },
          { path: "categoriaProducto" }
        ]
      })
      .sort({createdAt: -1})
      .lean();

    // Obtener los usuarios registrados
    const users = await UsersHistory.find({ createdAt: { $gte: startOfWeek } })
      .populate({
        path: "usuarioHistorial",
        populate: {
          path: "trabajadorUsuario",
          populate: {
            path: "rolTrabajador",
            model: "UserRol"
          }
        }
      })
      .sort({createdAt: -1})
      .lean();

    // Obtener registros de almacén
    const stores = await StoreHistory.find({ createdAt: { $gte: startOfWeek }, eliminadoProductoAlmacen: false })
      .populate("almacenUsuario")
      .populate({
        path: "almacenProducto",
        populate: {
          path: "proveedorProducto categoriaProducto"
        }
      })
      .populate("almacenStockUbicacion")
      .lean();

    // Obtener categorías de habitación
    const categoriesRoom = await CategoryRooms.find({eliminadoCategoriaHabitacion: false})
      .populate("usuarioRegistroCategoriaHabitacion")
      .sort({createdAt: -1})
      .lean();

    // Obtener las habitaciones
    const rooms = await Room.find({eliminadoHabitacion: false})
      .populate("usuarioRegistroHabitacion")
      .populate("categoriaHabitacion")
      .sort({numeroHabitacion: 1})
      .lean();

    // Verificar si existen habitaciones
    if (!rooms.length) {
      return res.render("index", {
        company,
        permisosRole,
        user,
        sales,
        products,
        stores,
        users,
        categoriesRoom,
        rooms: [],
        roomsDisponible: 0,
        roomsOcupada: 0,
        roomsReservada: 0,
        roomsEnLimpieza: 0,
        roomsEnMantenimiento: 0,
        roomsLimpiezaPendiente: 0,
        roomsLimpiezaIntermedia: 0,
        roomsHistory: [],
      });
    }

    // Obtener mantenimientos de habitaciones
    const maintenanceRooms = await MaintenanceRoom.find({finalizadoMantenimiento: false})
      .populate("usuarioRegistroMantenimiento")
      .populate({
        path: "habitacionMantenimiento",
        populate: "categoriaHabitacion"
      })
      .populate("tipoMantenimiento")
      .populate("usuarioMantenimiento")
      .lean();

    // Obtener las reservaciones de habitaciones
    const reservations = await Reservation.find({
      $and: [
        {
          habitacionReserva: { $in: rooms.map(room => room._id) },
          estadoReserva: { $in: ['Pendiente', 'Confirmada', 'Proxima', "Tardada", "Limpieza Intermedia", "Ocupada", "Extendida"] }
        },
        { finalizadaReserva: false }
      ]
    }).lean();

    // Obtener las ocupaciones de habitaciones
    const occupations = await Occupation.find({
      $and: [
        {
          habitacionOcupacion: { $in: rooms.map(room => room._id) },
          estadoOcupacion: { $in: ["En Curso", "Limpieza Intermedia", "Expirando", "Extendida"] }
        },
        { finalizadoOcupacion: false }
      ]
    }).lean();

    // Agregar los IDs de las actividades a las habitaciones
    const roomsInActivity = rooms.map(room => {
      const maintenance = maintenanceRooms.find(m => m.habitacionMantenimiento._id.toString() === room._id.toString());
      const reservation = reservations.find(r => r.habitacionReserva._id.toString() === room._id.toString());
      const occupation = occupations.find(o => o.habitacionOcupacion._id.toString() === room._id.toString());

      return {
        ...room,
        maintenanceRoomId: maintenance ? maintenance._id : null,
        reservationId: reservation ? reservation._id : null,
        occupationId: occupation ? occupation._id : null,
      };
    });

    // Obtener estados de habitaciones
    const roomsDisponible = rooms.filter(room => room.estadoHabitacion.toString() === "Disponible").length;
    const roomsOcupada = rooms.filter(room => room.estadoHabitacion.toString() === "Ocupado").length;
    const roomsReservada = rooms.filter(room => room.estadoHabitacion.toString() === "Reservado").length;
    const roomsEnLimpieza = rooms.filter(room => room.estadoHabitacion.toString() === "En Limpieza").length;
    const roomsEnMantenimiento = rooms.filter(room => room.estadoHabitacion.toString() === "En Mantenimiento").length;
    const roomsLimpiezaPendiente = rooms.filter(room => room.estadoHabitacion.toString() === "Limpieza Pendiente").length;
    
    // Obtener historial de habitaciones
    const roomsHistory = await RoomHistory.find()
      .populate({
        path: "habitacionHistorial",
        populate: [
          { path: "usuarioRegistroHabitacion" },
          { path: "estadoHabitacion" },
          { path: "categoriaHabitacion" },
        ]
      })
      .sort({ createdAt: -1 })
      .lean();

    res.render("index", {
      company,
      permisosRole,
      user,
      sales,
      products,
      stores,
      users,
      categoriesRoom,
      rooms: roomsInActivity,
      roomsDisponible,
      roomsOcupada,
      roomsReservada,
      roomsEnLimpieza,
      roomsEnMantenimiento,
      roomsLimpiezaPendiente,
      roomsHistory
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al renderizar la página de inicio, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

module.exports = indexCtrl;