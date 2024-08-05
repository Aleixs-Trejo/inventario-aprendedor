const salesHotelHistoryCtrl = {};

const SalesHotelHistory = require("../models/saleHotelHistoryModel");
const Occupation = require("../models/occupationModel");
const Reservation = require("../models/reservationModel");

// Mostrar ventas a la habitación que hayan sido cerradas
salesHotelHistoryCtrl.renderSalesHotelHistory = async (req, res) => {
  try {
    const salesHotelHistory = await SalesHotelHistory.find()
      .populate({
        path: "usuarioCheckOutCierreVenta",
        populate: {
          path: "trabajadorUsuario",
          populate: {
            path: "rolTrabajador"
          }
        }
      })
      .populate({
        path: "ventaHotelHistorial.cierreVentasHotel",
        populate: [
          { path: "usuarioRegistroVentaHotel", 
            populate: {
              path: "trabajadorUsuario",
              populate: "rolTrabajador"
            }
          },
          {
            path: "productosVentaHotel.productoVentaHotel", 
            populate: {
              path: "productoAlmacenHotel",
              populate: {
                path: "proveedorProducto categoriaProducto"
              }
            }
          }
        ]
      })
      .sort({createdAt: -1})
      .lean();
    
    const userRole = req.user.trabajadorUsuario.rolTrabajador.nombreRol;
    res.render("hotel/sales/history-sales-hotel", {
      salesHotelHistory,
      userRole
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al mostrar las ventas cerradas, intente nuevamente.");
    console.error("Error:", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Mostrar detalles del grupo de ventas que guarda un historial
salesHotelHistoryCtrl.renderSalesHotelHistoryDetails = async (req, res) => {
  try {
    // Obtener el grupo de ventas de un registro en el historial
    const {id} = req.params;
    let saleHotelHistory = await SalesHotelHistory.findById(id)
      .populate({
        path: "usuarioCheckOutCierreVenta",
        populate: {
          path: "trabajadorUsuario",
          populate: {
            path: "rolTrabajador"
          }
        }
      })
      .populate({
        path: "ventaHotelHistorial.cierreVentasHotel",
        populate: [
          { path: "usuarioRegistroVentaHotel",
            populate: {
              path: "trabajadorUsuario",
              populate: "rolTrabajador"
            }
          },
          { path: "productosVentaHotel.productoVentaHotel",
            populate: {
              path: "productoAlmacenHotel",
              populate: {
                path: "proveedorProducto categoriaProducto"
              }
            }
          },
          { path: "referenciEntidad" }
        ]
      })
      .sort({createdAt: -1})
      .lean();

    // Poblamos referenciEntidad basándonos en tipoEntidad
    let entidades = {};
    for (const venta of saleHotelHistory.ventaHotelHistorial) {
      if (venta.cierreVentasHotel) {
        const { referenciEntidad, tipoEntidad } = venta.cierreVentasHotel;
        if (tipoEntidad === "Occupation") {
          let entidad = await Occupation.findById(referenciEntidad)
            .populate({ path: 'habitacionOcupacion' })
            .lean();
          entidades[venta.cierreVentasHotel._id] = entidad;
        } else if (tipoEntidad === "Reservation") {
          let entidad = await Reservation.findById(referenciEntidad)
            .populate({ path: 'habitacionReserva' })
            .lean();
          entidades[venta.cierreVentasHotel._id] = entidad;
        }
      }
    }

    for (const venta of saleHotelHistory.ventaHotelHistorial) {
      venta.entidad = entidades[venta.cierreVentasHotel._id] || null;
    }

    const userRole = req.user.trabajadorUsuario.rolTrabajador.nombreRol;
    res.render("hotel/sales/history-sales-hotel-details", {
      saleHotelHistory,
      entidades,
      userRole
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al mostrar los detalles del grupo de ventas, intente nuevamente.");
    console.error("Error:", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

module.exports = salesHotelHistoryCtrl;