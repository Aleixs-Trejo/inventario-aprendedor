const salesCtrl = {};

const XLSX = require("xlsx");
const { createTransporter } = require("../config/nodemailer");
const generatePDF = require("../config/puppeteer");

const Sale = require("../models/saleModel");
const SaleHistory = require("../models/salesHistoryModel");
const Balance = require("../models/balanceModel");
const Store = require("../models/storeModel");
const Client = require("../models/clientModel");
const Company = require("../models/companyModel");
const Record = require("../models/recordModel");

// Renderizar vista de nueva venta
salesCtrl.renderRegisterSale = async (req, res) => {
  try {
    const clients = await Client.find({eliminadoCliente: false})
      .sort({dniCliente: -1})
      .lean();
    
    if (!clients) {
      req.flash("wrong", "No hay clientes registrados.");
      console.log("No hay clientes registrados.");
      return res.redirect("/clients/register");
    }

    const stores = await Store.find({eliminadoProductoAlmacen: false})
      .populate({
        path: "almacenProducto",
        populate: {
          path: "proveedorProducto categoriaProducto"
        }
      })
      .sort({almacenStock: -1})
      .lean();

    if (!stores) {
      req.flash("wrong", "No hay productos en Almacén.");
      console.log("No hay productos en Almacén.");
      return res.redirect("/stores/register");
    }

    const currentUser = req.user;
    const currentPage = `current__page`;
    res.render("sales/new-sale", {
      currentUser,
      clients,
      currentPage,
      stores
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al mostrar la vista para la venta, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

// Buscar cliente
salesCtrl.searchClient = async (req, res) => {
  try {
    const cliente = await Client.findOne({dniCliente: req.params.dniCliente, eliminadoCliente: false});
    if (!cliente) {
      const newClient = new Client({
        usuarioRegistroCliente: req.user._id,
        dniCliente: "00000000",
        nombreCliente: "Cliente Varios",
        celularCliente: "-",
        correoCliente: "-",
        eliminadoCliente: false
      });
      await newClient.save();
    }
    console.log("Buscando Cliente: ", cliente);
    if (cliente) {
      res.json({success: true, cliente});
      console.log("Cliente encontrado: ", cliente);
    } else {
      res.json({success: false, message: "El cliente no existe."});
      console.log("Cliente no encontrado: ", cliente);
    }
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al buscar el cliente, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

// Registrar venta
salesCtrl.registerSale = async (req, res) => {
  try {
    const {
      clienteVenta,
      tipoProductosVenta,
      productosVenta
    } = req.body;

    // Verificar si productosVenta es un array
    if (!Array.isArray(productosVenta)) {
      throw new Error("productosVenta debe ser un array.");
    }

    if (productosVenta.length === 0) {
      throw new Error("productosVenta debe tener al menos un producto.");
    }

    // Array para almacenar productos vendidos
    const productosVendidos = [];

    function redondearCentesimas(numero){
      return (Math.round(parseFloat(numero) * 100) / 100).toFixed(2);
    }

    // Recorrer productosVenta
    for (const producto of productosVenta) {
      const { productoVenta, cantidadVenta, descuentoProducto, importeProducto } = producto

      // Buscar el producto en el almacén
      const productInStore = await Store.findById(productoVenta)
        .populate({
          path: "almacenProducto",
          populate: "proveedorProducto categoriaProducto"
        });

      console.log("productInStore: ", productInStore);
      console.log("precioCompraProducto: ", productInStore.almacenProducto.precioCompraProducto);
      console.log("precioVentaProducto: ", productInStore.almacenProducto.precioVentaProducto);

      if (productInStore) {

        // Nos aseguramos que la cantidad de venta y el precio unitario sean numeros
        const cantidadVentaNumber = parseInt(cantidadVenta);
        const descuentoProductoNumber = parseFloat(descuentoProducto);
        const importeProductoNumber = parseFloat(importeProducto);
        const precioCompraProductoNumber = parseFloat(productInStore.almacenProducto.precioCompraProducto);
        const costoTotalProductoNumber = precioCompraProductoNumber * cantidadVentaNumber;
        const gananciaTotalProductoNumber = importeProductoNumber - costoTotalProductoNumber;

        // Verificar si cantidadVenta y precioTotalProducto son números válidos
        if (isNaN(cantidadVentaNumber) || isNaN(importeProductoNumber)) {
          throw new Error("cantidadVentaNumber y importeProductoNumber deben ser números.");
        }

        // Verificar si descuentoProductoVenta es un número válido
        if (isNaN(descuentoProductoNumber)) {
          throw new Error("descuentoProductoNumber debe ser un número.");
        }

        // Producto encontrado, agregarlo al array de productos vendidos
        productosVendidos.push({
          productoVenta,
          cantidadVenta: cantidadVentaNumber,
          descuentoProductoVenta: descuentoProductoNumber,
          costoTotalProducto: costoTotalProductoNumber,
          precioTotalProducto: importeProductoNumber,
          gananciaTotalProducto: gananciaTotalProductoNumber
        });

        // Actualizar el stock del almacén
        productInStore.almacenStock -= cantidadVentaNumber;
        await productInStore.save();

      } else {
        console.log(`El producto con ID ${productoVenta} no se encontró en el almacén.`);
        req.flash("wrong", "El producto no se encontró en el almacén, intentelo de nuevo");
      }
    }

    // Calcular el precio total de la venta
    const costoTotalVenta = productosVendidos.reduce((total, producto) => {
      return total + producto.costoTotalProducto;
    }, 0);

    const precioTotalVenta = productosVendidos.reduce((total, producto) => {
      return total + producto.precioTotalProducto;
    }, 0);

    const descuentoTotalVenta = productosVendidos.reduce((total, producto) => {
      return total + producto.descuentoProductoVenta;
    }, 0);

    // Redondear el precio total de la venta y darle dos decimales
    const precioTotalVentaRedondeado = redondearCentesimas(parseFloat(precioTotalVenta));
    const descuentoTotalVentaRedondeado = redondearCentesimas(parseFloat(descuentoTotalVenta));
    const gananciaTotalVentaRedondeado = redondearCentesimas(parseFloat(precioTotalVentaRedondeado) - parseFloat(costoTotalVenta));

    console.log("costoTotalVenta: ", costoTotalVenta);
    console.log("precioTotalVenta: ", precioTotalVenta);
    console.log("descuentoTotalVenta: ", descuentoTotalVenta);
    console.log("precioTotalVentaRedondeado: ", precioTotalVentaRedondeado);
    console.log("descuentoTotalVentaRedondeado: ", descuentoTotalVentaRedondeado);
    console.log("gananciaTotalVentaRedondeado: ", gananciaTotalVentaRedondeado);

    // Crear la nueva venta
    const newSale = new Sale({
      usuarioVenta: req.user._id,
      estadoVenta: "Pendiente",
      clienteVenta,
      productosVenta: productosVendidos,
      tipoProductosVenta,
      costoTotalVenta,
      descuentoTotalVenta: descuentoTotalVentaRedondeado,
      precioTotalVenta: precioTotalVentaRedondeado,
      gananciaTotalVenta: gananciaTotalVentaRedondeado
    });

    const savedSale = await newSale.save();

    // Crear un registro por cada producto vendido
    for (const producto of productosVenta) {
      const { productoVenta, cantidadVenta } = producto;

      const productoVentaStore = await Store.findById(productoVenta)
        .populate({
          path: "almacenProducto",
          populate: {
            path: "proveedorProducto categoriaProducto"
          }
        })
        .populate("almacenStockUbicacion");

      const newRecord = new Record({
        usuarioRegistroRegistro: req.user._id,
        tipoRegistro: "Salida",
        productoRegistro: productoVentaStore.almacenProducto,
        sucursalRegistro: productoVentaStore.almacenStockUbicacion,
        ventaAsociada: savedSale,
        proveedorProductoRegistro: productoVentaStore.almacenProducto.proveedorProducto,
        categoriaProductoRegistro: productoVentaStore.almacenProducto.categoriaProducto,
        cantidadProductoRegistro: cantidadVenta
      });

      console.log("Registro creado: ", newRecord);
      await newRecord.save();
    }

    req.flash("success", "Venta registrada exitosamente.");
    console.log("Venta registrada exitosamente.");
    // Redirigir al cliente a la vista de las ventas
    return res.redirect("/sales");
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al registrar la venta, intente nuevamente.");
    console.log("Error: ", error);
    return res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

//Mostrar todas las ventas
salesCtrl.renderSales = async (req, res) => {
  try {
    const sales = await Sale.find({ventaCerrada: false})
    .populate({
      path: "usuarioVenta",
      populate: {
        path: "trabajadorUsuario"
      }
    })
    .populate("clienteVenta")
    .populate({
      path: "productosVenta",
      populate: {
        path: "almacenProducto"
      }
    })
    .sort({createdAt: -1})
    .lean();
    
    const userRole = req.user.trabajadorUsuario.rolTrabajador.nombreRol;

    const currentPage = `sales`;
    res.render("sales/all-sales", {
      sales,
      currentPage,
      userRole
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al mostrar todas las ventas, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Mostrar detalles de la venta
salesCtrl.renderDetailSale = async (req, res) => {
  try {
    const {id} = req.params;
    const sale = await Sale.findById(id)
      .populate({
        path: "usuarioVenta",
        populate: {
          path: "trabajadorUsuario"
        }
      })
      .populate("clienteVenta")
      .populate({
        path: "productosVenta.productoVenta",
        populate: {
          path: "almacenProducto",
          populate: {
            path: "proveedorProducto categoriaProducto"
          }
        }
      })
      .lean()

    res.render("sales/details-sale", {sale});
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al mostrar los detalles de la venta, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

// Mostrar voucher de venta
salesCtrl.renderVoucherSale = async (req, res) => {
  try {
    // Generar voucher con la información de la venta
    const company = await Company.findOne({eliminadoCompany: false}).lean();
    const {id} = req.params;
    const sale = await Sale.findById(id)
      .populate({
        path: "usuarioVenta",
        populate: {
          path: "trabajadorUsuario",
          populate: "rolTrabajador"
        }
      })
      .populate("clienteVenta")
      .populate({
        path: "productosVenta.productoVenta",
        populate: {
          path: "almacenProducto"
        }
      })
      .lean();

    const total = parseFloat(sale.productosVenta.reduce((acc, p) => acc + p.precioTotalProducto, 0)).toFixed(2);
    const igv = parseFloat(total * 0.18).toFixed(2);
    const subTotal = parseFloat(total - igv).toFixed(2);

    res.render("sales/voucher-sale", {
      sale,
      total,
      igv,
      subTotal,
      company
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al generar el voucher, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

// Mostrar boleta de venta
salesCtrl.renderBillSale = async (req, res) => {
  try {
    // Generar boleta de venta con la información de la venta
    const company = await Company.findOne({eliminadoCompany: false}).lean();
    const {id} = req.params;
    const sale = await Sale.findById(id)
      .populate({
        path: "usuarioVenta",
        populate: {
          path: "trabajadorUsuario"
        }
      })
      .populate("clienteVenta")
      .populate({
        path: "productosVenta.productoVenta",
        populate: {
          path: "almacenProducto"
        }
      })
      .lean();
    
    const total = parseFloat(sale.productosVenta.reduce((acc, p) => acc + p.precioTotalProducto, 0)).toFixed(2);
    const igv = parseFloat(total * 0.18).toFixed(2);
    const subTotal = parseFloat(total - igv).toFixed(2);
    res.render("sales/bill-sale", {
      sale,
      total,
      igv,
      subTotal,
      company
    });
  } catch(error) {
    req.flash("wrong", "Ocurrió un error al generar la boleta, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Envio de boleta a correo
salesCtrl.generateBillPDF = async (req, res) => {
  try {

    const { id } = req.params;
    const sale = await Sale.findById(id)
      .populate({
        path: "usuarioVenta",
        populate: {
          path: "trabajadorUsuario",
          populate: "rolTrabajador"
        },
      })
      .populate("clienteVenta")
      .populate({
        path: "productosVenta.productoVenta",
        populate: {
          path: "almacenProducto",
        },
      });
    
    if (!sale) {
      req.flash("wrong", "La venta no fue encontrada.");
      return res.redirect("/sales");
    }

    const company = await Company.findOne({eliminadoCompany: false}).lean();

    // Generar el PDF
    const pdfBuffer = await generatePDF(`http://127.0.0.1:${process.env.PORT}/sales/${id}/bill`);

    // Enviar el PDF a correo
    let mailClient = sale.clienteVenta.correoCliente || "null";
    const mailCompany = company.correoCompany;

    const transporter = await createTransporter();

    if (mailClient && mailCompany) {
      const mailOptions = {
        to: mailClient,
        from: mailCompany,
        subject: "Boleta de venta Electrónica",
        text: "Adjuntamos la boleta de venta electrónica de su compra.",
        attachments: [
          {
            filename: `boleta-venta-${id}.pdf`,
            content: pdfBuffer,
            contentType: "application/pdf"
          }
        ]
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log("Boleta de venta enviada exitosamente a correo.");
        console.log("mailOptions: ", mailOptions);
      } catch (error) {
        req.flash("wrong", "Ocurrió un error al enviar el PDF a correo, intente nuevamente.");
        console.log("mailOptions: ", mailOptions);
        console.log("Error: ", error);
        return res.redirect("/sales");
      }
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Content-Disposition", `attachment; filename=boleta-venta-${id}.pdf`);
    res.send(pdfBuffer);
    console.log("Boleta de venta generada exitosamente.");
    req.flash("success", "Boleta de venta enviada exitosamente a correo.");

  } catch (error) {
    req.flash("wrong", "Ocurrió un error al generar la boleta, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error: " + error.message);
  }
};

// Expotar ventas pendientes a Excel
salesCtrl.exportPendingSalesToExcel = async (req, res) => {
  try {
    // Obtener fecha actual
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    const fileName = `ventas${year}${month}${day}${hours}${minutes}${seconds}.xlsx`;

    // Obtener las ventas pendientes
    const ventasPendientes = await Sale.find({ estadoVenta: "Pendiente", ventaCerrada: false })
      .populate("usuarioVenta")
      .populate("clienteVenta")
      .lean();

    // Excluir campos
    const excludedFields = ["updatedAt", "eliminadoVenta", "ventaCerrada"];
    const filteredVentas = ventasPendientes.map(venta => {
      const filteredVenta = {};
      Object.keys(venta).forEach(key => {
        if (!excludedFields.includes(key)) {
          filteredVenta[key] = venta[key];
        }
      });
      return filteredVenta;
    });

    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };

    // Transformar las ventas para el archivo Excel
    const transformedVentas = filteredVentas.map(venta => {
      return {
        "ID Venta": venta.ventaID,
        "Vendedor": venta.usuarioVenta.usuario,
        "Cliente": venta.clienteVenta.nombreCliente,
        "Productos": venta.productosVenta.length,
        "Descuento": parseFloat(venta.descuentoTotalVenta),
        "Importe": parseFloat(venta.precioTotalVenta),
        "Fecha": venta.createdAt.toLocaleDateString("es-PE", options),
      }
    });

    // Calcular total de descuentos
    const totalDescuentos = transformedVentas.reduce((total, venta) => {
      return total + parseFloat(venta.Descuento);
    }, 0);

    // Calcular total de importes
    const totalImportes = transformedVentas.reduce((total, venta) => {
      return total + parseFloat(venta.Importe);
    }, 0);

    // Agregar una fila con el total de descuentos e importes
    transformedVentas.push({
      "ID Venta": "TOTAL",
      "Vendedor": "",
      "Cliente": "",
      "Productos": "",
      "Descuento": parseFloat(totalDescuentos).toFixed(2),
      "Importe": parseFloat(totalImportes).toFixed(2),
      "Fecha": ""
    });

    // Crear hoja de cálculo
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(transformedVentas, {
      header: Object.keys(transformedVentas[0]),
    });

    // Aplicar formato de moneda a las columnas de Descuento e Importe
    XLSX.utils.sheet_add_json(worksheet, transformedVentas, {
      header: Object.keys(transformedVentas[0])
    });

    // Ajustar ancho de columnas
    worksheet["!cols"] = [
      {wch: 15}, // ID Venta
      {wch: 15}, // Vendedor
      {wch: 35}, // Cliente
      {wch: 10}, // Productos
      {wch: 12}, // Descuento
      {wch: 12}, // Importe
      {wch: 20}, // Fecha
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, `Ventas-${year}-${month}-${day}-${hours}-${minutes}-${seconds}`);

    // Escribir la hoja de cálculo en un archivo
    const excelBuffer = XLSX.write(workbook, {type: "buffer", bookType: "xlsx"});

    // Enviar la respuesta con el archivo Excel
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    res.send(excelBuffer);
    console.log("Ventas pendientes exportados a Excel");
    req.flash("success", "Ventas pendientes exportados a Excel exitosamente");
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al exportar las ventas pendientes, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Cerrar caja y exportar ventas pendientes a Excel
salesCtrl.closeRegister = async (req, res) => {
  try {
    // Obtener todas las ventas con estado Pendiente y cancelada
    const ventasPendientes = await Sale.find({ estadoVenta: "Pendiente", ventaCerrada: false })

    const ventasCanceladas = await Sale.find({ estadoVenta: "Cancelada", ventaCerrada: false })

    // Calcular la cantidad total de ventas entre Pendiente y Cancelada
    const totalVentasPendientes = ventasPendientes.length;
    const totalVentasCanceladas = ventasCanceladas.length;
    const cantidadCierreVentas = totalVentasPendientes + totalVentasCanceladas;

    const ventaHistorial = [...ventasPendientes, ...ventasCanceladas].map(venta => ({ cierreVentas: venta._id }));

    const totalCostosVentas = ventasPendientes.reduce((total, venta) => total + parseFloat(venta.costoTotalVenta), 0);

    const totalDescuentosVentas = ventasPendientes.reduce((total, venta) => total + parseFloat(venta.descuentoTotalVenta), 0);

    const totalCierreVentas = ventasPendientes.reduce((total, venta) => total + parseFloat(venta.precioTotalVenta), 0);

    const totalGananciasVentas = ventasPendientes.reduce((total, venta) => total + parseFloat(venta.gananciaTotalVenta), 0);

    // Confirmar ventas pendientes y mantener canceladas las ventas canceladas
    await Sale.updateMany({estadoVenta: "Pendiente"}, {estadoVenta: "Confirmada", ventaCerrada: true});
    await Sale.updateMany({estadoVenta: "Cancelada"}, {ventaCerrada: true});

    // Crear un único registro en el historial de ventas
    const nuevoCierreCaja = new SaleHistory({
      usuarioCierreVenta: req.user._id,
      tipoHistorial: "Cerrada",
      ventaHistorial,
      cantidadCierreVentas,
      totalVentasConfirmadas: totalVentasPendientes,
      totalVentasCanceladas,
      totalDescuentosVentas,
      totalCostosVentas,
      totalCierreVentas,
      totalGananciasVentas
    });

    console.log("nuevoCierreCaja: ", nuevoCierreCaja);
    await nuevoCierreCaja.save();

    const totalVentas = totalVentasPendientes;
    const costosNetos = totalCostosVentas;
    const totalIngresosBalance = totalCierreVentas;
    const gananciasNetas = totalGananciasVentas;

    const newBalance = new Balance({
      usuarioRegistroBalance: req.user._id,
      ventasBalance: nuevoCierreCaja._id,
      totalVentas,
      costosNetos,
      gananciasNetas,
      totalIngresosBalance
    });

    console.log("newBalance: ", newBalance);
    await newBalance.save();

    req.flash("success", "Ventas cerradas exitosamente.");
    res.redirect("/sales");
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al cerrar la caja de ventas, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Mostrar detalles de la venta cerrada
salesCtrl.renderDetailCloseRegister = async (req, res) => {
  try {
    const {id} = req.params;
    const saleHistory = await SaleHistory.findById(id)
      .populate("usuarioCierreVenta")
      .populate({
        path: "ventaHistorial.cierreVentas",
        populate: [
          { path: "usuarioVenta",
            populate: {
              path: "trabajadorUsuario"
            }
          },
          { path: "estadoVenta" },
          { path: "clienteVenta" },
          { path: "productosVenta.productoVenta",
            populate: {
              path: "almacenProducto",
              populate: {
                path: "proveedorProducto categoriaProducto"
              }
            }
          },
        ]
      })
      .sort({createdAt: -1})
      .lean();
    res.render("sales/detail-close-register", {saleHistory});
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al mostrar los detalles del cierre de caja, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

// Anular o cancelar venta y devolver productos al almacén
salesCtrl.cancelSale = async (req, res) => {
  try {
    const { id } = req.params;
    const sale = await Sale.findById(id);
    
    if (!sale) {
      req.flash("wrong", "La venta no fue encontrada.");
      return res.redirect("/sales");
    }

    // Verificar si la venta está cerrada
    if (sale.ventaCerrada) {
      // Actualizar el historial de ventas
      const saleHistory = await SaleHistory.findOne({"ventaHistorial.cierreVentas": id}).lean();
      const balance = await Balance.findOne({_id: sale.usuarioVenta.trabajadorUsuario.dniTrabajador}).lean();

      if (saleHistory) {
        await SaleHistory.updateOne(
          {"ventaHistorial.cierreVentas": id},
          {
            $set: { "ventaHistorial.$.estadoVenta": "cancelada" },
            $inc: {
              totalVentasConfirmadas: -1,
              totalVentasCanceladas: +1,
              totalCierreVentas: -sale.precioTotalVenta,
              totalDescuentosVentas: -sale.descuentoTotalVenta,
              totalCostosVentas: -sale.costoTotalVenta,
              totalGananciasVentas: -sale.gananciaTotalVenta
            }
          }
        );

        // Actualizar el balance correspondiente a ese historial de ventas
        await Balance.updateOne(
          { ventasBalance: saleHistory._id },
          {
            $inc: {
              totalVentas: -1,
              gananciasNetas: -sale.gananciaTotalVenta,
              costosNetos: -sale.costoTotalVenta,
              totalIngresosBalance: -sale.precioTotalVenta
            }
          }
        );

        console.log("saleHistory: ", saleHistory);
        console.log("balance: ", balance);
      }
    }
    
    // Cambiar el estado a Cancelada
    sale.estadoVenta = "Cancelada";

    console.log("sale: ", sale);

    // Devolver productos al almacén
    const productosVendidos = sale.productosVenta;

    for (const producto of productosVendidos) {
      const productInStore = await Store.findById(producto.productoVenta)
        .populate({
          path: "almacenProducto",
          populate: "proveedorProducto categoriaProducto"
        });

      if (productInStore) {
        const cantidadProductoNum = parseInt(producto.cantidadVenta);
        
        if (!isNaN(cantidadProductoNum)) {
          productInStore.almacenStock += cantidadProductoNum;
          await productInStore.save();

          // Guardar registro como Re-ingreso
          const newRecord = new Record({
            usuarioRegistroRegistro: req.user._id,
            tipoRegistro: "Re-ingreso",
            productoRegistro: productInStore.almacenProducto,
            sucursalRegistro: productInStore.almacenStockUbicacion,
            ventaAsociada: sale,
            proveedorProductoRegistro: productInStore.almacenProducto.proveedorProducto,
            categoriaProductoRegistro: productInStore.almacenProducto.categoriaProducto,
            cantidadProductoRegistro: cantidadProductoNum
          });

          console.log("Registro creado: ", newRecord);
          await newRecord.save();
        } else {
          // Manejar el caso en que cantidadProducto no sea un número válido
          req.flash("wrong", "La cantidad de productos vendidos no es un número válido.");
          return res.redirect("/sales");
        }
      } else {
        // Manejar el caso en que el producto no se encuentra en el almacén
        req.flash("wrong", `El producto con ID ${producto.productoVenta} no se encontró en el almacén.`);
        return res.redirect("/sales");
      }
    }
    await sale.save();
    
    req.flash("success", "Venta cancelada exitosamente.");
    res.redirect("/sales");
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al cancelar la venta, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

// Mostrar Balances en intervalo
salesCtrl.renderBalanceSales = async (req, res) => {
  try {
    const balances = await Balance.find({eliminadoBalance: false})
      .populate({
        path: "usuarioRegistroBalance",
        populate: {
          path: "trabajadorUsuario"
        }
      })
      .populate({
        path: "ventasBalance",
        populate: {
          path: "ventaHistorial.cierreVentas",
          match: {"estadoVenta": "Confirmada"},
          populate: [
            {path: "usuarioVenta clienteVenta"},
            {path: "productosVenta.productoVenta",
              populate: {
                path: "almacenProducto",
              }
            }
          ]
        }
      })
      .sort({createdAt: -1})
      .lean();

    const currentPage = `balances`;
    res.render("sales/balance-sales", {
      balances,
      currentPage
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al renderizar los balances, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

// Exportar balances de un periodo de tiempo a Excel
salesCtrl.exportToExcelBalance = async (req, res) => {
  try {
    // Obtener fecha actual
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    const fileName = `balance${year}${month}${day}${hours}${minutes}${seconds}.xlsx`;

    const { fechaInicial, fechaFinal } = req.query;
    console.log("Req.query: ", req.query);

    if (!fechaInicial || !fechaFinal) {
      req.flash("wrong", "Por favor, selecciona ambas fechas.");
      return res.redirect("/sales/balance");
    }

    const fechaInicio = new Date(`${fechaInicial}T00:00:00`);
    const fechaFin = new Date(`${fechaFinal}T23:59:59`);

    console.log("Fecha inicial: ", fechaInicio);
    console.log("Fecha final: ", fechaFin);

    if (fechaFin < fechaInicio) {
      req.flash("wrong", "La fecha final debe ser mayor a la fecha inicial.");
      return res.redirect("/sales/balance");
    }

    // Obtener los balances en el intervalo de tiempo especificado
    const balances = await Balance.find({
        createdAt: {
          $gte: fechaInicio,
          $lte: fechaFin
        }
      })
      .populate({
        path: "usuarioRegistroBalance",
        select: "usuario"
      })
      .populate("ventasBalance")
      .sort({createdAt: -1})
      .lean();

    if (balances.length === 0) {
      req.flash("wrong", "No hay balances para mostrar 😿");
      return res.redirect("/sales/balance");
    }

    // Excluir campos
    const excludedFields = ["updatedAt", "_id", "eliminadoBalance"];
    const filteredBalances = balances.map(balance => {
      const filteredBalance = {};
      Object.keys(balance).forEach(key => {
        if (!excludedFields.includes(key)) {
          filteredBalance[key] = balance[key];
        }
      });
      return filteredBalance;
    });

    const transformedBalances = filteredBalances.map(balance => {
      return {
        "Usuario": balance._doc.usuarioRegistroBalance?.usuario || "NE",
        "Ventas": balance._doc.totalVentas,
        "Costos": parseFloat(balance._doc.costosNetos).toFixed(2),
        "Ingresos": parseFloat(balance._doc.gananciasNetas).toFixed(2),
        "Descuentos": parseFloat(balance._doc.ventasBalance.totalDescuentosVentas).toFixed(2),
        "Ganancias": parseFloat(balance._doc.gananciasNetas).toFixed(2),
        "Fecha de Cierre": new Date(balance._doc.createdAt).toLocaleDateString("es-PE")
      };
    });

    // Calcular el total de ingresos
    const costosNetos = transformedBalances.reduce((total, balance) => total + parseFloat(balance.Costos), 0);
    const totalIngresos = transformedBalances.reduce((total, balance) => total + parseFloat(balance.Ingresos), 0);
    const totalDescuentos = transformedBalances.reduce((total, balance) => total + parseFloat(balance.Descuentos), 0);
    const gananciasNetas = transformedBalances.reduce((total, balance) => total + parseFloat(balance.Ganancias), 0);

    // Agregar una fila con el total de ingresos al final de los balances transformados
    transformedBalances.push({
      "Usuario": "TOTAL",
      "Ventas": "",
      "Costos": parseFloat(costosNetos).toFixed(2),
      "Ingresos": parseFloat(totalIngresos).toFixed(2),
      "Descuentos": parseFloat(totalDescuentos).toFixed(2),
      "Ganancias": parseFloat(gananciasNetas).toFixed(2),
      "Fecha de Cierre": ""
    });

    // Crear hoja de cálculo
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(transformedBalances);
    // Ajustar ancho de columnas
    worksheet["!cols"] = [
      {wch: 15}, // Usuario
      {wch: 12}, // Total de Ventas
      {wch: 15}, // Costos
      {wch: 15}, // Ingresos
      {wch: 15}, // Descuentos
      {wch: 15}, // Ganancias
      {wch: 20}, // Fecha de Cierre
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, `Balances-${year}-${month}-${day}-${hours}-${minutes}-${seconds}`);

    // Escribir la hoja de cálculo en un archivo
    const excelBuffer = XLSX.write(workbook, {type: "buffer", bookType: "xlsx"});

    // Enviar la respuesta con el archivo Excel
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    res.send(excelBuffer);
    console.log("Balances exportados a Excel");
    req.flash("success", "Balances exportados a Excel exitosamente");
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al exportar los balances, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

module.exports = salesCtrl;