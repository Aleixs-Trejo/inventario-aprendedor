const productsCtrl = {};

const XLSX = require("xlsx");
const Product = require("../models/productModel");
const User = require("../models/userModel");
const Provider = require("../models/providerModel");
const Category = require("../models/categoryModel");
const ProductHistory = require("../models/productHistoryModel");

//Registrar nuevo producto
productsCtrl.renderRegisterProduct = async (req, res) => {
  try {
    const users = await User.find({eliminadoUsuario: false}).lean();
    const providers = await Provider.find({eliminadoProveedor: false}).lean();
    const categories = await Category.find({eliminadoCategoria: false}).lean();
    res.render("products/new-product", {
      users,
      providers,
      categories
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente");
    console.error("Error:", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

productsCtrl.registerProduct = async (req, res) => {
  try {
    const {
      cod,
      proveedorProducto,
      categoriaProducto,
      nombreProducto,
      descripcionProducto,
      precioProducto
    } = req.body;

    const isExistsProduct = await Product.findOne({
      proveedorProducto,
      categoriaProducto,
      nombreProducto,
      descripcionProducto,
      eliminadoProducto: false
    });

    if(isExistsProduct){
      req.flash("wrong", "El producto ya está registrado");
      res.redirect("/products/register");
    } else{

      // Guardamos el precio del producto con dos decimales
      const precioProductoDecimal = parseFloat(precioProducto).toFixed(2);

      const newProduct = new Product(
        {
          usuarioProducto: req.user._id,
          cod,
          proveedorProducto,
          categoriaProducto,
          nombreProducto,
          descripcionProducto,
          precioProducto: precioProductoDecimal
        }
      );

      const productId = newProduct._id;

      // Agregar al historial
      const newProductHistory = new ProductHistory({
        tipoHistorial: "Registro",
        productoHistorial: productId
      });

      // Guardar Historial en la BD
      await newProductHistory.save();

      console.log("Nuevo Producto: ", newProduct);
      console.log("Registro en historial: ", newProductHistory);
      await newProduct.save(); //Guardar en BD en la coleccion Products
      req.flash("success", "Producto registrado exitosamente");
      return res.redirect("/products");
    }
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente");
    console.error("Error:", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

//Mostrar Productos
productsCtrl.renderProducts = async (req, res) => {
  try {
    // Buscar todos los productos
    const products = await Product.find({eliminadoProducto: false})
    .populate("usuarioProducto")
    .populate("proveedorProducto")
    .populate("categoriaProducto")
    .lean();

    const userRole = req.user.trabajadorUsuario.rolTrabajador.nombreRol;
    res.render("products/all-products", {
      products,
      userRole
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente");
    console.error("Error:", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

//Editar y actualizar producto
productsCtrl.renderEditProduct = async (req, res) => {
  try {
    const {id} = req.params;
    const product = await Product.findById(id)
    .populate("usuarioProducto")
    .populate("proveedorProducto")
    .populate("categoriaProducto")
    .lean();

    if (!product){
      req.flash("wrong", "El producto no existe");
      return res.redirect("/products");
    }

    const usuarios = await User.find({eliminadoUsuario: false}).lean();
    const proveedores = await Provider.find({eliminadoProveedor: false}).lean();
    const categorias = await Category.find({eliminadoCategoria: false}).lean();

    if (!usuarios || !proveedores || !categorias){
      req.flash("wrong", "Ocurrió un error, intente nuevamente");
      throw new Error("No se encontraron los usuarios, proveedores o categorías");
    }

    const userRole = req.user.trabajadorUsuario.rolTrabajador.nombreRol;
    res.render("products/edit-product", {
      product,
      usuarios: usuarios.reduce((acc, usuario) => {
        acc[usuario._id] = usuario;
        return acc;
      }, {}),
      proveedores: proveedores.reduce((acc, proveedor) => {
        acc[proveedor._id] = proveedor;
        return acc;
      }, {}),
      categorias: categorias.reduce((acc, categoria) => {
        acc[categoria._id] = categoria;
        return acc;
      }, {}),
      userRole
    });
    console.log("Rol de usuario desde editar producto: ", userRole);
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente");
    console.error("Error:", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

productsCtrl.updateProduct = async (req, res) => {
  try {
    const {id} = req.params;
    await Product.findByIdAndUpdate(id, req.body);
    req.flash("success", "Producto actualizado exitosamente");
    res.redirect("/products");
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente");
    console.log(error);
  }
}

// Exportar a Excel
productsCtrl.exportToExcel = async (req, res) => {
  try {
    // Obtener fecha actual
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    const fileName = `productos${year}${month}${day}${hours}${minutes}${seconds}.xlsx`;

    // Consultar Productos según el filtro
    const products = await Product.find({eliminadoProducto: false})
    .populate({
      path: "usuarioProducto",
      select: "usuario"
    })
    .populate({
      path: "proveedorProducto",
      select: "nombreProveedor"
    })
    .populate({
      path: "categoriaProducto",
      select: "nombreCategoria"
    })
    .lean();

    // Excluir campos 
    const excludedFields = ["_id", "eliminadoProducto", "updatedAt"];
    const filteredProducts = products.map(product => {
      const filteredProduct = {};
      Object.keys(product).forEach(key => {
        if (!excludedFields.includes(key)) {
          filteredProduct[key] = product[key];
        }
      });
      return filteredProduct;
    });

    const transformedProducts = filteredProducts.map(product => {
      return {
        "Código": product.cod,
        "Usuario": product.usuarioProducto.usuario,
        "Nombre": product.nombreProducto,
        "Descripción": product.descripcionProducto,
        "Precio": product.precioProducto,
        "Proveedor": product.proveedorProducto.nombreProveedor,
        "Categoría": product.categoriaProducto.nombreCategoria,
        "Fecha": product.createdAt.toLocaleDateString("es-PE"),
      }
    })

    // Crear la hoja de cálculo
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(transformedProducts);

    // Ajustar ancho de columnas
    worksheet["!cols"] = [
      {wch: 15}, // Código
      {wch: 20}, // Usuario
      {wch: 25}, // Nombre
      {wch: 35}, // Descripción
      {wch: 12}, // Precio
      {wch: 25}, // Proveedor
      {wch: 25}, // Categoría
      {wch: 25}, // Fecha
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, `Productos-${year}-${month}-${day}-${hours}-${minutes}-${seconds}`);

    // Escribir la hoja de cálculo en un archivo
    const excelBuffer = XLSX.write(workbook, {type: "buffer", bookType: "xlsx"});

    // Enviar la respuesta con el archivo Excel
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    res.send(excelBuffer);
    console.log("Productos exportados a Excel");
    req.flash("success", "Productos exportados a Excel exitosamente");

  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

//Eliminar producto
productsCtrl.renderDeleteProduct = async (req, res) => {
  try {
    const {id} = req.params;
    const product = await Product.findById(id)
    .populate("usuarioProducto")
    .populate("proveedorProducto")
    .populate("categoriaProducto")
    .lean();

    console.log("Producto a eliminar: ", product);
    res.render("products/delete-product", {product});
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

productsCtrl.deleteProduct = async (req, res) => {
  try {
    const {id} = req.params;
    const deletedProduct = await Product.findById(id)
    .populate("usuarioProducto")
    .populate("proveedorProducto")
    .populate("categoriaProducto")
    .lean();

    if (!deletedProduct){
      req.flash("wrong", "El producto no existe");
      return res.redirect("/products");
    }

    // Eliminar el producto
    await Product.findByIdAndUpdate(id, {eliminadoProducto: true});

    const deletedProductId = deletedProduct._id;

    // Agregar al historial el producto eliminado
    const newProductHistory = new ProductHistory({
      tipoHistorial: "Eliminado",
      productoHistorial: deletedProductId
    });

    console.log(newProductHistory);
    await newProductHistory.save();
    
    req.flash("success", "Producto eliminado exitosamente");
    res.redirect("/products");
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente");
    console.error("Error:", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

module.exports = productsCtrl;