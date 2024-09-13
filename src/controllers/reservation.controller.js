const reservationCtrl = {};

const Reservation = require('../models/reservationModel');
const ReservationHistory = require('../models/reservationHistoryModel');
const Room = require("../models/roomModel");
const User = require("../models/userModel");
const StoreHotel = require("../models/storeHotelModel");
const SaleHotel = require("../models/saleHotelModel");
const SaleHotelHistory = require("../models/saleHotelHistoryModel");
const Cleaning = require("../models/cleaningModel");
const CleaningHistory = require("../models/cleaningHistoryModel");
const CheckOutHotel = require("../models/checkOutHotelModel");

// Renderizar formulario de reserva de habitación
reservationCtrl.renderRegisterReservation = async (req, res) => {
  try {
    const {id} = req.params;
    const room = await Room.findById(id)
      .populate("usuarioRegistroHabitacion")
      .populate("pisoHabitacion")
      .populate("categoriaHabitacion")
      .populate("estadoHabitacion")
      .lean();
    const userRole = req.user.trabajadorUsuario.rolTrabajador.nombreRol;

    res.render("hotel/reservation/new-reservation", {
      room,
      userRole
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al cargar el formulario de nueva habitación, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Registrar reserva de habitación
reservationCtrl.registerReservation = async (req, res) => {
  try {
    const {
      dniClienteReserva,
      nombreClienteReserva,
      celularClienteReserva,
      correoClienteReserva,
      habitacionReserva,
      fechaInicioReserva,
      fechaFinReserva,
      nochesReserva,
      importeReserva,
      adelantoReserva,
      observacionesReserva,
    } = req.body;
    console.log("Req.body: ", req.body);

    const isExistsReservation = await Reservation.findOne({
      dniClienteReserva,
      nombreClienteReserva,
      habitacionReserva,
      finalizadaReserva: false
    });

    if (isExistsReservation) {
      req.flash("wrong", "Ya existe una reserva para esta combinación de cliente y habitación");
      return res.redirect("/hotel");
    }

    const nochesParseadas = parseInt(nochesReserva);
    const importeParseadas = parseInt(importeReserva);
    const adelantoParseadas = parseInt(adelantoReserva);

    const restanteParseado = importeParseadas - adelantoParseadas;

    if (isNaN(nochesParseadas) || isNaN(adelantoParseadas) || nochesParseadas <= 0 || adelantoParseadas < 0) {
      req.flash("error", "El número de noches y adelanto de la reserva no es válido, debe ser un número");
      res.redirect("/hotel");
    }

    const newReservation = new Reservation({
      usuarioReserva: req.user._id,
      dniClienteReserva,
      nombreClienteReserva,
      celularClienteReserva,
      correoClienteReserva,
      habitacionReserva,
      fechaInicioReserva,
      fechaFinReserva,
      nochesReserva: nochesParseadas,
      importeReserva: importeParseadas,
      adelantoReserva: adelantoParseadas,
      restanteReserva: restanteParseado,
      limpiezaReserva: false,
      estadoReserva: adelantoParseadas > 0 ? "Confirmada" : "Pendiente",
      observacionesReserva,
    });
    await newReservation.save();

    // Actualizar el estado de la habitación
    await Room.findByIdAndUpdate(habitacionReserva, {estadoHabitacion: "Reservado"});


    // Generar el historial de la reserva
    const newReservationHistory = new ReservationHistory({
      tipoHistorial: "Reserva",
      reservacionHistorial: newReservation._id
    });
    console.log("New reservation history: ", newReservationHistory);
    await newReservationHistory.save();

    req.flash("success", "Reserva registrada correctamente");
    return res.redirect("/hotel");

  } catch (error) {
    req.flash("wrong", "Ocurrió un error al registrar la nueva habitación, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

reservationCtrl.renderAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({finalizadaReserva: false})
      .populate("usuarioReserva")
      .populate({
        path: "habitacionReserva",
        populate: "pisoHabitacion categoriaHabitacion"
      })
      .sort({createdAt: -1})
      .lean();
    
    const userRole = req.user.trabajadorUsuario.rolTrabajador.nombreRol;
    console.log("Reservations: ", reservations);
    res.render("hotel/reservation/all-reservations", {
      reservations,
      userRole
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al cargar los detalles de la reserva, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Mostrar todas las reservas de habitaciones
reservationCtrl.renderDetailsReservation = async (req, res) => {
  try {
    const {id} = req.params;
    const reservation = await Reservation.findById(id)
      .populate({
        path: "usuarioReserva",
        populate: "trabajadorUsuario"
      })
      .populate({
        path: "habitacionReserva",
        populate: "pisoHabitacion categoriaHabitacion estadoHabitacion"
      })

    if (reservation) {
      await reservation.actualizarEstadoReserva();
    }

    const reservationLean = reservation.toObject();

    const saleReservation = await SaleHotel.find({
        ventaCerradaHotel: false,
        eliminadoVentaHotel: false,
        referenciEntidad: reservation._id,
        tipoEntidad: "Reservation"
      })
      .populate({
        path: "usuarioRegistroVentaHotel",
        populate: {
          path: "trabajadorUsuario",
          populate: {
            path: "rolTrabajador"
          }
        }
      })
      .populate({
        path: "productosVentaHotel.productoVentaHotel",
        populate: {
          path: "productoAlmacenHotel",
          populate: {
            path: "proveedorProducto categoriaProducto"
          }
        }
      })
      .lean();

    const cleaningRoom = await Cleaning.findOne({
        referenciaEntidad: reservation._id,
        tipoEntidad: "Reservation",
      })
      .populate({
        path: "usuarioRegistroLimpieza",
        populate: "trabajadorUsuario"
      })
      .populate({
        path: "usuarioACargoLimpieza",
        populate: "trabajadorUsuario"
      })
      .lean();

    const cleaningComplete = cleaningRoom && cleaningRoom.fechaFinLimpieza;
    
    const userRole = req.user.trabajadorUsuario.rolTrabajador.nombreRol;
    console.log("saleReservation: ", saleReservation);
    res.render("hotel/reservation/detail-reservation", {
      reservation: reservationLean,
      saleReservation,
      cleaningRoom,
      cleaningComplete,
      userRole
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al cargar los detalles de la reserva, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Cancelar una reserva, mandar el checkout como "Registro", el adelantoReservacion mandarlo como importe y tipoUsoCheckOut como "Anulacion"
reservationCtrl.cancelReservation = async (req, res) => {
  try{
    const {id} = req.params;
    const reservation = await Reservation.findById(id);

    if (!reservation) {
      req.flash("wrong", "No existe la reserva");
      return res.redirect("/hotel");
    }

    const adelantoReserva = parseFloat(reservation.adelantoReserva);

    const newCheckOutHotel = new CheckOutHotel({
      usuarioRegistroCheckOut: req.user._id,
      tipoUsoCheckOut: "Anulacion",
      comentariosCheckOut: "",
      importeAdicionalCheckOut: 0,
      descuentoCheckOut: 0,
      importeTotalCheckOut: adelantoReserva,
      eliminadoCheckOut: false,
      referenciaCheckOut: reservation._id,
      tipoCheckOut: "Reservation"
    });
    console.log("New checkout hotel: ", newCheckOutHotel);
    await newCheckOutHotel.save();

    // Actualizar el estado de la reserva
    reservation.estadoReserva = "Finalizada";
    reservation.finalizadaReserva = true;
    await reservation.save();

    // Actualizar el estado de la habitación
    const room = await Room.findById(reservation.habitacionReserva._id);
    room.estadoHabitacion = "Disponible";
    await room.save();

    // Generar el historial de la reserva
    const newReservationHistory = new ReservationHistory({
      tipoHistorial: "Anulado",
      reservacionHistorial: reservation._id
    });

    console.log("New reservation history: ", newReservationHistory);
    await newReservationHistory.save();

    req.flash("success", "Reserva cancelada correctamente");
    return res.redirect("/hotel");
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al cancelar la reserva, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Renderizar formulario de edición de reserva
reservationCtrl.renderEditReservation = async (req, res) => {
  try {
    const {id} = req.params;
    const reservation = await Reservation.findById(id)
      .populate({
        path: "usuarioReserva",
        populate: "trabajadorUsuario"
      })
      .populate({
        path: "habitacionReserva",
        populate: "pisoHabitacion categoriaHabitacion"
      })
      .lean();

    const room = await Room.findById(reservation.habitacionReserva._id)
      .populate({
        path: "usuarioRegistroHabitacion",
        populate: "trabajadorUsuario"
      })
      .populate("pisoHabitacion categoriaHabitacion")
      .lean();
    
    const userRole = req.user.trabajadorUsuario.rolTrabajador.nombreRol;
    res.render("hotel/reservation/edit-reservation", {
      reservation,
      room,
      userRole
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al cargar el formulario de edición de la reserva, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Actualizar la reserva
reservationCtrl.updateReservation = async (req, res) => {
  try {
    const {id} = req.params;
    const {
      habitacionReserva,
      dniClienteReserva,
      nombreClienteReserva,
      celularClienteReserva,
      correoClienteReserva,
      fechaInicioReserva,
      fechaFinReserva,
      nochesReserva,
      importeReserva,
      adelantoReserva,
      observacionesReserva,
    } = req.body;
    console.log("Req.body: ", req.body);

    const nochesParseadas = parseInt(nochesReserva);
    const importeParseadas = parseInt(importeReserva);
    const adelantoParseadas = parseInt(adelantoReserva);

    const restanteParseado = importeParseadas - adelantoParseadas;
    
    if (isNaN(nochesParseadas) || isNaN(adelantoParseadas) || nochesParseadas <= 0 || adelantoParseadas < 0) {
      req.flash("error", "El número de noches y adelanto de la reserva no es válido, debe ser un número");
      res.redirect("/hotel");
    }

    await Reservation.findByIdAndUpdate(id, {
      habitacionReserva,
      dniClienteReserva,
      nombreClienteReserva,
      celularClienteReserva,
      correoClienteReserva,
      fechaInicioReserva,
      fechaFinReserva,
      nochesReserva: nochesParseadas,
      importeReserva: importeParseadas,
      adelantoReserva: adelantoParseadas,
      restanteReserva: restanteParseado,
      estadoReserva: adelantoParseadas > 0 ? "Confirmada" : "Pendiente",
      observacionesReserva,
    });

    req.flash("success", "Reserva actualizada correctamente");
    return res.redirect("/hotel");
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al actualizar la reserva, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Confirmar ingreso de huesped
reservationCtrl.confirmEntering = async (req, res) => {
  try {
    const {id} = req.params;
    const reservation = await Reservation.findById(id);

    if (!reservation) {
      req.flash("wrong", "No existe la reserva");
      return res.redirect("/hotel");
    }

    if (reservation.estadoReserva !== "Pendiente") {
      reservation.estadoReserva = "Ocupada";
      await reservation.save();
      req.flash("success", "Ingreso de huesped confirmado correctamente");
      return res.redirect(`/reservation/${id}/details`);
    } else {
      req.flash("wrong", "La reserva no está confirmada");
      return res.redirect(`/reservation/${id}/details`);
    }
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al confirmar ingreso de huesped, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

//Renderizar formularo de venta a la reserva
reservationCtrl.renderSaleReservation = async (req, res) => {
  try {
    const {id} = req.params;
    const reservationId = id;
    const actionUrl = `/reservation/${reservationId}/sale`;
    const backUrl = `/reservation/${reservationId}/details`;
    const reservation = await Reservation.findById(id)
      .populate({
        path: "usuarioReserva",
        populate: "trabajadorUsuario"
      })
      .populate({
        path: "habitacionReserva",
        populate: "pisoHabitacion categoriaHabitacion"
      })
      .lean();

    const room = await Room.findById(reservation.habitacionReserva._id)
      .populate({
        path: "usuarioRegistroHabitacion",
        populate: "trabajadorUsuario"
      })
      .populate("pisoHabitacion categoriaHabitacion")
      .lean();

    const storeHotel = await StoreHotel.find({eliminadoProductoAlmacenHotel: false})
      .populate({
        path: "usuarioRegistroAlmacenHotel",
        populate: {
          path: "trabajadorUsuario",
          populate: "rolTrabajador"
        }
      })
      .populate({
        path: "productoAlmacenHotel",
        populate: "proveedorProducto categoriaProducto"
      })
      .sort({createdAt: -1})
      .lean();

    const currentUser = req.user;
    res.render("hotel/sales/new-sale-hotel", {
      actionUrl,
      backUrl,
      reservation,
      room,
      storeHotel,
      currentUser
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al cargar el formulario de venta a la reserva, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Registrar venta a la reserva
reservationCtrl.registerSaleReservation = async (req, res) => {
  try {
    const {id} = req.params;
    const {
      productosVentaHotel,
      precioTotalVentaHotel,
      descuentoTotalVentaHotel,
      pagoAdelantoVentaHotel,
      comentariosVentaHotel
    } = req.body;
    console.log("Req.body: ", req.body);

    // Verificar si productosVenta es un array
    if (!Array.isArray(productosVentaHotel)) {
      throw new Error("productosVentaHotel debe ser un array.");
    }

    if (productosVentaHotel.length === 0) {
      throw new Error("productosVentaHotel debe tener al menos un producto.");
    }

    const reservation = await Reservation.findById(id);

    if (!reservation) {
      req.flash("wrong", "La reserva no existe.");
      return res.redirect("/hotel");
    }

    // Array para almacenar productos vendidos
    const productosVendidos = [];

    // Recorrer productosVenta
    for (const producto of productosVentaHotel) {
      const { productoVentaHotel, cantidadVentaHotel, descuentoProductoVentaHotel, importeProductoVentaHotel } = producto

      // Buscar el producto en el almacén
      const productInStoreHotel = await StoreHotel.findById(productoVentaHotel).populate('productoAlmacenHotel');

      if (productInStoreHotel) {
        // Nos aseguramos que la cantidad de venta y el precio unitario sean numeros
        const cantidadProductoNum = Number(cantidadVentaHotel);
        const importeProductoNum = Number(importeProductoVentaHotel);

        // Verificar si cantidadProducto y precioTotalProducto son números válidos
        if (isNaN(cantidadProductoNum) || isNaN(importeProductoNum)) {
          throw new Error("cantidadProductoNum e importeProductoNum deben ser números.");
        }

        // Verificar si descuentoProductoVenta es un número válido
        const descuentoProductoNum = Number(descuentoProductoVentaHotel);
        if (isNaN(descuentoProductoNum)) {
          throw new Error("descuentoProductoNum debe ser un número.");
        }

        // Producto encontrado, agregarlo al array de productos vendidos
        productosVendidos.push({
          productoVentaHotel,
          cantidadVentaHotel: cantidadProductoNum,
          descuentoProductoVentaHotel: descuentoProductoNum,
          precioTotalProductoVentaHotel: importeProductoNum
        });

        // Actualizar el stock del almacén
        productInStoreHotel.stockProductoAlmacenHotel -= cantidadProductoNum;
        await productInStoreHotel.save();

      } else {
        req.flash("wrong", "El producto no se encontró en el almacén, intentelo de nuevo");
      }
    }

    // Calcular el precio total de la venta
    const precioTotalVentaHotelParseado = parseFloat(precioTotalVentaHotel);

    const pagoAdelantoVentaHotelParseado = parseFloat(pagoAdelantoVentaHotel);

    const descuentoTotalVentaHotelParseado = parseFloat(descuentoTotalVentaHotel);

    const pagoRestanteVentaHotelParseado = precioTotalVentaHotelParseado - pagoAdelantoVentaHotel;

    // Calcular la cantidad de productos vendidos
    const cantidadProductosVentaHotel = productosVendidos.length;
    console.log("precioTotalVentaHotelParseado: ", precioTotalVentaHotelParseado);
    console.log("pagoAdelantoVentaHotelParseado: ", pagoAdelantoVentaHotelParseado);
    console.log("pagoRestanteVentaHotelParseado: ", pagoRestanteVentaHotelParseado);
    console.log("descuentoTotalVentaHotelParseado: ", descuentoTotalVentaHotelParseado);

    // Crear la nueva venta
    const newSaleHotel = new SaleHotel({
      usuarioRegistroVentaHotel: req.user._id,
      estadoVentaHotel: pagoAdelantoVentaHotel === precioTotalVentaHotelParseado ? "Confirmada" : "Pendiente",
      productosVentaHotel: productosVendidos,
      cantidadProductosVentaHotel,
      precioTotalVentaHotel: precioTotalVentaHotelParseado,
      descuentoTotalVentaHotel: descuentoTotalVentaHotelParseado,
      pagoAdelantoVentaHotel: pagoAdelantoVentaHotelParseado,
      pagoRestanteVentaHotel: pagoRestanteVentaHotelParseado,
      ventaPagadaHotel: pagoAdelantoVentaHotelParseado === precioTotalVentaHotelParseado ? true : false,
      comentariosVentaHotel,
      referenciEntidad: reservation._id,
      tipoEntidad: "Reservation"
    });
    console.log("New sale hotel: ", newSaleHotel);
    await newSaleHotel.save();

    req.flash("success", "Venta registrada exitosamente.");
    return res.redirect(`/reservation/${id}/details`);
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al registrar la venta, intente nuevamente");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Anular una venta de la reserva
reservationCtrl.cancelSaleReservation = async (req, res) => {
  try {
    const {id} = req.params;

    // Buscar la venta
    const sale = await SaleHotel.findById(id);

    // Bsucar la reserva
    const reservation = await Reservation.findById(sale.referenciEntidad);
    
    if (!sale) {
      req.flash("wrong", "La venta no existe");
      return res.redirect(`/reservation/${reservation._id}/details`);
    }

    if (sale.estadoVentaHotel === "Cancelada") {
      req.flash("wrong", "La venta ya fue cancelada");
      return res.redirect(`/reservation/${reservation._id}/details`);
    }

    // Actualizar el estado de la venta
    sale.estadoVentaHotel = "Cancelada";
    await sale.save();

    // Devolver los productos al almacén del hotel
    for (const producto of sale.productosVentaHotel) {
      const storeProduct = await StoreHotel.findById(producto.productoVentaHotel);
      storeProduct.stockProductoAlmacenHotel += producto.cantidadVentaHotel;
      await storeProduct.save();
    }

    req.flash("success", "Venta anulada exitosamente");
    return res.redirect(`/reservation/${reservation._id}/details`);
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al cancelar la venta, intente nuevamente");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Renderizar formulario de limpieza intermedia
reservationCtrl.renderCleaningRoomReservation = async (req, res) => {
  try {
    const {id} = req.params;
    const actionUrl = `/reservation/${id}/cleaning`;
    const reservation = await Reservation.findById(id)
      .populate({
        path: "usuarioReserva",
        populate: "trabajadorUsuario"
      })
      .populate({
        path: "habitacionReserva",
        populate: "pisoHabitacion categoriaHabitacion"
      })
      .lean();

    const room = await Room.findById(reservation.habitacionReserva._id)
      .populate({
        path: "usuarioRegistroHabitacion",
        populate: "trabajadorUsuario"
      })
      .populate("pisoHabitacion categoriaHabitacion")
      .lean();

    const usuarios = await User.find({eliminadoUsuario: false})
      .populate({
        path: "trabajadorUsuario",
        populate: {
          path: "rolTrabajador"
        }
      })
      .lean();

    const userRole = req.user.trabajadorUsuario.rolTrabajador.nombreRol;
    res.render("hotel/cleaning/cleaning-room", {
      actionUrl,
      reservation,
      room,
      usuarios,
      userRole
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al cargar el formulario de limpieza intermedia, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Registrar limpieza intermedia
reservationCtrl.cleaningRoomReservation = async (req, res) => {
  try {
    const {id} = req.params;
    const {
      usuarioACargoLimpieza,
      comentariosLimpieza,
    } = req.body;
    console.log("Req.body: ", req.body);

    const reservation = await Reservation.findById(id);

    if (!reservation) {
      req.flash("wrong", "No existe la reserva");
      return res.redirect("/hotel");
    }

    const isExistsRoomInCleaning = await Cleaning.findOne({
      referenciaEntidad: reservation._id,
      tipoEntidad: "Reservation",
      finalizadoLimpieza: false
    });

    if (isExistsRoomInCleaning) {
      req.flash("wrong", "Esta habitación ya está en limpieza.");
      return res.redirect(`/reservation/${id}/details`);
    }

    const newCleaning = new Cleaning({
      usuarioRegistroLimpieza: req.user._id,
      usuarioACargoLimpieza,
      tipoLimpieza: "Reservacion",
      comentariosLimpieza,
      finalizadoLimpieza: false,
      referenciaEntidad: reservation._id,
      tipoEntidad: "Reservation"
    });
    console.log("New cleaning: ", newCleaning);
    await newCleaning.save();
    
    // Establecer limpiezaReserva a true y actualizar el estado de la reserva a Limpieza Intermedia
    reservation.limpiezaReserva = true;
    reservation.estadoReserva = "Limpieza Intermedia";
    await reservation.save();
    console.log("Reservation que pasó a limpieza: ", reservation);

    // Generar el historial de la limpieza
    const newCleaningHistory = new CleaningHistory({
      tipoHistorial: "Registro",
      limpiezaHistorial: newCleaning._id
    });

    console.log("Nuevo registro de limpieza en el historial de habitación: ", newCleaningHistory);
    await newCleaningHistory.save();

    req.flash("success", "Limpieza registrada correctamente.");
    res.redirect(`/reservation/${id}/details`);
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al registrar la limpieza intermedia, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

reservationCtrl.finalizeCleaningRoomReservation = async (req, res) => {
  try {
    const {id} = req.params;
    const reservation = await Reservation.findById(id);

    if (!reservation) {
      req.flash("wrong", "No existe la reserva");
      return res.redirect("/hotel");
    }

    const cleaning = await Cleaning.findOne({
      referenciaEntidad: reservation._id,
      tipoEntidad: "Reservation",
      finalizadoLimpieza: false
    });

    if (!cleaning) {
      req.flash("wrong", "No existe la limpieza");
      return res.redirect(`/reservation/${id}/details`);
    }

    // Finalizar la limpieza y volver el estado de la habitación a disponible
    cleaning.finalizadoLimpieza = true;
    cleaning.fechaFinLimpieza = Date.now();
    await cleaning.save();

    reservation.limpiezaReserva = false;
    reservation.estadoReserva = "Ocupada";
    await reservation.save();

    // Historial para limpieza
    const newCleaningHistory = new CleaningHistory({
      tipoHistorial: "Finalizado",
      limpiezaHistorial: cleaning._id
    });

    await newCleaningHistory.save();

    req.flash("success", "Limpieza finalizada exitosamente");
    res.redirect(`/reservation/${id}/details`);
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al finalizar la limpieza, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Renderizar checkout de la reserva
reservationCtrl.renderCheckOutReservation = async (req, res) => {
  try {
    const {id} = req.params;
    const reservationId = id;
    const actionUrl = `/reservation/${reservationId}/checkout`;
    const backUrl = `/reservation/${reservationId}/details`;
    const reservation = await Reservation.findById(id)
      .populate({
        path: "usuarioReserva",
        populate: "trabajadorUsuario"
      })
      .populate({
        path: "habitacionReserva",
        populate: "pisoHabitacion categoriaHabitacion estadoHabitacion"
      })
      .lean();

    const room = await Room.findById(reservation.habitacionReserva._id)
      .populate({
        path: "usuarioRegistroHabitacion",
        populate: "trabajadorUsuario"
      })
      .populate("pisoHabitacion categoriaHabitacion")
      .lean();

    const usuarios = await User.find({eliminadoUsuario: false})
      .populate({
        path: "trabajadorUsuario",
        populate: {
          path: "rolTrabajador"
        }
      })
      .lean();

    const cleaningRoom = await Cleaning.findOne({
        referenciaEntidad: reservation._id,
        tipoEntidad: "Reservation"
      })
      .populate({
        path: "usuarioRegistroLimpieza",
        populate: "trabajadorUsuario"
      })
      .populate({
        path: "usuarioACargoLimpieza",
        populate: "trabajadorUsuario"
      })
      .lean();

    const saleReservation = await SaleHotel.find({
        ventaCerradaHotel: false,
        eliminadoVentaHotel: false,
        referenciEntidad: reservation._id,
        tipoEntidad: "Reservation"
      })
      .populate({
        path: "usuarioRegistroVentaHotel",
        populate: {
          path: "trabajadorUsuario",
          populate: {
            path: "rolTrabajador"
          }
        }
      })
      .populate({
        path: "productosVentaHotel.productoVentaHotel",
        populate: {
          path: "productoAlmacenHotel",
          populate: {
            path: "proveedorProducto categoriaProducto"
          }
        }
      })
      .lean();

    const userRole = req.user.trabajadorUsuario.rolTrabajador.nombreRol;
    res.render("hotel/checkout/checkout-hotel-reservation", {
      actionUrl,
      backUrl,
      reservation,
      room,
      usuarios,
      cleaningRoom,
      saleReservation,
      userRole
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al cargar el formulario de checkout, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Registrar checkout de la reserva
reservationCtrl.checkOutReservation = async (req, res) => {
  try {
    const {id} = req.params;
    const {
      comentariosCheckOut,
      importeAdicionalCheckOut,
      descuentoCheckOut
    } = req.body;
    console.log("Req.body: ", req.body);

    const reservation = await Reservation.findById(id);

    if (!reservation) {
      req.flash("wrong", "No existe la reserva");
      return res.redirect("/hotel");
    }

    const isExistsRoomInCheckOut = await CheckOutHotel.findOne({
      referenciaCheckOut: reservation._id,
      tipoCheckOut: "Reservation",
      eliminadoCheckOut: false
    });

    if (isExistsRoomInCheckOut) {
      req.flash("wrong", "Esta habitación ya está en checkout.");
      return res.redirect("/hotel");
    }

    const sales = await SaleHotel.find({
        eliminadoVentaHotel: false,
        referenciEntidad: reservation._id,
        tipoEntidad: "Reservation",
        ventaCerradaHotel: false
      })
      .populate({
        path: "usuarioRegistroVentaHotel",
        populate: {
          path: "trabajadorUsuario",
          populate: {
            path: "rolTrabajador"
          }
        }
      })
      .populate({
        path: "productosVentaHotel.productoVentaHotel",
        populate: {
          path: "productoAlmacenHotel",
          populate: {
            path: "proveedorProducto categoriaProducto"
          }
        }
      })
      .lean();
    
    console.log("sales: ", sales);
    
    // Sumar los totales, los descuentos, adelantos y restantes
    let totalVentaHotelCheckOut = 0;
    let descuentoVentaHotelCheckOut = 0;
    let adelantoVentaHotelCheckOut = 0;
    let restanteVentaHotelCheckOut = 0;

    sales.forEach(sale => {
      if (!sale.ventaCerradaHotel) {
        totalVentaHotelCheckOut += parseFloat(sale.precioTotalVentaHotel);
        descuentoVentaHotelCheckOut += parseFloat(sale.descuentoTotalVentaHotel);
        adelantoVentaHotelCheckOut += parseFloat(sale.pagoAdelantoVentaHotel);
        restanteVentaHotelCheckOut += parseFloat(sale.pagoRestanteVentaHotel);
      }
    });

    const importeAdicionalCheckOutParseado = parseFloat(importeAdicionalCheckOut);
    const descuentoCheckOutParseado = parseFloat(descuentoCheckOut);

    const adelantoReservaParseado = parseFloat(reservation.adelantoReserva);
    const importeReservaParseado = parseFloat(reservation.importeReserva);

    const restanteReservaParseado = importeReservaParseado - adelantoReservaParseado;

    const pagoAlSalirCheckOut = restanteReservaParseado + importeAdicionalCheckOutParseado - descuentoCheckOutParseado + restanteVentaHotelCheckOut;

    const importeTotalCheckOut = adelantoReservaParseado + pagoAlSalirCheckOut + totalVentaHotelCheckOut - restanteVentaHotelCheckOut;

    if (isNaN(importeAdicionalCheckOutParseado) || isNaN(descuentoCheckOutParseado) || isNaN(importeTotalCheckOut)) {
      req.flash("wrong", "El checkout no es válido, los precios deben ser números");
      return res.redirect("/hotel");
    }

    const newCheckOutHotel = new CheckOutHotel({
      usuarioRegistroCheckOut: req.user._id,
      tipoUsoCheckOut: "Reservacion",
      comentariosCheckOut,
      importeAdicionalCheckOut: importeAdicionalCheckOutParseado,
      descuentoCheckOut: descuentoCheckOutParseado,
      totalVentaHotelCheckOut,
      adelantoVentaHotelCheckOut,
      descuentoVentaHotelCheckOut,
      restanteVentaHotelCheckOut,
      pagoAlSalirCheckOut,
      importeTotalCheckOut,
      eliminadoCheckOut: false,
      referenciaCheckOut: reservation._id,
      tipoCheckOut: "Reservation"
    });
    console.log("New checkout hotel: ", newCheckOutHotel);
    await newCheckOutHotel.save();

    // Guardar datos de la venta a la reserva que se hará checkout
    const cantidadCierreVentasHotel = sales.length;
    const totalDescuentosVentasHotel = sales.reduce((total, sale) => total + sale.descuentoTotalVentaHotel, 0);
    const importeTotalCierreVentasHotel = sales.reduce((total, sale) => total + sale.precioTotalVentaHotel, 0);

    // Guardar historial de venta a la reserva
    if (sales.length > 0) {
      // Confirmar las ventas pendientes y actualizar todas las ventas a cerradas
      await SaleHotel.updateMany(
        { referenciEntidad: reservation._id, tipoEntidad: "Reservation" },
        [
          {
            $set: {
              estadoVentaHotel: {
                $cond: { if: { $eq: ["$estadoVentaHotel", "Pendiente"] }, then: "Confirmada", else: "$estadoVentaHotel" }
              },
              ventaCerradaHotel: true
            }
          }
        ]
      );

      // Obtener las ventas actualizadas
      const salesUpdated = await SaleHotel.find({
        referenciEntidad: reservation._id,
        tipoEntidad: "Reservation",
        ventaCerradaHotel: true
      }).lean();

      const ventaHotelHistorial = salesUpdated.map(sale => ({
        cierreVentasHotel: sale._id
      }));

      // Obtener ventas confirmadas y canceladas
      const cantidadVentasConfirmadasHotel = salesUpdated.filter(sale => sale.estadoVentaHotel === "Confirmada").length;
      const cantidadVentasCanceladasHotel = salesUpdated.filter(sale => sale.estadoVentaHotel === "Cancelada").length;

      // Guardar en el historial de ventas
      const newSaleHotelHistory = new SaleHotelHistory({
        tipoHistorial: "Cerrada",
        usuarioCheckOutCierreVenta: req.user._id,
        ventaHotelHistorial,
        cantidadCierreVentasHotel,
        cantidadVentasConfirmadasHotel,
        cantidadVentasCanceladasHotel,
        totalDescuentosVentasHotel,
        importeTotalCierreVentasHotel
      });
      await newSaleHotelHistory.save();
    }

    // Actualizar el estado de la reserva
    reservation.estadoReserva = "Finalizada";
    reservation.finalizadaReserva = true;
    await reservation.save();

    // Actualizar el estado de la habitación
    const room = await Room.findById(reservation.habitacionReserva._id);
    room.cantidadUsosHabitacion++;
    room.estadoHabitacion = "Limpieza Pendiente";
    await room.save();

    req.flash("success", "Checkout registrado correctamente.");
    res.redirect("/hotel");

  } catch (error) {
    req.flash("wrong", "Ocurrió un error al registrar el checkout, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

module.exports = reservationCtrl;