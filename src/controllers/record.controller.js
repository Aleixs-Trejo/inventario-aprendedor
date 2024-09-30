const recordCtrl = {};

const Record = require("../models/recordModel");
const XLSX = require("xlsx");

// Renderzar vista de registros
recordCtrl.renderRecords = async (req, res) => {
  try {
    const records = await Record.find()
      .populate({
        path: "usuarioRegistroRegistro",
        populate: {
          path: "trabajadorUsuario",
          populate: "rolTrabajador"
        }
      })
      .populate({
        path: "productoRegistro"
      })
      .populate("sucursalRegistro")
      .populate("ventaAsociada")
      .populate("proveedorProductoRegistro")
      .populate("categoriaProductoRegistro")
      .sort({createdAt: -1})
      .lean();

    const currentPage = `records`;

    res.render("records/all-records", {
      records,
      currentPage
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al mostrar los registros, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

recordCtrl.exportToExcel = async (req, res) => {
  try {
    // Obtener fecha actual
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    const fileName = `registros${year}${month}${day}${hours}${minutes}${seconds}.xlsx`;

    // Obtener los parámetros de fecha desde la URL
    const {fechaInicial, fechaFinal} = req.query;
    console.log("Req.query: ", req.query);

    if (!fechaInicial || !fechaFinal) {
      req.flash("wrong", "Por favor, selecciona ambas fechas.");
      return res.redirect("/records");
    }

    const fechaInicio = new Date(`${fechaInicial}T00:00:00`);
    const fechaFin = new Date(`${fechaFinal}T23:59:59`);

    if (fechaFin < fechaInicio) {
      req.flash("wrong", "La fecha final debe ser mayor a la fecha inicial.");
      return res.redirect("/records");
    }

    console.log("Fecha inicial: ", fechaInicio);
    console.log("Fecha final: ", fechaFin);

    // Obtener los registros entre las fechas de inicio y fin
    const records = await Record.find({
      createdAt: {
        $gte: fechaInicio,
        $lte: fechaFin
      }
    })
      .populate({
        path: "usuarioRegistroRegistro",
        populate: {
          path: "trabajadorUsuario",
          populate: "rolTrabajador"
        }
      })
      .populate("productoRegistro")
      .populate("sucursalRegistro")
      .populate("ventaAsociada")
      .populate("proveedorProductoRegistro")
      .populate("categoriaProductoRegistro")
      .sort({createdAt: -1})
      .lean();

    if (!records) {
      req.flash("wrong", "No hay registros para mostrar 😿");
      return res.redirect("/records");
    }

    // Excluir campos
    const excludedFields = ["_id", "updatedAt"];
    const filteredRecords = records.map(record => {
      const filteredRecord = {};
      Object.keys(record).forEach(key => {
        if (!excludedFields.includes(key)) {
          filteredRecord[key] = record[key];
        }
      });
      return filteredRecord;
    });

    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }

    const transformedRecords = filteredRecords.map(record => {
      return {
        "Registrado por": record.usuarioRegistroRegistro.usuario,
        "Tipo de Registro": record.tipoRegistro,
        "Cod": record.productoRegistro.cod,
        "Nombre": record.productoRegistro.nombreProducto,
        "Descripcion": record.productoRegistro.descripcionProducto,
        "Proveedor": record.proveedorProductoRegistro.nombreProveedor,
        "Categoría": record.categoriaProductoRegistro.nombreCategoria,
        "Sucursal": record.sucursalRegistro.nombreStockUbicacion,
        "Venta Asociada": record.ventaAsociada ? record.ventaAsociada.ventaID : "-",
        "Cantidad": record.cantidadProductoRegistro,
        "Fecha y hora": record.createdAt.toLocaleDateString("es-PE", options)
      };
    });

    // Crear hoja de cálculo
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(transformedRecords);
    // Ajustar ancho de columnas
    worksheet["!cols"] = [
      {wch: 15}, // Registrado por
      {wch: 25}, // Tipo de Registro
      {wch: 8}, // Cod
      {wch: 20}, // Nombre
      {wch: 35}, // Descripcion
      {wch: 20}, // Proveedor
      {wch: 20}, // Categoría
      {wch: 15}, // Sucursal
      {wch: 15}, // Venta Asociada
      {wch: 10}, // Cantidad
      {wch: 25}, // Fecha
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, `Registros-${year}-${month}-${day}-${hours}-${minutes}-${seconds}`);

    // Escribir la hoja de cálculo en un archivo
    const excelBuffer = XLSX.write(workbook, {type: "buffer", bookType: "xlsx"});

    // Enviar la respuesta con el archivo Excel
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    res.send(excelBuffer);
    console.log("Registros exportados a Excel");
    req.flash("success", "Registros exportados a Excel exitosamente");
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al exportar los registros, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};



module.exports = recordCtrl;