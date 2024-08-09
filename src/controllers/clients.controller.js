const clientsCtrl = {};

const XLSX = require("xlsx");
const Client = require("../models/clientModel");
const ClientHistory = require("../models/clientHistoryModel");

//Registrar un nuevo cliente
clientsCtrl.renderRegisterClient = (req, res) => {
  try {
    res.render("clients/new-client");
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

clientsCtrl.registerClient = async (req, res) => {
  try {
    const errors = [];
    const {
      dniCliente,
      nombreCliente,
      celularCliente,
      correoCliente
    } = req.body;

    console.log("req.body: ", req.body);

    if(dniCliente.length < 8){
      errors.push({text: "El DNI o RUC debe tener como mínimo 8 digitos"});
    }
    if (errors.length > 0){
      res.render("clients/new-client", {
        errors,
        dniCliente,
        nombreCliente,
        celularCliente,
        correoCliente
      })
    } else{
      const dniClient = await Client.findOne({dniCliente, eliminadoCliente: false});

      let celularClient = null;
      if (celularCliente) {
        celularClient = await Client.findOne({celularCliente, eliminadoCliente: false});
      }

      let correoClient = null;
      if (correoCliente) {
        correoClient = await Client.findOne({correoCliente, eliminadoCliente: false});
      }

      if (dniClient){
        console.log("El DNI ya está registrado: ", dniClient)
        req.flash("wrong", "El DNI o RUC ya está registrado");
        res.redirect("/clients/register");
      } else if (celularCliente && celularClient){
        console.log("El celular ya está registrado: ", celularClient)
        req.flash("wrong", "El celular ya está registrado");
        res.redirect("/clients/register");
      } else if (correoCliente && correoClient){
        console.log("El correo ya está registrado: ", correoClient);
        req.flash("wrong", "El correo ya está registrado");
        res.redirect("/clients/register");
      } else {
        const clienteRegistrado = {
          usuarioRegistroCliente: req.user._id,
          dniCliente,
          nombreCliente,
          celularCliente: celularClient ? celularClient : "-",
          correoCliente: correoClient ? correoClient : "-"
        };

        const newClient = new Client(clienteRegistrado);
        await newClient.save(); //Guardando cliente en la BD

        //Agregar al historial
        const clienteHistorial = newClient._id;
        const dniClienteHistorial = newClient.dniCliente;
        const nombreClienteHistorial = newClient.nombreCliente;
        const celularClienteHistorial = newClient.celularCliente;
        const correoClienteHistorial = newClient.correoCliente;

        const newClientHistory = new ClientHistory({
          tipoHistorial: "Registro",
          usuarioHistorial: req.user._id,
          clienteHistorial,
          dniClienteHistorial,
          nombreClienteHistorial,
          celularClienteHistorial,
          correoClienteHistorial,
        });
        await newClientHistory.save();

        req.flash("success", "Cliente registrado exitosamente");
        res.redirect("/clients");
      }
    }
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

//Mostrar Clientes
clientsCtrl.renderClients = async (req, res) => {
  try {
    const clients = await Client.find({eliminadoCliente: false})
    .populate("usuarioRegistroCliente")
    .lean();

    const userRole = req.user.trabajadorUsuario.rolTrabajador.nombreRol;
    res.render("clients/all-clients", {
      clients,
      userRole,
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

// Mostrar información histórica de un cliente
clientsCtrl.renderDetailsClient = async (req, res) => {
  try {
    const {id} = req.params;
    const client = await Client.findById(id).populate("usuarioRegistroCliente").lean();
    const clientHistory = await ClientHistory.find({clienteHistorial: id})
      .populate({
        path: "usuarioHistorial",
        populate: {
          path: "trabajadorUsuario",
          populate: "rolTrabajador"
        }
      })
      .populate({
        path: "clienteHistorial",
        populate: {
          path: "usuarioRegistroCliente",
          populate: "trabajadorUsuario"
        }
      })
      .sort({createdAt: -1})
      .lean();
    const userRole = req.user.trabajadorUsuario.rolTrabajador.nombreRol;
    res.render("clients/details-client", {
      client,
      clientHistory,
      userRole
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al mostrar los detalles del cliente, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

//Editar información de un cliente
clientsCtrl.renderEditClient = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id).lean();
    res.render("clients/edit-client", {client})
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

clientsCtrl.updateClient = async (req, res) => {
  try {
    const {id} = req.params;

    const {
      dniCliente,
      nombreCliente,
      celularCliente,
      correoCliente
    } = req.body;

    const clienteActualizado = {
      usuarioRegistroCliente: req.user._id,
      dniCliente,
      nombreCliente,
      celularCliente: celularCliente ? celularCliente : "-",
      correoCliente: correoCliente ? correoCliente : "-"
    };

    // Actualizar cliente
    const customerUpdated = await Client.findByIdAndUpdate(id, clienteActualizado, {new: true});

    //Agregar al historial
    const clienteHistorial = customerUpdated._id;
    const dniClienteHistorial = customerUpdated.dniCliente;
    const nombreClienteHistorial = customerUpdated.nombreCliente;
    const celularClienteHistorial = customerUpdated.celularCliente;
    const correoClienteHistorial = customerUpdated.correoCliente;

    const newClientHistory = new ClientHistory({
      tipoHistorial: "Actualizado",
      usuarioHistorial: req.user._id,
      clienteHistorial,
      dniClienteHistorial,
      nombreClienteHistorial,
      celularClienteHistorial,
      correoClienteHistorial,
    });
    console.log("Cliente actualizado: ", customerUpdated);
    console.log("Historial actualizado: ", newClientHistory);
    await newClientHistory.save();

    req.flash("success", "Cliente actualizado correctamente");
    res.redirect("/clients");
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

// Exportar a Excel
clientsCtrl.exportToExcel = async (req, res) => {
  try {
    // Obtener fecha actual
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    const fileName = `clientes${year}${month}${day}${hours}${minutes}${seconds}.xlsx`;

    // Consultar clientes a exportar
    const clients = await Client.find({eliminadoCliente: false}).lean();

    // Excluir campos
    const excludedFields = ["_id", "usuarioRegistroCliente", "eliminadoCliente", "createdAt", "updatedAt"];
    const filteredClients = clients.map(client => {
      const filteredClient = {};
      Object.keys(client).forEach(key => {
        if (!excludedFields.includes(key)) {
          filteredClient[key] = client[key];
        }
      });
      return filteredClient;
    });

    // Transforma Clientes
    const transformedClients = filteredClients.map(client => {
      return {
        "DNI/RUC": client.dniCliente,
        "Nombres": client.nombreCliente,
        "Celular": client.celularCliente,
        "Correo": client.correoCliente
      }
    });

    // Crear hoja de cálculo
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(transformedClients);

    // Ajustar ancho de columnas
    worksheet["!cols"] = [
      {wch: 15},
      {wch: 30},
      {wch: 15},
      {wch: 30}
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, `Clientes-${year}-${month}-${day}-${hours}-${minutes}-${seconds}`);

    // Escribir la hoja de cálculo en un archivo
    const excelBuffer = XLSX.write(workbook, {type: "buffer", bookType: "xlsx"});

    // Enviar la respuesta con el archivo Excel
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    res.send(excelBuffer);
    console.log("Clientes exportados a Excel exitosamente");
    req.flash("success", "Clientes exportados a Excel exitosamente");
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

//Eliminar un cliente
clientsCtrl.renderDeleteClient = async (req, res) => {
  try {
    const {id} = req.params;
    const client = await Client.findById(id)
    .populate("usuarioRegistroCliente")
    .lean();
    res.render("clients/delete-client", {client});
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

clientsCtrl.deleteClient = async (req, res) => {
  try {
    const {id} = req.params;
    const deletedClient = await Client.findById(id)
    .populate("usuarioRegistroCliente")
    .lean();

    if (!deletedClient) {
      req.flash("wrong", "Cliente no encontrado");
      return res.redirect("/clients");
    }

    // Actualizar el cliente para establecer eliminadoCliente
    await Client.findByIdAndUpdate(id, {eliminadoCliente: true});

    //Añadir al historial
    const clienteHistorial = deletedClient._id;
    const dniClienteHistorial = deletedClient.dniCliente;
    const nombreClienteHistorial = deletedClient.nombreCliente;
    const celularClienteHistorial = deletedClient.celularCliente;
    const correoClienteHistorial = deletedClient.correoCliente;

    const newClientHistory = new ClientHistory({
      tipoHistorial: "Eliminado",
      usuarioHistorial: req.user._id,
      clienteHistorial,
      dniClienteHistorial,
      nombreClienteHistorial,
      celularClienteHistorial,
      correoClienteHistorial,
    });
    await newClientHistory.save(); //Guardar en el historial

    req.flash("success", "Cliente eliminado correctamente");
    res.redirect("/clients");
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

module.exports = clientsCtrl;