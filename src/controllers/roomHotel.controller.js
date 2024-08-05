const roomHotelCtrl = {};

const RoomHotel = require("../models/roomHotelModel");
const RoomHotelHistory = require("../models/roomHotelHistoryModel");
const Room = require("../models/roomModel");
const StatusRoom = require("../models/statusRoomModel");

// Renderizar vista de registro de habitación de hotel
roomHotelCtrl.renderRegisterRoomHotel = async (req, res) => {
  try {
    const rooms = await Room.find({enHotelHabitacion: false, eliminadoHabitacion: false})
      .populate("categoriaHabitacion")
      .lean();
    const statusRooms = await StatusRoom.find({eliminadoEstadoHabitacion: false})
      .lean();
    console.log("Rooms: ", rooms);
    console.log("StatusRooms: ", statusRooms);
    const userRole = req.user.trabajadorUsuario.rolTrabajador.nombreRol;
    res.render("hotel/rooms-hotel/new-room-hotel", {
      rooms,
      statusRooms,
      userRole
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al cargar el formulario de nueva habitación, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Registrar nueva habitación de hotel
roomHotelCtrl.registerRoomHotel = async (req, res) => {
  try {
    const {
      habitacionHotel,
      precioHabitacionHotel,
      cantidadUsosHabitacionHotel,
      estadoHabitacionHotel
    } = req.body;
    console.log("Req.body: ", req.body);

    const isExistsRoom = await RoomHotel.findOne({habitacionHotel, eliminadoHabitacionHotel: false});
    if (isExistsRoom) {
      req.flash("wrong", "Ya existe una habitación con los mismos datos, intente registrarla de nuevo.");
      res.redirect("/rooms-hotel");
    } else {
      const newRoomHotel = new RoomHotel({
        usuarioRegistroHabitacionHotel: req.user._id,
        habitacionHotel,
        precioHabitacionHotel,
        cantidadUsosHabitacionHotel,
        estadoHabitacionHotel
      });
      console.log("Nueva habitación: ", newRoomHotel);

      const roomHotelId = newRoomHotel._id;

      // Agregar al historial
      const newRoomHotelHistory = new RoomHotelHistory({
        tipoHistorial: "Registro",
        habitacionHotelHistorial: roomHotelId,
      });
      console.log("Nuevo historial: ", newRoomHotelHistory);

      // Guardamos ambos datos en la BD
      await newRoomHotel.save();
      await newRoomHotelHistory.save();
      await Room.findByIdAndUpdate(habitacionHotel, {enHotelHabitacion: true});

      req.flash("success", "Habitación registrada exitosamente");
      res.redirect("/rooms-hotel");
    }
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al registrar la nueva habitación, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Mostrar lista de habitaciones de hotel
roomHotelCtrl.renderRoomHotel = async (req, res) => {
  try {
    const roomsHotel = await RoomHotel.find({eliminadoHabitacionHotel: false})
      .populate("usuarioRegistroHabitacionHotel")
      .populate({
        path: "habitacionHotel",
        populate: "categoriaHabitacion"
      })
      .populate("estadoHabitacionHotel")
      .sort({createdAt: -1})
      .lean();
    console.log("Rooms: ", roomsHotel);
    const userRole = req.user.trabajadorUsuario.rolTrabajador.nombreRol;
    res.render("hotel/rooms-hotel/all-rooms-hotel", {roomsHotel, userRole});
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al cargar la lista de habitaciones, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Renderizar formulario de edición de habitación de hotel
roomHotelCtrl.renderEditRoomHotel = async (req, res) => {
  try {
    const {id} = req.params;

    const roomHotel = await RoomHotel.findById(id)
      .populate("usuarioRegistroHabitacionHotel")
      .populate({
        path: "habitacionHotel",
        populate: "categoriaHabitacion"
      })
      .populate("estadoHabitacionHotel")
      .lean();

    const rooms = await Room.find({eliminadoHabitacion: false})
      .populate("usuarioRegistroHabitacion")
      .populate("categoriaHabitacion")
      .lean();

    const statusRooms = await StatusRoom.find({eliminadoEstadoHabitacion: false})
      .lean();

    const userRole = req.user.trabajadorUsuario.rolTrabajador.nombreRol;

    console.log("roomHotel: ", roomHotel);

    res.render("hotel/rooms-hotel/edit-room-hotel", {
      roomHotel,
      rooms,
      statusRooms,
      userRole
      });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al cargar el formulario de edición, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Actualizar la habitación de hotel
roomHotelCtrl.updateRoomHotel = async (req, res) => {
  try {
    const {id} = req.params;
    const updatedRoomHotel = await RoomHotel.findByIdAndUpdate(id, req.body)
      .lean();

    if (!updatedRoomHotel) {
      req.flash("wrong", "La habitación no existe");
      return res.redirect("/rooms-hotel");
    };

    req.flash("success", "Habitación de hotel actualizada exitosamente");
    res.redirect("/rooms-hotel");
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al actualizar la habitación, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Renderizar confirmación de eliminación de habitación de hotel
roomHotelCtrl.renderDeleteRoomHotel = async (req, res) => {
  try {
    const {id} = req.params;
    const roomHotel = await RoomHotel.findById(id)
      .populate("usuarioRegistroHabitacionHotel")
      .populate({
        path: "habitacionHotel",
        populate: "categoriaHabitacion"
      })
      .populate("estadoHabitacionHotel")
      .lean();
    console.log("RoomHotel: ", roomHotel);
    const userRole = req.user.trabajadorUsuario.rolTrabajador.nombreRol;
    res.render("hotel/rooms-hotel/delete-room-hotel", {roomHotel, userRole});
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al eliminar la habitación, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Eliminar la habitación de hotel
roomHotelCtrl.deleteRoomHotel = async (req, res) => {
  try {
    const {id} = req.params;
    const deletedRoomHotel = await RoomHotel.findById(id)
      .populate("usuarioRegistroHabitacionHotel")
      .populate({
        path: "habitacionHotel",
        populate: "categoriaHabitacion"
      })
      .populate("estadoHabitacionHotel")
      .lean();
    
    console.log("DeletedRoomHotel: ", deletedRoomHotel);
    if (!deletedRoomHotel) {
      req.flash("wrong", "La habitación no existe");
      return res.redirect("/rooms-hotel");
    };

    // Eliminar la habitación de hotel
    await RoomHotel.findByIdAndUpdate(id, {eliminadoHabitacionHotel: true});

    // Agregar al historial el producto eliminado
    const newRoomHotelHistory = new RoomHotelHistory({
      tipoHistorial: "Eliminado",
      habitacionHotelHistorial: deletedRoomHotel._id
    });

    console.log(newRoomHotelHistory);
    await newRoomHotelHistory.save();

    // Cambiar enHotelHabitacion a false
    await Room.findByIdAndUpdate(deletedRoomHotel.habitacionHotel, {enHotelHabitacion: false});

    req.flash("success", "Habitación eliminada exitosamente");
    res.redirect("/rooms-hotel");
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al eliminar la habitación, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

module.exports = roomHotelCtrl;