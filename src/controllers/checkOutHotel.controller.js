const checkOutHotelCtrl = {};

const CheckOutHotel = require("../models/checkOutHotelModel");
const CheckOutHotelHistory = require("../models/checkOutHotelHistoryModel");
const Occupation = require("../models/occupationModel");
const Reservation = require("../models/reservationModel");
const Cleaning = require("../models/cleaningModel");
const SaleHotel = require("../models/saleHotelModel");
const BalanceHotel = require("../models/balanceHotelModel");

// Renderizar checkouts
checkOutHotelCtrl.renderCheckOuts = async (req, res) => {
  try {
    const checkOutsHotel = await CheckOutHotel.find({checkOutCerrado: false})
      .populate({
        path: "usuarioRegistroCheckOut",
        populate: {
          path: "trabajadorUsuario",
          populate: "rolTrabajador"
        }
      })
      .sort({createdAt: -1})
      .lean();

    // Poblamos referenciaCheckOut basándonos en tipoCheckout
    for (const checkOutHotel of checkOutsHotel) {
      if (checkOutHotel.tipoCheckOut === "Occupation") {
        checkOutHotel.referenciaCheckOut = await Occupation.findById(checkOutHotel.referenciaCheckOut)
          .populate({
            path: "habitacionOcupacion",
            populate: "pisoHabitacion categoriaHabitacion"
          })
          .populate({
            path: "usuarioRegistroOcupacion",
            populate: {
              path: "trabajadorUsuario",
              populate: "rolTrabajador"
            }
          })
          .lean();
      } else if (checkOutHotel.tipoCheckOut === "Reservation") {
        checkOutHotel.referenciaCheckOut = await Reservation.findById(checkOutHotel.referenciaCheckOut)
          .populate({
            path: "usuarioReserva",
            populate: {
              path: "trabajadorUsuario",
              populate: "rolTrabajador"
            }
          })
          .populate({
            path: "habitacionReserva",
            populate: "pisoHabitacion categoriaHabitacion"
          })
          .lean();
      }
    }

    const currentPage = `checkouts-hotel`;
    res.render("hotel/checkout/all-checkouts", {
      checkOutsHotel,
      currentPage
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al cargar los checkouts, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Cerrar CheckOuts y mandarlos al historial y balances
checkOutHotelCtrl.closeCheckOuts = async (req, res) => {
  try {
    const checkOuts = await CheckOutHotel.find({eliminadoCheckOut: false, checkOutCerrado: false}).lean();

    const checkOutHotelHistorial = checkOuts.map(checkOut => ({ cierreCheckOuts: checkOut._id}));

    // Calculamos la cantidad total de checkOuts
    const cantidadCheckOuts = checkOuts.length;

    // Calculamos los descuentos totales de checkOuts
    const descuentoCheckOuts = checkOuts.reduce((total, checkout) => {
      return total + checkout.descuentoCheckOut;
    }, 0)

    // Calculamos importes adicionales de checkouts
    const adicionalCheckOut = checkOuts.reduce((total, checkout) => {
      return total + checkout.importeAdicionalCheckOut;
    }, 0)

    // Calculamos importe total de checkouts
    const importeCheckOuts = checkOuts.reduce((total, checkout) => {
      return total + checkout.importeTotalCheckOut;
    }, 0)

    // Crear registro en el historial de checkouts
    const newCheckOutHotelHistory = new CheckOutHotelHistory({
      tipoHistorial: "Cerrado",
      usuarioCierreCheckOuts: req.user._id,
      checkOutHotelHistorial,
      cantidadCierreCheckOuts: cantidadCheckOuts,
      totalAdicionalesCheckOuts: adicionalCheckOut,
      totalDescuentosCheckOuts: descuentoCheckOuts,
      totalImporteCheckOuts: importeCheckOuts
    });
    await newCheckOutHotelHistory.save();

    // Actualizar checkOutCerrado a true
    await CheckOutHotel.updateMany(
      { checkOutCerrado: false },
      { $set: { checkOutCerrado: true } }
    );

    const totalCheckOuts = checkOuts.length;
    const gananciasNetas = importeCheckOuts;

    const newBalance = new BalanceHotel({
      usuarioRegistroBalance: req.user._id,
      checkOutsBalance: newCheckOutHotelHistory._id,
      totalCheckOuts,
      gananciasNetas,
    });

    await newBalance.save();

    req.flash("success", "CheckOuts cerrados exitosamente.");
    res.redirect("/hotel");
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al cerrar los checkouts, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Mostrar detalles de la actividad de checkout
checkOutHotelCtrl.renderCheckOutDetails = async (req, res) => {
  try {
    const {id} = req.params;
    const checkOutHotel = await CheckOutHotel.findById(id)
      .populate({
        path: "usuarioRegistroCheckOut",
        populate: {
          path: "trabajadorUsuario",
          populate: "rolTrabajador"
        }
      })
      .sort({createdAt: -1})
      .lean();

    // Poblamos referenciaCheckOut basándonos en tipoCheckout
    let entidad;
    let limpieza;
    let sales;
    if (checkOutHotel.tipoCheckOut === "Occupation") {
      entidad = await Occupation.findById(checkOutHotel.referenciaCheckOut)
        .populate({
          path: "habitacionOcupacion",
          populate: "pisoHabitacion categoriaHabitacion"
        })
        .populate({
          path: "usuarioRegistroOcupacion",
          populate: {
            path: "trabajadorUsuario",
            populate: "rolTrabajador"
          }
        })
        .lean();
      limpieza = await Cleaning.findOne({referenciaEntidad: entidad._id, tipoEntidad: "Occupation"})
        .populate({
          path: "usuarioRegistroLimpieza",
          populate: "trabajadorUsuario"
        })
        .populate({
          path: "usuarioACargoLimpieza",
          populate: "trabajadorUsuario"
        })
        .lean();
      sales = await SaleHotel.find({
          ventaCerradaHotel: true,
          eliminadoVentaHotel: false,
          referenciEntidad: entidad._id,
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
    } else if (checkOutHotel.tipoCheckOut === "Reservation") {
      entidad = await Reservation.findById(checkOutHotel.referenciaCheckOut)
        .populate({
          path: "usuarioReserva",
          populate: {
            path: "trabajadorUsuario",
            populate: "rolTrabajador"
          }
        })
        .populate({
          path: "habitacionReserva",
          populate: "pisoHabitacion categoriaHabitacion"
        })
        .lean();
      limpieza = await Cleaning.findOne({referenciaEntidad: entidad._id, tipoEntidad: "Reservation"})
        .populate({
          path: "usuarioRegistroLimpieza",
          populate: "trabajadorUsuario"
        })
        .populate({
          path: "usuarioACargoLimpieza",
          populate: "trabajadorUsuario"
        })
        .lean();
      sales = await SaleHotel.find({
          ventaCerradaHotel: true,
          eliminadoVentaHotel: false,
          referenciEntidad: entidad._id,
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
    }

    res.render("hotel/checkout/checkout-details", {
      checkOutHotel,
      entidad,
      limpieza,
      sales
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al mostrar los detalles de la actividad de checkout, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

module.exports = checkOutHotelCtrl;