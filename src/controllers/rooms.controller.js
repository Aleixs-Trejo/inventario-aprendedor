const roomsCtrl = {};

const Room = require("../models/roomModel");
const Floor = require("../models/floorModel");
const RoomCategory = require("../models/categoryRoomModel");
const RoomHistory = require("../models/roomHistoryModel");

// Renderizar formulario de nueva habitación
roomsCtrl.renderRegisterRoom = async (req, res) =>{
  try {
    const floors = await Floor.find({eliminadoPiso: false}).lean();
    const roomCategories = await RoomCategory.find({eliminadoCategoriaHabitacion: false}).lean();
    console.log("RoomCategories: ", roomCategories);
    const userRole = req.user.trabajadorUsuario.rolTrabajador.nombreRol;
    res.render("hotel/rooms/new-room", {
      floors,
      roomCategories,
      userRole
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al cargar el formulario de nueva habitación, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Registrar nueva habitación
roomsCtrl.registerRoom = async (req, res) => {
  try {
    const {
      pisoHabitacion,
      numeroHabitacion,
      descripcionHabitacion,
      categoriaHabitacion,
      precioHabitacion
    } = req.body;
    console.log("Req.body: ", req.body);

    const isExistsRoom = await Room.findOne({
      pisoHabitacion,
      numeroHabitacion,
      descripcionHabitacion,
      categoriaHabitacion
    });

    if (isExistsRoom) {
      req.flash("wrong", "Ya existe una habitación con los mismos datos, intente registrarla de nuevo.");
      res.redirect("/rooms");
    }

    const precioValidate = parseFloat(precioHabitacion);
    if (isNaN(precioValidate) || precioValidate <= 0) {
      req.flash("wrong", "El precio de la habitación no es válido, debe ser un número mayor a 0");
      res.redirect("/rooms");
    }

    const newRoom = new Room({
      usuarioRegistroHabitacion: req.user._id,
      pisoHabitacion,
      numeroHabitacion,
      descripcionHabitacion,
      categoriaHabitacion,
      precioHabitacion: precioValidate,
      estadoHabitacion: "Disponible"
    });

    console.log("Nueva habitación: ", newRoom);

    const roomId = newRoom._id;
    // Agregar al historial
    const newRoomHistory = new RoomHistory({
      tipoHistorial: "Registro",
      habitacionHistorial: roomId,
    });

    console.log("Nuevo historial: ", newRoomHistory);

    // Guardamos ambos datos en la BD
    await newRoom.save();
    await newRoomHistory.save();

    req.flash("success", "Habitación registrada exitosamente");
    res.redirect("/rooms");
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al registrar la nueva habitación, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Mostrar Habitaciones
roomsCtrl.renderRooms = async (req, res) => {
  try {
    // Cargar todos los datos de la BD
    const rooms = await Room.find({eliminadoHabitacion: false})
      .populate("usuarioRegistroHabitacion")
      .populate("pisoHabitacion")
      .populate("categoriaHabitacion")
      .lean();

    const userRole = req.user.trabajadorUsuario.rolTrabajador.nombreRol;
    res.render("hotel/rooms/all-rooms", {
      rooms,
      userRole
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al cargar la lista de habitaciones, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Renderizar formulario de edición de habitación
roomsCtrl.renderEditRoom = async (req, res) => {
  try {
    const {id} = req.params;
    const room = await Room.findById(id)
      .populate("usuarioRegistroHabitacion")
      .populate("categoriaHabitacion")
      .lean();
  
    if (!room) {
      req.flash("wrong", "La habitación no existe");
      return res.redirect("/rooms");
    };

    if (room.estadoHabitacion !== "Disponible") {
      req.flash("wrong", "No se puede editar la habitación, debe estar disponible");
      return res.redirect("/rooms");
    };

    const roomCategories = await RoomCategory.find({
      eliminadoCategoriaHabitacion: false
    }).lean();

    if (!roomCategories) {
      req.flash("wrong", "Ocurrió un error al cargar los datos, intente nuevamente.");
      return res.redirect("/rooms");
    };

    const userRole = req.user.trabajadorUsuario.rolTrabajador.nombreRol;
    console.log("roomCategories: ", roomCategories);
    res.render("hotel/rooms/edit-room", {
      room,
      roomCategories: roomCategories.reduce((acc, roomCategory) => {
        acc[roomCategory._id] = roomCategory;
        return acc;
      }, {}),
      userRole
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al cargar el formulario de edición, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Actualizar la habitación
roomsCtrl.updateRoom = async (req, res) => {
  try {
    const {id} = req.params;
    await Room.findByIdAndUpdate(id, req.body);
    req.flash("success", "Habitación actualizada exitosamente");
    res.redirect("/rooms");
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al actualizar la habitación, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Renderizar confirmación de eliminación de habitación
roomsCtrl.renderDeleteRoom = async (req, res) => {
  try {
    const {id} = req.params;
    const room = await Room.findById(id)
      .populate("usuarioRegistroHabitacion")
      .populate("pisoHabitacion")
      .populate("categoriaHabitacion")
      .lean();

    if (room.estadoHabitacion !== "Disponible") {
      req.flash("wrong", "No se puede eliminar la habitación, debe estar disponible");
      return res.redirect("/rooms");
    };
    
    res.render("hotel/rooms/delete-room", {room});
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al cargar la eliminación, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Eliminar la habitación
roomsCtrl.deleteRoom = async (req, res) => {
  try {
    const {id} = req.params;
    const deletedRoom = await Room.findById(id);

    if (!deletedRoom) {
      req.flash("wrong", "La habitación no existe");
      return res.redirect("/rooms");
    };

    if (deletedRoom.estadoHabitacion !== "Disponible") {
      req.flash("wrong", "No se puede eliminar la habitación, debe estar disponible");
      return res.redirect("/rooms");
    };

    // Eliminar la habitación
    await Room.findByIdAndUpdate(id, {eliminadoHabitacion: true});

    const deletedRoomId = deletedRoom._id;

    // Agregar al historial el producto eliminado
    const newRoomHistory = new RoomHistory({
      tipoHistorial: "Eliminado",
      habitacionHistorial: deletedRoomId
    });

    console.log(newRoomHistory);
    await newRoomHistory.save();

    req.flash("success", "Habitación eliminada exitosamente");
    res.redirect("/rooms");
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al eliminar la habitación, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

module.exports = roomsCtrl;