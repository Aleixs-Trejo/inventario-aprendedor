const providersCtrl = {};

const XLSX = require("xlsx");
const Provider = require("../models/providerModel");
const ProviderHistory = require("../models/providerHistoryModel");

//Crear proveedor
providersCtrl.renderRegisterProvider = (req, res) => {
  try {
    res.render("providers/new-provider");
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

providersCtrl.registerProvider = async (req, res) => {
  try {
    const {
      dniProveedor,
      nombreProveedor,
      celularProveedor,
      correoProveedor,
      direccionProveedor
    } = req.body;

    const dniProvider = await Provider.findOne({dniProveedor, eliminadoProveedor: false});
    const correoProvider = await Provider.findOne({correoProveedor, eliminadoProveedor: false});

    if (dniProvider){
      req.flash("wrong", "El DNI ya está registrado");
    } else if (correoProvider){
      req.flash("wrong", "El correo ya está registrado");
    } else {
      const newProvider = new Provider(
        {
          usuarioRegistroProveedor: req.user._id,
          dniProveedor,
          nombreProveedor,
          celularProveedor,
          correoProveedor,
          direccionProveedor
        }
      );

      await newProvider.save()

      // Agregar al historial
      const providerId = newProvider._id;
      const usuarioHistorial = req.user._id;
      const dniProveedorHistorial = newProvider.dniProveedor;
      const nombreProveedorHistorial = newProvider.nombreProveedor;
      const celularProveedorHistorial = newProvider.celularProveedor;
      const correoProveedorHistorial = newProvider.correoProveedor;
      const direccionProveedorHistorial = newProvider.direccionProveedor;

      const newProviderHistory = new ProviderHistory({
        tipoHistorial: "Registro",
        usuarioHistorial,
        proveedorHistorial: providerId,
        dniProveedorHistorial,
        nombreProveedorHistorial,
        celularProveedorHistorial,
        correoProveedorHistorial,
        direccionProveedorHistorial
      });

      await newProviderHistory.save();

      req.flash("success", "Proveedor registrado exitosamente");
      res.redirect("/providers");
    }
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

//Mostrar Proveedores
providersCtrl.renderProviders = async (req, res) => {
  try {
    const providers = await Provider.find({eliminadoProveedor: false})
      .populate("usuarioRegistroProveedor")
      .lean();

    const userRole = req.user.trabajadorUsuario.rolTrabajador.nombreRol;
    res.render("providers/all-providers", {
      providers,
      userRole
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

//Editar Proveedor
providersCtrl.renderEditProvider = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id).lean();
    res.render("providers/edit-provider", {provider});
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}
providersCtrl.updateProvider = async (req, res) => {
  try {
    const {id} = req.params;
    const updatedProvider = await Provider.findByIdAndUpdate(id, req.body, {new: true});

    // Agregar al historial
    const providerId = updatedProvider._id;
    const usuarioHistorial = req.user._id;
    const dniProveedorHistorial = updatedProvider.dniProveedor;
    const nombreProveedorHistorial = updatedProvider.nombreProveedor;
    const celularProveedorHistorial = updatedProvider.celularProveedor;
    const correoProveedorHistorial = updatedProvider.correoProveedor;
    const direccionProveedorHistorial = updatedProvider.direccionProveedor;

    const newProviderHistory = new ProviderHistory({
      tipoHistorial: "Modificado",
      usuarioHistorial,
      proveedorHistorial: providerId,
      dniProveedorHistorial,
      nombreProveedorHistorial,
      celularProveedorHistorial,
      correoProveedorHistorial,
      direccionProveedorHistorial
    });

    await newProviderHistory.save();

    req.flash("success", "Proveedor actualizado exitosamente");
    res.redirect("/providers");
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

// Mostrar detalles históricos de un proveedor
providersCtrl.renderProviderDetails = async (req, res) => {
  try {
    const {id} = req.params;
    const provider = await Provider.findById(id).lean();

    if (!provider) {
      req.flash("wrong", "El proveedor no existe");
      return res.redirect("/providers");
    }

    const providerHistory = await ProviderHistory.find({proveedorHistorial: id})
      .populate({
        path: "usuarioHistorial",
        populate: {
          path: "trabajadorUsuario",
          populate: "rolTrabajador"
        }
      })
      .populate("proveedorHistorial")
      .lean();
    
    const userRole = req.user.trabajadorUsuario.rolTrabajador.nombreRol;
    res.render("providers/details-provider", {
      provider,
      providerHistory,
      userRole
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al mostrar los detalles del proveedor, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Exportar a Excel
providersCtrl.exportToExcel = async (req, res) => {
  try {
    // Obtener fecha actual
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    const fileName = `proveedores${year}${month}${day}${hours}${minutes}${seconds}.xlsx`;

    // Consultar productos a exportar
    const providers = await Provider.find({eliminadoProveedor: false}).lean();

    // Excluir campos
    const excludedFields = ["_id, eliminadoProveedor", "createdAt", "updatedAt"];
    const filteredProviders = providers.map(provider => {
      const filteredProvider = {};
      Object.keys(provider).forEach(key => {
        if (!excludedFields.includes(key)) {
          filteredProvider[key] = provider[key];
        }
      });
      return filteredProvider;
    });

    // Transformar elementos
    const transformedProviders = filteredProviders.map(provider => {
      return {
        "DNI/RUC": provider.dniProveedor,
        "Nombres": provider.nombreProveedor,
        "Celular": provider.celularProveedor,
        "Correo": provider.correoProveedor,
        "Dirección": provider.direccionProveedor
      }
    });

    // Crear la hoja de cálculo
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(transformedProviders);

    // Modificar el ancho de las columnas
    worksheet["!cols"] = [
      {wch: 15},
      {wch: 25},
      {wch: 15},
      {wch: 30},
      {wch: 30}
    ];

    // Centrar el contenido en las celdas
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C<= range.e.c; ++C) {
        const cellAddress = { c: C, r: R};
        if (!worksheet[cellAddress]) continue;
        worksheet[cellAddress].s = {
          alignment: {
            horizontal: "center",
            vertical: "center"
          }
        }
      }
    }

    XLSX.utils.book_append_sheet(workbook, worksheet, `Proveedores-${year}-${month}-${day}-${hours}-${minutes}-${seconds}`);

    // Escribir la hoja de cálculo el un archivo
    const excelBuffer = XLSX.write(workbook, {type: "buffer", bookType: "xlsx"});

    // Enviar la respuesta con el archivo Excel
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    res.send(excelBuffer);
    console.log("Proveedores exportados a Excel");
    req.flash("success", "Proveedores exportados a Excel exitosamente");
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

//Eliminar Proveedor
providersCtrl.renderDeleteProvider = async (req, res) => {
  try {
    const {id} = req.params;
    const provider = await Provider.findById(id)
      .populate({
        path: "usuarioRegistroProveedor",
        populate: {
          path: "trabajadorUsuario",
          populate: "rolTrabajador"
        }
      })
      .lean();
    res.render("providers/delete-provider", {provider});
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

providersCtrl.deleteProvider = async (req, res) => {
  try {
    const {id} = req.params;
    const deletedProvider = await Provider.findById(id).lean();

    if (!deletedProvider) {
      req.flash("wrong", "El proveedor no existe");
      return res.redirect("/providers");
    }

    // Eliminar el proveedor
    const providerDeleted = await Provider.findByIdAndUpdate(id, {eliminadoProveedor: true}, {new: true});

    // Agregar al historial
    const providerId = deletedProvider._id;
    const usuarioHistorial = req.user._id;
    const dniProveedorHistorial = providerDeleted.dniProveedor;
    const nombreProveedorHistorial = providerDeleted.nombreProveedor;
    const celularProveedorHistorial = providerDeleted.celularProveedor;
    const correoProveedorHistorial = providerDeleted.correoProveedor;
    const direccionProveedorHistorial = providerDeleted.direccionProveedor;

    const newProviderHistory = new ProviderHistory({
      tipoHistorial: "Eliminado",
      usuarioHistorial,
      proveedorHistorial: providerId,
      dniProveedorHistorial,
      nombreProveedorHistorial,
      celularProveedorHistorial,
      correoProveedorHistorial,
      direccionProveedorHistorial
    });

    await newProviderHistory.save();

    req.flash("success", "Proveedor eliminado exitosamente");
    res.redirect("/providers")
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

module.exports = providersCtrl;