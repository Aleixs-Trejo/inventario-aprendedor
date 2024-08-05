const salesHotelCtrl = {};

const SalesHotel = require("../models/saleHotelModel");
const Occupation = require("../models/occupationModel");
const Reservation = require("../models/reservationModel");

// Renderizar todas las ventas a la habitación
salesHotelCtrl.renderAllSalesHotel = async (req, res) => {
  try {
    const salesHotel = await SalesHotel.find({
      ventaCerradaHotel: false,
      eliminadoVentaHotel: false
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
    .sort({createdAt: -1})
    .lean();

    const userRole = req.user.trabajadorUsuario.rolTrabajador.nombreRol;
    res.render("hotel/sales/all-sales-hotel", {
      salesHotel,
      userRole
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al cargar las ventas, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Mostrar detalles de una venta
salesHotelCtrl.renderDetailsSalesHotel = async (req, res) => {
  try {
    const {id} = req.params;
    const saleHotel = await SalesHotel.findById(id)
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
      .populate("referenciEntidad")
      .lean();
    console.log("SaleHotel: ", saleHotel);

    // Poblamos referenciEntidad basándonos en tipoEntidad
    let entidad;
    if (saleHotel.tipoEntidad === "Occupation") {
      entidad = await Occupation.findById(saleHotel.referenciEntidad)
        .populate("habitacionOcupacion")
        .lean();
    } else if (saleHotel.tipoEntidad === "Reservation") {
      entidad = await Reservation.findById(saleHotel.referenciEntidad)
        .populate("habitacionReserva")
        .lean();
    }
    
    console.log("Entidad: ", entidad);

    const userRole = req.user.trabajadorUsuario.rolTrabajador.nombreRol;
    res.render("hotel/sales/details-sale-hotel", {
      saleHotel,
      entidad,
      userRole
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al cargar los detalles de la venta, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

module.exports = salesHotelCtrl;