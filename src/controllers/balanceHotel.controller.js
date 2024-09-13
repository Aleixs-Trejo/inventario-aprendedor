const balanceHotelCtrl = {};

const BalanceHotel = require("../models/balanceHotelModel");

// Renderizar vista de balance de checkOuts
balanceHotelCtrl.renderBalanceHotel = async (req, res) => {
  try {
    const balanceHotel = await BalanceHotel.find()
      .populate({
        path: "usuarioRegistroBalance",
        populate: {
          path: "trabajadorUsuario"
        }
      })
      .populate({
        path: "checkOutsBalance",
        populate: {
          path: "checkOutHotelHistorial.cierreCheckOuts",
          match: {checkOutCerrado: true},
          populate: {
            path: "usuarioRegistroCheckOut",
            populate: {
              path: "trabajadorUsuario"
            }
          }
        }
      })
      .sort({createdAt: -1})
      .lean();

    const userRole = req.user.trabajadorUsuario.rolTrabajador.nombreRol;
    const currentPage = `balance-hotel`;
    console.log("Balance de checkOuts: ", balanceHotel);
    res.render("hotel/balance/all-balance-hotel", {
      balanceHotel,
      currentPage,
      userRole
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al mostrar la vista de balance de checkOuts, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

module.exports = balanceHotelCtrl;