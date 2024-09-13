const storeHotelCtrl = {};

const XLSX = require("xlsx");
const StoreHotel = require("../models/storeHotelModel");
const Product = require("../models/productModel");
const StoreHotelHistory = require("../models/storeHotelHistoryModel");

// Renderizar formulario de registro de almacenamiento de productos en el hotel
storeHotelCtrl.renderRegisterStoreHotel = async (req, res) => {
  try {
    const products = await Product.find({eliminadoProducto: false})
      .populate("proveedorProducto")
      .populate("categoriaProducto")
      .sort({cod: 1})
      .lean();
    const userRole = req.user.trabajadorUsuario.rolTrabajador.nombreRol;
    res.render("hotel/store-hotel/new-store-hotel", {
      products,
      userRole
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al mostrar la vista de registro de productos en el almacén, intente nuevamente.");
    console.error("Error:", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Registrar producto en el almacén del hotel
storeHotelCtrl.registerStoreHotel = async (req, res) => {
  try {
    const {
      productoAlmacenHotel,
      stockProductoAlmacenHotel,
      minStockProductoAlmacenHotel
    } = req.body;
    console.log("req.body", req.body);

    const isExistingProduct = await StoreHotel.findOne({productoAlmacenHotel, eliminadoProductoAlmacenHotel: false});
    if (isExistingProduct) {
      // Incrementar stock
      isExistingProduct.stockProductoAlmacenHotel += parseInt(stockProductoAlmacenHotel);
      await isExistingProduct.save();
      req.flash("success", "Stock del Producto actualizado exitosamente.");
      res.redirect("/store-hotel");
    } else {
      // Creamos el producto en el almacén
      const newStoreHotel = new StoreHotel({
        usuarioRegistroAlmacenHotel: req.user._id,
        productoAlmacenHotel,
        stockProductoAlmacenHotel,
        minStockProductoAlmacenHotel,
        eliminadoProductoAlmacenHotel: false
      });
      console.log("New store hotel: ", newStoreHotel);
      await newStoreHotel.save();

      // Crear registro en el historial
      const newStoreHotelHistory = new StoreHotelHistory({
        tipoHistorial: "Registro",
        almacenHotelHistorial: newStoreHotel._id
      });
      console.log("New store hotel history: ", newStoreHotelHistory);
      await newStoreHotelHistory.save();

      req.flash("success", "Producto registrado exitosamente.");
      res.redirect("/store-hotel");
    }
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al registrar el producto en el almacén, intente nuevamente.");
    console.error("Error:", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Renderizar productos en el almacén del hotel
storeHotelCtrl.renderAllStoreHotel = async (req, res) => {
  try {
    const storeHotel = await StoreHotel.find({eliminadoProductoAlmacenHotel: false})
      .populate("usuarioRegistroAlmacenHotel")
      .populate({
        path: "productoAlmacenHotel",
        populate: "categoriaProducto proveedorProducto"
      })
      .sort({"productoAlmacenHotel.cod": 1})
      .lean();
    const userRole = req.user.trabajadorUsuario.rolTrabajador.nombreRol;
    const currentPage = `stores-hotel`;
    res.render("hotel/store-hotel/all-store-hotel", {
      storeHotel,
      currentPage,
      userRole
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al mostrar la vista de productos en el almacén, intente nuevamente.");
    console.error("Error:", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Renderizar formulario de edición de productos en el almacén del hotel
storeHotelCtrl.renderEditStoreHotel = async (req, res) => {
  try {
    const {id} = req.params;
    const storeHotel = await StoreHotel.findById(id)
      .populate("usuarioRegistroAlmacenHotel")
      .populate({
        path: "productoAlmacenHotel",
        populate: "categoriaProducto proveedorProducto"
      })
      .lean();
    const products = await Product.find({eliminadoProducto: false})
      .populate("proveedorProducto")
      .populate("categoriaProducto")
      .lean();
    const userRole = req.user.trabajadorUsuario.rolTrabajador.nombreRol;
    res.render("hotel/store-hotel/edit-store-hotel", {
      storeHotel,
      products,
      userRole
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al mostrar la vista de edición de productos en el almacén, intente nuevamente.");
    console.error("Error:", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Actualizar producto en el almacén del hotel
storeHotelCtrl.updateStoreHotel = async (req, res) => {
  try {
    const {id} = req.params;
    await StoreHotel.findByIdAndUpdate(id, req.body);
    req.flash("success", "Producto actualizado exitosamente.");
    res.redirect("/store-hotel");
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al actualizar el producto en el almacén, intente nuevamente.");
    console.error("Error:", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Renderizar confirmación de eliminación de un producto del almacén del hotel
storeHotelCtrl.renderDeleteStoreHotel = async (req, res) => {
  try {
    const {id} = req.params;
    const storeHotel = await StoreHotel.findById(id)
      .populate("usuarioRegistroAlmacenHotel")
      .populate({
        path: "productoAlmacenHotel",
        populate: "categoriaProducto proveedorProducto"
      })
      .lean();
    const userRole = req.user.trabajadorUsuario.rolTrabajador.nombreRol;
    res.render("hotel/store-hotel/delete-store-hotel", {
      storeHotel,
      userRole
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al mostrar la vista de eliminación de productos en el almacén, intente nuevamente.");
    console.error("Error:", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Eliminar producto de almacén del hotel
storeHotelCtrl.deleteStoreHotel = async (req, res) => {
  try{
    const {id} = req.params;
    const deletedStoreHotel = await StoreHotel.findById(id);

    if (!deletedStoreHotel) {
      req.flash("wrong", "No se encontró el producto en el almacén del hotel.");
      res.redirect("/store-hotel");
    }

    await StoreHotel.findByIdAndUpdate(id, {eliminadoProductoAlmacenHotel: true});

    const deletedStoreHotelId = deletedStoreHotel._id;

    const newStoreHotelHistory = new StoreHotelHistory({
      tipoHistorial: "Eliminado",
      almacenHotelHistorial: deletedStoreHotelId
    });

    console.log("Producto eliminado en historial: ", newStoreHotelHistory);
    await newStoreHotelHistory.save();
    req.flash("success", "Producto eliminado exitosamente.");
    res.redirect("/store-hotel");
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al eliminar el producto de almacén del hotel, intente nuevamente.");
    console.error("Error:", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

module.exports = storeHotelCtrl;