const hotelCtrl = {};

const Room = require("../models/roomModel");
const RoomHistory = require("../models/roomHistoryModel");
const CategoryRooms = require("../models/categoryRoomModel");
const MaintenanceRoom = require("../models/maintenanceRoomModel");
const Reservation = require("../models/reservationModel");
const Occupation = require("../models/occupationModel");

hotelCtrl.renderHotel = async (req, res) => {
  try {
    // Obtener las categorías de habitación
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

    // Verificar si hay habitaciones creadas
    if (!rooms.length) {
      const userRole = req.user.trabajadorUsuario.rolTrabajador.nombreRol;
      return res.render("hotel/hotel-index", {
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
        userRole
      });
    }

    // Obtener las mantenimientos de habitaciones
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

    const userRole = req.user.trabajadorUsuario.rolTrabajador.nombreRol;
    res.render("hotel/hotel-index", {
      categoriesRoom,
      rooms: roomsInActivity,
      roomsDisponible,
      roomsOcupada,
      roomsReservada,
      roomsEnLimpieza,
      roomsEnMantenimiento,
      roomsLimpiezaPendiente,
      roomsHistory,
      userRole
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al renderizar la página de inicio, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};


module.exports = hotelCtrl;