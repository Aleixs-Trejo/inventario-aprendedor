const occupationCtrl = {};

const Occupation = require("../models/occupationModel");
const OccupationHistory = require("../models/occupationHistoryModel");
const Room = require("../models/roomModel");
const User = require("../models/userModel");
const StoreHotel = require("../models/storeHotelModel");
const SaleHotel = require("../models/saleHotelModel");
const SaleHotelHistory = require("../models/saleHotelHistoryModel");
const Cleaning = require("../models/cleaningModel");
const CleaningHistory = require("../models/cleaningHistoryModel");
const CheckOutHotel = require("../models/checkOutHotelModel");

// Renderizar formulario de ocupación de habitación
occupationCtrl.renderRegisterOccupation = async (req, res) => {
  try {
    const {id} = req.params;
    const room = await Room.findById(id)
      .populate("usuarioRegistroHabitacion")
      .populate("pisoHabitacion")
      .populate("categoriaHabitacion")
      .populate("estadoHabitacion")
      .lean();

    if (room.estadoHabitacion !== "Disponible") {
      req.flash("error", "La habitación no está disponible");
      return res.redirect("/hotel");
    };

    const userRole = req.user.trabajadorUsuario.rolTrabajador.nombreRol;
    res.render("hotel/occupations/new-occupation", {
      room,
      userRole
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al registrar la ocupación, intente nuevamente");
    console.log(error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Registrar ocupación de habitación
occupationCtrl.registerOccupation = async (req, res) => {
  try {
    const {
      habitacionOcupacion,
      dniClienteOcupacion,
      nombreClienteOcupacion,
      celularClienteOcupacion,
      correoClienteOcupacion,
      fechaFinOcupacion,
      nochesOcupacion,
      adelantoOcupacion,
      importeOcupacion,
      observacionesOcupacion
    } = req.body;

    if (!dniClienteOcupacion || !nombreClienteOcupacion) {
      req.flash("error", "El dni y el nombre del cliente no pueden estar vacíos");
      return res.redirect("/hotel");
    }

    const isExistsOccupation = await Occupation.findOne({
      habitacionOcupacion,
      dniClienteOcupacion,
      nombreClienteOcupacion,
      finalizadoOcupacion: false
    });
    
    if (isExistsOccupation) {
      req.flash("error", "Ya existe una ocupación con los mismos datos, intente registrarla de nuevo");
      return res.redirect("/hotel");
    }

    const nochesParseados = parseInt(nochesOcupacion);
    const importeParseado = parseFloat(importeOcupacion);
    const adelantoParseados = parseFloat(adelantoOcupacion);

    const restanteParseado = importeParseado - adelantoParseados;

    if (isNaN(nochesParseados) || isNaN(adelantoParseados) || nochesParseados <= 0 || adelantoParseados < 0) {
      req.flash("wrong", "El número de días y adelanto de la ocupación no es válido, debe ser un número");
      return res.redirect("/hotel");
    }

    const newOccupation = new Occupation({
      usuarioRegistroOcupacion: req.user._id,
      habitacionOcupacion,
      dniClienteOcupacion,
      nombreClienteOcupacion,
      celularClienteOcupacion,
      correoClienteOcupacion,
      fechaFinOcupacion,
      nochesOcupacion: nochesParseados,
      adelantoOcupacion: adelantoParseados,
      importeOcupacion: importeParseado,
      restanteOcupacion: restanteParseado,
      estadoOcupacion: "En Curso",
      observacionesOcupacion,
      limpiezaOcupacion: false,
      ventaOcupacion: false,
      finalizadoOcupacion: false
    });
    await newOccupation.save();

    // Actualizar el estado de la habitación
    await Room.findByIdAndUpdate(habitacionOcupacion, {estadoHabitacion: "Ocupado"});

    // Generar el historial de la ocupación
    const newOccupationHistory = new OccupationHistory({
      tipoHistorial: "Registro",
      ocupacionHistorial: newOccupation._id
    });

    await newOccupationHistory.save();

    req.flash("success", "Ocupación registrada exitosamente");
    return res.redirect("/hotel");

  } catch (error) {
    req.flash("wrong", "Ocurrió un error al registrar la ocupación, intente nuevamente");
    console.log(error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Mostrar todas las habitaciones ocupadas
occupationCtrl.renderAllOccupations = async (req, res) => {
  try {
    const occupations = await Occupation.find({finalizadoOcupacion: false})
      .populate("usuarioRegistroOcupacion")
      .populate({
        path: "habitacionOcupacion",
        populate: "pisoHabitacion categoriaHabitacion"
      })
      .sort({createdAt: -1})
      .lean();

    const userRole = req.user.trabajadorUsuario.rolTrabajador.nombreRol;
    res.render("hotel/occupations/all-occupations", {
      occupations,
      userRole
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al cargar los detalles de la reserva, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

occupationCtrl.renderDetailOccupation = async (req, res) => {
  try {
    const {id} = req.params;
    const occupation = await Occupation.findById(id)
      .populate({
        path: "usuarioRegistroOcupacion",
        populate: "trabajadorUsuario"
      })
      .populate({
        path: "habitacionOcupacion",
        populate: "pisoHabitacion categoriaHabitacion"
      })
    
    if (occupation) {
      await occupation.actualizarEstadoOcupacion();
    }

    const occupationLean = occupation.toObject();
    
    const saleOccupation = await SaleHotel.find({
        estadoVentaHotel: { $ne: "Cancelada" },
        ventaCerradaHotel: false,
        eliminadoVentaHotel: false,
        referenciEntidad: occupation._id,
        tipoEntidad: "Occupation"
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
        referenciaEntidad: occupation._id,
        tipoEntidad: "Occupation"
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
    res.render("hotel/occupations/details-occupation", {
      occupation: occupationLean,
      saleOccupation,
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

// Renderizar formulario de edición de ocupación
occupationCtrl.renderEditOccupation = async (req, res) => {
  try {
    const {id} = req.params;
    const occupation = await Occupation.findById(id)
      .populate({
        path: "usuarioRegistroOcupacion",
        populate: "trabajadorUsuario"
      })
      .populate({
        path: "habitacionOcupacion",
        populate: "pisoHabitacion categoriaHabitacion"
      })
      .lean();
    
    const room = await Room.findById(occupation.habitacionOcupacion._id)
      .populate({
        path: "usuarioRegistroHabitacion",
        populate: "trabajadorUsuario"
      })
      .populate("pisoHabitacion categoriaHabitacion")
      .lean();

    const userRole = req.user.trabajadorUsuario.rolTrabajador.nombreRol;
    res.render("hotel/occupations/edit-occupation", {
      room,
      occupation,
      userRole
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al cargar el formulario para editar la reserva, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Actualizar la ocupación de la habitación
occupationCtrl.updateOccupation = async (req, res) => {
  try {
    const {id} = req.params;
    const {
      habitacionOcupacion,
      dniClienteOcupacion,
      nombreClienteOcupacion,
      celularClienteOcupacion,
      correoClienteOcupacion,
      fechaFinOcupacion,
      nochesOcupacion,
      adelantoOcupacion,
      importeOcupacion,
      observacionesOcupacion
    } = req.body;
    console.log("Req.body: ", req.body);

    if (!dniClienteOcupacion || !nombreClienteOcupacion) {
      req.flash("error", "El dni y el nombre del cliente no pueden estar vacíos");
      return res.redirect("/hotel");
    }

    const nochesParseados = parseInt(nochesOcupacion);
    const importeParseado = parseFloat(importeOcupacion);
    const adelantoParseados = parseFloat(adelantoOcupacion);

    const restanteParseado = importeParseado - adelantoParseados;

    if (isNaN(nochesParseados) || isNaN(adelantoParseados) || nochesParseados <= 0 || adelantoParseados < 0) {
      req.flash("wrong", "El número de días y adelanto de la ocupación no es válido, debe ser un número");
      return res.redirect("/hotel");
    }

    await Occupation.findByIdAndUpdate(id, {
      habitacionOcupacion,
      dniClienteOcupacion,
      nombreClienteOcupacion,
      celularClienteOcupacion,
      correoClienteOcupacion,
      fechaFinOcupacion,
      nochesOcupacion: nochesParseados,
      adelantoOcupacion: adelantoParseados,
      importeOcupacion: importeParseado,
      restanteOcupacion: restanteParseado,
      observacionesOcupacion,
    });
    req.flash("success", "Ocupación actualizada exitosamente");
    res.redirect(`/occupation/${id}/details`);
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al actualizar la ocupación, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Renderizar formulario de venta a la ocupacion
occupationCtrl.renderSaleOccupation = async (req, res) => {
  try {
    const {id} = req.params;
    const occupationId = id;
    const actionUrl = `/occupation/${occupationId}/sale`;
    const occupation = await Occupation.findById(id)
      .populate({
        path: "usuarioRegistroOcupacion",
        populate: "trabajadorUsuario"
      })
      .populate({
        path: "habitacionOcupacion",
        populate: "pisoHabitacion categoriaHabitacion"
      })
      .lean();

    const room = await Room.findById(occupation.habitacionOcupacion._id)
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
      occupation,
      room,
      storeHotel,
      currentUser
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al cargar el formulario para venta, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Registrar venta a la habitación ocuapda
occupationCtrl.registerSaleOccupation = async (req, res) => {
  try {
    const {id} = req.params;
    const {
      productosVentaHotel,
      precioTotalVentaHotel,
      descuentoTotalVentaHotel,
      pagoAdelantoVentaHotel,
      comentariosVentaHotel
    } = req.body;

    // Verificar si productosVenta es un array
    if (!Array.isArray(productosVentaHotel)) {
      throw new Error("productosVentaHotel debe ser un array.");
    }

    if (productosVentaHotel.length === 0) {
      throw new Error("productosVentaHotel debe tener al menos un producto.");
    }

    const occupation = await Occupation.findById(id);

    if (!occupation) {
      req.flash("wrong", "La habitación no está ocupada.");
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

    // Redondear el precio total de la venta
    /* const precioTotalVentaRedondeado = precioTotalVenta.toFixed(2);
    const descuentoTotalVentaRedondeado = descuentoTotalVenta.toFixed(2); */

    // Crear la nueva venta
    const newSaleHotel = new SaleHotel({
      usuarioRegistroVentaHotel: req.user._id,
      estadoVentaHotel: pagoAdelantoVentaHotel === precioTotalVentaHotel ? "Confirmada" : "Pendiente",
      productosVentaHotel: productosVendidos,
      cantidadProductosVentaHotel,
      precioTotalVentaHotel: precioTotalVentaHotelParseado,
      descuentoTotalVentaHotel: descuentoTotalVentaHotelParseado,
      pagoAdelantoVentaHotel: pagoAdelantoVentaHotelParseado,
      pagoRestanteVentaHotel: pagoRestanteVentaHotelParseado,
      ventaPagadaHotel: pagoAdelantoVentaHotelParseado === precioTotalVentaHotelParseado ? true : false,
      comentariosVentaHotel,
      referenciEntidad: occupation._id,
      tipoEntidad: "Occupation"
    });
    console.log("Nueva venta: ", newSaleHotel);
    await newSaleHotel.save();

    req.flash("success", "Venta registrada exitosamente.");
    return res.redirect(`/occupation/${id}/details`);
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al registrar la venta, intente nuevamente");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Anular una venta de la habitacion
occupationCtrl.cancelSaleOccupation = async (req, res) => {
  try {
    const {id} = req.params;

    // Buscar la venta
    const sale = await SaleHotel.findById(id);

    // Bsucar la ocupacion
    const occupation = await Occupation.findById(sale.referenciEntidad);
    
    if (!sale) {
      req.flash("wrong", "La venta no existe");
      return res.redirect(`occupation/${occupation._id}/details`);
    }

    if (sale.estadoVentaHotel === "Cancelada") {
      req.flash("wrong", "La venta ya fue cancelada");
      return res.redirect(`occupation/${occupation._id}/details`);
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
    res.redirect(`/occupation/${occupation._id}/details`);

  } catch (error) {
    req.flash("wrong", "Ocurrió un error al cancelar la venta, intente nuevamente");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

occupationCtrl.renderCleaningRoomOccupation = async (req, res) => {
  try {
    const {id} = req.params;
    const occupation = await Occupation.findById(id)
      .populate({
        path: "usuarioRegistroOcupacion",
        populate: "trabajadorUsuario"
      })
      .populate({
        path: "habitacionOcupacion",
        populate: "pisoHabitacion categoriaHabitacion"
      })
      .lean();

    const room = await Room.findById(occupation.habitacionOcupacion._id)
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
    res.render("hotel/cleaning/cleaning-room-occupation", {
      occupation,
      room,
      usuarios,
      userRole
    });

  } catch (error) {
    req.flash("wrong", "Ocurrió un error al limpiar la habitación, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

occupationCtrl.cleaningRoomOccupation = async (req, res) => {
  try {
    const {id} = req.params;
    const {
      usuarioACargoLimpieza,
      comentariosLimpieza,
    } = req.body;

    const occupation = await Occupation.findById(id);

    if (!occupation) {
      req.flash("wrong", "No existe la ocupación");
      return res.redirect("/hotel");
    }

    const isExistsRoomInCleaning = await Cleaning.findOne({
      referenciaEntidad: occupation._id,
      tipoEntidad: "Occupation",
      finalizadoLimpieza: false
    });

    if (isExistsRoomInCleaning) {
      req.flash("wrong", "Esta habitación ya está en limpieza.");
      return res.redirect("/hotel");
    }

    const newCleaning = new Cleaning({
      usuarioRegistroLimpieza: req.user._id,
      usuarioACargoLimpieza,
      tipoLimpieza: "Ocupacion",
      comentariosLimpieza,
      finalizadoLimpieza: false,
      referenciaEntidad: occupation._id,
      tipoEntidad: "Occupation"
    });
    console.log("New cleaning: ", newCleaning);
    await newCleaning.save();
    
    // Establecer limpiezaOcupacion a true y actualizar el estado de la ocupación a Limpieza Intermedia
    occupation.limpiezaOcupacion = true;
    occupation.estadoOcupacion = "Limpieza Intermedia";
    await occupation.save();
    console.log("Occupation que pasó a limpieza: ", occupation);

    // Generar el historial de la limpieza
    const newCleaningHistory = new CleaningHistory({
      tipoHistorial: "Registro",
      limpiezaHistorial: newCleaning._id
    });

    console.log("Nuevo registro de limpieza en el historial de habitación: ", newCleaningHistory);
    await newCleaningHistory.save();

    req.flash("success", "Limpieza registrada correctamente.");
    res.redirect(`/occupation/${id}/details`);
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al limpiar la habitación, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

occupationCtrl.finalizeCleaningRoomOccupation = async (req, res) => {
  try {
    const {id} = req.params;
    const occupation = await Occupation.findById(id);

    if (!occupation) {
      req.flash("wrong", "No existe la ocupación");
      return res.redirect("/hotel");
    }

    const cleaning = await Cleaning.findOne({
      referenciaEntidad: occupation._id,
      tipoEntidad: "Occupation",
      finalizadoLimpieza: false
    });

    if (!cleaning) {
      req.flash("wrong", "No existe la limpieza");
      return res.redirect("/hotel");
    }

    // Finalizar la limpieza y volver el estado de la habitación a disponible
    cleaning.finalizadoLimpieza = true;
    cleaning.fechaFinLimpieza = Date.now();
    await cleaning.save();

    occupation.limpiezaOcupacion = false;
    occupation.estadoOcupacion = "En Curso";
    await occupation.save();

    // Historial para limpieza
    const newCleaningHistory = new CleaningHistory({
      tipoHistorial: "Finalizado",
      limpiezaHistorial: cleaning._id
    });

    await newCleaningHistory.save();

    req.flash("success", "Limpieza finalizada exitosamente");
    res.redirect(`/occupation/${id}/details`);
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al finalizar la limpieza, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

occupationCtrl.renderCheckOutHotel = async (req, res) => {
  try {
    const {id} = req.params;
    const occupationId = id;
    const actionUrl = `/occupation/${occupationId}/checkout`;
    const occupation = await Occupation.findById(id)
      .populate({
        path: "usuarioRegistroOcupacion",
        populate: "trabajadorUsuario"
      })
      .populate({
        path: "habitacionOcupacion",
        populate: "pisoHabitacion categoriaHabitacion"
      })
      .lean();

    const room = await Room.findById(occupation.habitacionOcupacion._id)
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
        referenciaEntidad: occupation._id,
        tipoEntidad: "Occupation",
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

    const saleOccupation = await SaleHotel.find({
        ventaCerradaHotel: false,
        eliminadoVentaHotel: false,
        referenciEntidad: occupation._id,
        tipoEntidad: "Occupation"
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
    res.render("hotel/checkout/checkout-hotel", {
      actionUrl,
      occupation,
      room,
      usuarios,
      cleaningRoom,
      saleOccupation,
      userRole
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al cargar el formulario para checkout, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Registrar checkout de habitación
occupationCtrl.checkOutHotel = async (req, res) => {
  try {
    const {id} = req.params;
    const {
      comentariosCheckOut,
      importeAdicionalCheckOut,
      descuentoCheckOut
    } = req.body;
    console.log("Req.body: ", req.body);

    const occupation = await Occupation.findById(id);

    if (!occupation) {
      req.flash("wrong", "No existe la ocupación");
      return res.redirect("/hotel");
    }

    const isExistsRoomInCheckOut = await CheckOutHotel.findOne({
      referenciaCheckOut: occupation._id,
      tipoCheckOut: "Occupation",
      eliminadoCheckOut: false
    });

    if (isExistsRoomInCheckOut) {
      req.flash("wrong", "Esta habitación ya está en checkout.");
      return res.redirect("/hotel");
    }

    const sales = await SaleHotel.find({
        eliminadoVentaHotel: false,
        referenciEntidad: occupation._id,
        tipoEntidad: "Occupation",
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

    console.log("Sales: ", sales);

    // Sumar los totales, los descuentos, adelantos y restantes solo de las ventas que hayan sido cerradas
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

    const adelantoOcupacionParseado = parseFloat(occupation.adelantoOcupacion);
    const importeOcupacionParseado = parseFloat(occupation.importeOcupacion);

    const restanteOcupacionParseado = importeOcupacionParseado - adelantoOcupacionParseado;

    const pagoAlSalirCheckOut = restanteOcupacionParseado + importeAdicionalCheckOutParseado - descuentoCheckOutParseado + restanteVentaHotelCheckOut;

    const importeTotalCheckOut = adelantoOcupacionParseado + pagoAlSalirCheckOut + totalVentaHotelCheckOut - restanteVentaHotelCheckOut;

    if (isNaN(importeAdicionalCheckOutParseado) || isNaN(descuentoCheckOutParseado) || isNaN(importeTotalCheckOut)) {
      req.flash("wrong", "El checkout no es válido, los precios deben ser números");
      return res.redirect("/hotel");
    }

    const newCheckOutHotel = new CheckOutHotel({
      usuarioRegistroCheckOut: req.user._id,
      tipoUsoCheckOut: "Ocupacion",
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
      referenciaCheckOut: occupation._id,
      tipoCheckOut: "Occupation"
    });
    await newCheckOutHotel.save();

    // Guardar datos de la venta a la ocupacion que se hará checkout
    const cantidadCierreVentasHotel = sales.length;
    const totalDescuentosVentasHotel = sales.reduce((total, sale) => total + sale.descuentoTotalVentaHotel, 0);
    const importeTotalCierreVentasHotel = sales.reduce((total, sale) => total + sale.precioTotalVentaHotel, 0);
    
    // Guardar historial de venta a la ocupación
    if (sales.length > 0) {
      // Confirmar las ventas pendientes y actualizar todas las ventas a cerradas
      await SaleHotel.updateMany(
        { referenciEntidad: occupation._id, tipoEntidad: "Occupation" },
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
        referenciEntidad: occupation._id,
        tipoEntidad: "Occupation",
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

    // Actualizar el estado de la ocupacion
    occupation.estadoOcupacion = "Finalizada";
    occupation.finalizadoOcupacion = true;
    await occupation.save();

    // Actualizar el estado de la habitación
    const room = await Room.findById(occupation.habitacionOcupacion._id);
    room.cantidadUsosHabitacion++;
    room.estadoHabitacion = "Limpieza Pendiente";
    await room.save();

    req.flash("success", "Checkout registrado correctamente.");
    res.redirect("/hotel");
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al checkout, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

module.exports = occupationCtrl;