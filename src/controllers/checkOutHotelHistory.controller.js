const checkOutHotelHistoryCtrl = {}

const CheckOutHotelHistory = require('../models/checkOutHotelHistoryModel');
const Occupation = require("../models/occupationModel");
const Reservation = require("../models/reservationModel");

// Renderizar checkouthistory de hotel
checkOutHotelHistoryCtrl.renderCheckOutHotelHistory = async (req, res) => {
  try {
    const checkOutHotelHistory = await CheckOutHotelHistory.find()
      .populate({
        path: "usuarioCierreCheckOuts",
        populate: {
          path: "trabajadorUsuario",
          populate: "rolTrabajador"
        }
      })
      .populate({
        path: "checkOutHotelHistorial.cierreCheckOuts",
        populate: [
          { path: "usuarioRegistroCheckOut",
            populate: {
              path: "trabajadorUsuario",
              populate: "rolTrabajador"
            }
          },
          
        ]
      })
      .sort({createdAt: -1})
      .lean();

    // Poblamos referenciaCheckOut basándonos en tipoCheckout
    for (const history of checkOutHotelHistory) {
      if (history.checkOutHotelHistorial.cierreCheckOuts) {
        if (history.checkOutHotelHistorial.cierreCheckOuts.tipoCheckOut === "Occupation") {
          history.checkOutHotelHistorial.cierreCheckOuts.referenciaCheckOut = await Occupation.findById(history.checkOutHotelHistorial.cierreCheckOuts.referenciaCheckOut).populate({path: "habitacionOcupacion", populate: "pisoHabitacion categoriaHabitacion"}, {path: "clienteOcupacion"}, {path: "usuarioRegistroOcupacion", populate: {path: "trabajaodrUsuario", populate: "rolTrabajador"}}).lean();
        } else if (history.checkOutHotelHistorial.cierreCheckOuts.tipoCheckOut === "Reservation") {
          history.checkOutHotelHistorial.cierreCheckOuts.referenciaCheckOut = await Reservation.findById(history.checkOutHotelHistorial.cierreCheckOuts.referenciaCheckOut).populate({path: "habitacionReserva", populate: "pisoHabitacion categoriaHabitacion"}, {path: "clienteReserva"}, {path: "usuarioReserva", populate: {path: "trabajadorUsuario", populate: "rolTrabajador"}}).lean()
        }
      }
    }
    console.log("CheckOutHotelHistory: ", checkOutHotelHistory);
    console.log("checkOutHotelHistory: ", checkOutHotelHistory);
    res.render("hotel/checkout/history-checkouts", {
      checkOutHotelHistory
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al mostrar el checkouthistory de hotel, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

module.exports = checkOutHotelHistoryCtrl;