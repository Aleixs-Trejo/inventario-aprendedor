const indexCtrl = {};
const moment = require("moment");

const Users = require("../models/userModel");
const Sales = require("../models/saleModel");
const Products = require("../models/productHistoryModel");
const UsersHistory = require("../models/userHistoryModel");

indexCtrl.renderIndex = async (req, res) => {
  try {
    const currentUser = req.user;

    // Obtener la fecha de inicio de la semana actual
    const startOfWeek = moment().startOf("week").toDate();

    //buscar el usuario en la bd
    const user = await Users.findById(currentUser._id)
      .populate({
        path: "trabajadorUsuario",
        populate: {
          path: "rolTrabajador",
          model: "UserRol"
        }
      })
      .sort({createdAt: -1})
      .lean();

    // Obtener las ventas
    const sales = await Sales.find({ createdAt: { $gte: startOfWeek } })
      .populate({
        path: "usuarioVenta",
        populate: {
          path: "trabajadorUsuario",
          populate: {
            path: "rolTrabajador"
          }
        }
      })
      .populate("clienteVenta")
      .sort({createdAt: -1})
      .lean();

    // Obtener los productos registrados
    const products = await Products.find({ createdAt: { $gte: startOfWeek } })
      .populate({
        path: "productoHistorial",
        populate: [
          { path: "usuarioProducto" },
          { path: "proveedorProducto" },
          { path: "categoriaProducto" }
        ]
      })
      .sort({createdAt: -1})
      .lean();

    // Obtener los usuarios registrados
    const users = await UsersHistory.find({ createdAt: { $gte: startOfWeek } })
      .populate({
        path: "usuarioHistorial",
        populate: {
          path: "trabajadorUsuario",
          populate: {
            path: "rolTrabajador",
            model: "UserRol"
          }
        }
      })
      .sort({createdAt: -1})
      .lean();

    res.render("index", {
      user,
      sales,
      products,
      users
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al renderizar la página de inicio, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

module.exports = indexCtrl;