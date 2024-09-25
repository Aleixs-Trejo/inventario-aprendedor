const storeCtrl = {};

const XLSX = require("xlsx");
const Store = require("../models/storeModel");
const Product = require("../models/productModel");
const StockLocation = require("../models/stockLocationModel");
const StoreHistory = require("../models/storeHistoryModel");

//Registrar productos en almacén
storeCtrl.renderRegisterStore = async (req, res) => {
  try {
    const products = await Product.find({eliminadoProducto: false})
      .populate("proveedorProducto")
      .populate("categoriaProducto")
      .sort({cod: 1})
      .lean();

    console.log("Productos: ", products);

    if (!products || products.length === 0) {
      req.flash("wrong", "No hay productos registrados.");
      console.log("No hay productos registrados.");
      return res.redirect("/products/register");
    }

    const stockLocations = await StockLocation.find().lean();
    if (!stockLocations || stockLocations.length === 0) {
      req.flash("wrong", "No hay ubicaciones registradas.");
      console.log("No hay ubicaciones registradas.");
      return res.redirect("/stock-locations/register");
    }
    const currentUser = req.user;
    res.render("stores/new-store", {
      products,
      stockLocations,
      currentUser
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al mostrar la vista de registro de productos en el almacén, intente nuevamente.");
    console.error("Error:", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

storeCtrl.registerStore = async (req, res) => {
  try {
    let { almacenProductos } = req.body;

    if (!almacenProductos) {
      throw new Error("El campo almacenProductos está vacío");
    }

    // Recorrer almacenProductos
    for (const producto of almacenProductos) {
      const { almacenProducto, almacenStock, almacenMinStock, almacenStockUbicacion} = producto

      // Buscar el producto en la bd de productos
      const productInProducts = await Product.findById(almacenProducto)
        .populate("proveedorProducto categoriaProducto");

      if (productInProducts) {
        // Nos aseguramos de que el stock y el stock minimo sean números
        const stock = Number(almacenStock);
        const minStock = Number(almacenMinStock);

        if (isNaN(stock) || isNaN(minStock) || stock === 0 || minStock === 0) {
          throw new Error("El stock no es un número válido");
        }

        // Verificar si el producto con ls misma ubicación ya existe en el almacén
        const existingProductSameLocation = await Store.findOne({
          almacenProducto,
          almacenStockUbicacion})
          .populate("almacenUsuario")
          .populate({
            path: "almacenProducto",
            populate: "proveedorProducto categoriaProducto"
          })
          .populate("almacenStockUbicacion");

        if (existingProductSameLocation) {
          // Producto con la misma ubicación, actualizar el stock
          existingProductSameLocation.almacenStock += stock;
          existingProductSameLocation.almacenMinStock = minStock;
          await existingProductSameLocation.save();

          // Guartar el existinsProductSameLocation como objeto lean
          const existingProductSameLocationLean = existingProductSameLocation.toObject();

          // Guardar historial de almacén como "Relleno"
          const newStoreHistory = new StoreHistory({
            tipoHistorial: "Relleno",
            usuarioHistorial: req.user._id,
            almacenHistorial: existingProductSameLocationLean._id,
            almacenProductoHistorial: almacenProducto,
            almacenStockUbicacionHistorial: almacenStockUbicacion,
            almacenStockHistorial: stock,
            almacenMinStockHistorial: almacenMinStock
          });
          await newStoreHistory.save();
        } else {
          // Producto no encontrado, agregar al almacén
          const newStore = new Store({
            almacenUsuario: req.user,
            almacenProducto,
            almacenStock: stock,
            almacenMinStock: minStock,
            almacenStockUbicacion
          });
          await newStore.save();

          //Guardar la entrada en el historial
          const newStoreHistory = new StoreHistory({
            tipoHistorial: "Registro",
            usuarioHistorial: req.user._id,
            almacenHistorial: newStore._id,
            almacenProductoHistorial: almacenProducto,
            almacenStockUbicacionHistorial: almacenStockUbicacion,
            almacenStockHistorial: stock,
            almacenMinStockHistorial: minStock
          });
          await newStoreHistory.save();
        }

        await productInProducts.save();
      } else {
        console.log(`El producto con ID ${almacenProducto} no se encontró en la bd de productos.`);
        req.flash("wrong", `El producto con ID ${almacenProducto} no se encontró en la bd de productos.`);
      }
    }

    req.flash("success", "Agregado al almacén correctamente.");
    res.redirect("/stores");
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al agregar el producto al almacén, intente nuevamente.");
    console.error("Error:", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Error: ", error);
  }
};

// Buscar productos menores a su stock minimo
storeCtrl.findLowStockProducts = async (req, res) => {
  try {
    // Buscar productos menores a su stock minimo
    const lowStockProducts = await Store.countDocuments({
      eliminadoProductoAlmacen: false,
      $expr: { $lte: ["$almacenStock", "$almacenMinStock"] }
    });
  
    res.json({lowStockProducts});
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

//Mostrar productos del Almacén
storeCtrl.renderStores = async (req, res) => {
  try {
    const stores = await Store.find({eliminadoProductoAlmacen: false})
      .populate("almacenUsuario")
      .populate({
        path: "almacenProducto",
        populate: {
          path: "proveedorProducto categoriaProducto"
        }
      })
      .populate("almacenStockUbicacion")
      .lean();
    

    const currentPage = `stores`;
    res.render("stores/all-stores", {
      stores,
      currentPage
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

//Editar y actualizar un producto de almacén
storeCtrl.renderEditStore = async (req, res) => {
  try {
    const {id} = req.params;
    const store = await Store.findById(id)
      .populate("almacenUsuario")
      .populate({
        path: "almacenProducto",
        populate: {
          path: "proveedorProducto categoriaProducto"
        }
      })
      .populate("almacenStockUbicacion")
      .lean();
    const products = await Product.find({eliminadoProducto: false})
      .populate("proveedorProducto")
      .populate("categoriaProducto")
      .lean();
    const stockLocations = await StockLocation.find().lean();

    res.render("stores/edit-store", {
      store,
      products: products.reduce((acc, product) => {
        acc[product._id] = product;
        return acc;
      }, {}),
      stockLocations: stockLocations.reduce((acc, stockLocation) => {
        acc[stockLocation._id] = stockLocation;
        return acc;
      }, {})
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

storeCtrl.updateStore = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedStoreItem = req.body; // Obtener nuevos datos del formulario

    // Producto editado
    const editedStoreItem = await Store.findById(id);

    // Verificar misma ubicación
    const existingProductSameLocation = await Store.findOne({
      almacenProducto: editedStoreItem.almacenProducto,
      almacenStockUbicacion: updatedStoreItem.almacenStockUbicacion,
      _id: { $ne: id }
    });

    // Unir stocks
    if (existingProductSameLocation) {
      existingProductSameLocation.almacenStock += editedStoreItem.almacenStock;
      await existingProductSameLocation.save();

      // Eliminar el producto editado
      await Store.findByIdAndDelete(id);

      //Guardar la entrada en el historial
      const existingProductSameLocationLean = existingProductSameLocation.toObject();
      const newStoreHistory = new StoreHistory({
        tipoHistorial: "Actualiz. Sucursal",
        usuarioHistorial: req.user._id,
        almacenHistorial: existingProductSameLocationLean._id,
        almacenProductoHistorial: editedStoreItem.almacenProducto,
        almacenStockUbicacionHistorial: editedStoreItem.almacenStockUbicacion,
        almacenStockHistorial: editedStoreItem.almacenStock,
        almacenMinStockHistorial: editedStoreItem.almacenMinStock
      });
      await newStoreHistory.save();

      req.flash("success", "Producto actualizado exitosamente.");
      res.redirect("/stores");
    } else {
      const updatedStore = await Store.findByIdAndUpdate(id, updatedStoreItem, {new: true});

      // Guardar entrada en el historial
      const newStoreHistory = new StoreHistory({
        tipoHistorial: "Actualizado",
        usuarioHistorial: req.user._id,
        almacenHistorial: updatedStore._id,
        almacenProductoHistorial: updatedStoreItem.almacenProducto,
        almacenStockUbicacionHistorial: updatedStoreItem.almacenStockUbicacion,
        almacenStockHistorial: updatedStoreItem.almacenStock,
        almacenMinStockHistorial: updatedStoreItem.almacenMinStock
      });
      await newStoreHistory.save();

      req.flash("success", "Producto actualizado exitosamente.");
      res.redirect("/stores");
    }
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

// Mostrar datos detallados de un producto en el almacén
storeCtrl.renderDetailsStore = async (req, res) => {
  try {
    const {id} = req.params;
    const store = await Store.findById(id)
      .populate({
        path: "almacenUsuario",
        populate: {
          path: "trabajadorUsuario",
          populate: "rolTrabajador"
        }
      })
      .populate({
        path: "almacenProducto",
        populate: {
          path: "proveedorProducto categoriaProducto"
        }
      })
      .populate("almacenStockUbicacion")
      .lean();
    
    const storeHistory = await StoreHistory.find({almacenHistorial: id})
      .populate({
        path: "usuarioHistorial",
        populate: {
          path: "trabajadorUsuario",
          populate: "rolTrabajador"
        }
      })
      .populate({
        path: "almacenHistorial",
        populate: {
          path: "almacenProducto",
          populate: {
            path: "proveedorProducto categoriaProducto"
          }
        }
      })
      .populate({
        path: "almacenProductoHistorial",
        populate: {
          path: "proveedorProducto categoriaProducto"
        }
      })
      .populate({
        path: "almacenStockUbicacionHistorial"
      })
      .sort({createdAt: -1})
      .lean();

    res.render("stores/details-store", {
      store,
      storeHistory
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al renderizar los detalles del producto, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Exportar a Excel
storeCtrl.exportToExcel = async (req, res) => {
  try {
    // Obtener fecha actual
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    const fileName = `almacen${year}${month}${day}${hours}${minutes}${seconds}.xlsx`;

    const stores = await Store.find({eliminadoProductoAlmacen: false})
    .populate("almacenUsuario")
    .populate({
      path: 'almacenProducto',
      populate: {
        path: 'proveedorProducto categoriaProducto'
      }
    })
    .populate({
      path: "almacenStockUbicacion"
    })
    .lean();

    if (!stores) {
      req.flash("wrong", "No hay almacenes para mostrar 😿");
      return res.redirect("/stores");
    }

    console.log("Total de almacen: ", stores.length);
    console.log("Store: ", stores[0])

    // Excluir campos
    const excludedFields = ["_id", "eliminadoAlmacen", "createdAt", "updatedAt"];
    const filteredStores = stores.map(store => {
      const filteredStore = {};
      Object.keys(store).forEach(key => {
        if (!excludedFields.includes(key)) {
          filteredStore[key] = store[key];
        }
      });
      return filteredStore;
    });

    const transformedStores = filteredStores.map(store => {
      return {
        "Agregado por": store.almacenUsuario.usuario,
        "Codigo": store.almacenProducto.cod,
        "Nombre": store.almacenProducto.nombreProducto,
        "Descripcion": store.almacenProducto.descripcionProducto,
        "Precio": store.almacenProducto.precioProducto,
        "Stock": store.almacenStock,
        "Stock Minimo": store.almacenMinStock,
        "Ubicacion": store.almacenStockUbicacion.nombreStockUbicacion,
        "Proveedor": store.almacenProducto.proveedorProducto.nombreProveedor,
        "Categoría": store.almacenProducto.categoriaProducto.nombreCategoria,
      }
    });

    // Crear hoja de cálculo
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(transformedStores);
    // Ajustar ancho de columnas
    worksheet["!cols"] = [
      {wch: 10}, // Agregado por
      {wch: 8}, // Codigo
      {wch: 20}, // Nombre
      {wch: 35}, // Descripcion
      {wch: 8}, // Precio
      {wch: 8}, // Stock
      {wch: 12}, // Stock Minimo
      {wch: 15}, // Ubicacion
      {wch: 18}, // Proveedor
      {wch: 18}, // Categoría
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, `Almacén-${year}-${month}-${day}-${hours}-${minutes}-${seconds}`);

    // Escribir la hoja de cálculo en un archivo
    const excelBuffer = XLSX.write(workbook, {type: "buffer", bookType: "xlsx"});

    // Enviar la respuesta con el archivo Excel
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    res.send(excelBuffer);
    console.log("Almacén exportados a Excel");
    req.flash("success", "Almacén exportados a Excel exitosamente");
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

//Eliminar producto del almacén
storeCtrl.renderDeleteStore = async (req, res) => {
  try {
    const {id} = req.params;
    const store = await Store.findById(id)
      .populate("almacenUsuario")
      .populate([
        { path: "almacenProducto",
          populate: "proveedorProducto categoriaProducto" },
        { path: "almacenStockUbicacion" }
      ])
      .lean();
    console.log("Store: ", store);
    res.render("stores/delete-store", {store});
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

storeCtrl.deleteStore = async (req, res) => {
  try {
    const {id} = req.params;
    const deletedStore = await Store.findById(id)
    .populate({
      path: "almacenProducto",
      populate: {
        path: "proveedorProducto categoriaProducto"
      }
    })
    .populate("almacenStockUbicacion")
    .lean();

    if (!deletedStore) {
      req.flash("wrong", "Producto no encontrado");
      return res.redirect("/stores");
    }

    await Store.findByIdAndUpdate(id, {eliminadoProductoAlmacen: true});
    console.log("Producto eliminado: ", deletedStore);

    const deletedStoreId = deletedStore._id;

    const newStoreHistory = new StoreHistory({
      tipoHistorial: "Eliminado",
      usuarioHistorial: req.user._id,
      almacenHistorial: deletedStoreId,
      almacenProductoHistorial: deletedStore.almacenProducto,
      almacenStockUbicacionHistorial: deletedStore.almacenStockUbicacion,
      almacenStockHistorial: deletedStore.almacenStock,
      almacenMinStockHistorial: deletedStore.almacenMinStock
    });
    await newStoreHistory.save();

    req.flash("success", "Producto eliminado exitosamente.");
    res.redirect("/stores");
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

module.exports = storeCtrl;