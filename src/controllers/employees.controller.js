const employeeCtrl = {};

const XLSX = require("xlsx");
const Employee = require("../models/employeeModel");
const UserRol = require("../models/userRolModel");
const EmployeeHistory = require("../models/employeeHistoryModel");

//Registro de trabajador
employeeCtrl.renderRegisterEmployee = async (req, res) => {
  try {
    const roles = await UserRol.find().lean();
    res.render("employees/new-employee", {roles});
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};
employeeCtrl.registerEmployee = async (req, res) => {
  try {
    const errors = [];
    const {
      rolTrabajador,
      dniTrabajador,
      nombreTrabajador,
      apellidosTrabajador,
      celularTrabajador,
      correoTrabajador,
      estadoTrabajador
    } = req.body;
    if (dniTrabajador.length < 8){
      errors.push({text: "El DNI debe tener 8 dígitos"});
    }
    if (errors.length > 0) {
      res.render("employees/new-employee", {
        errors,
        rolTrabajador,
        dniTrabajador,
        nombreTrabajador,
        apellidosTrabajador,
        celularTrabajador,
        correoTrabajador,
        estadoTrabajador
      })
    } else {
      const dniEmployee = await Employee.findOne({dniTrabajador, eliminadoTrabajador: false});
      const correoEmployee = await Employee.findOne({correoTrabajador, eliminadoTrabajador: false});
      if (dniEmployee) {
        req.flash("wrong", "El DNI ya está registrado");
        res.redirect("/employees/register");
      } else if (correoEmployee){
        req.flash("wrong", "El correo ya está registrado");
        res.redirect("/employees/register");
      } else {

        const trabajadorRegistrado = {
          rolTrabajador,
          dniTrabajador,
          nombreTrabajador,
          apellidosTrabajador,
          celularTrabajador,
          correoTrabajador,
          estadoTrabajador
        }

        const newEmployee = new Employee(trabajadorRegistrado);
        console.log("Trabajador registrado: ", trabajadorRegistrado)
        await newEmployee.save(); //Guardado en la BD

        const employeeId = newEmployee._id;

        // Agregar al historial
        const newEmployeeHistory = new EmployeeHistory({
          tipoHistorial: "Registro",
          trabajadorHistorial: employeeId
        });

        console.log("Nuevo historial: ", newEmployeeHistory);
        await newEmployeeHistory.save();

        req.flash("success", "Trabajador registrado exitosamente");
        res.redirect("/employees");
      }
    }
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

//Mostrar Trabajadores
employeeCtrl.renderEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({eliminadoTrabajador: false})
    .populate("rolTrabajador")
    .lean();

    const userRole = req.user.trabajadorUsuario.rolTrabajador.nombreRol;
    res.render("employees/all-employees", {
      employees,
      userRole,
    });

  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

//Editar Trabajadores
employeeCtrl.renderEditEmployee = async (req, res) => {
  try {
    const {id} = req.params;
    const employee = await Employee.findById(id)
      .populate("rolTrabajador")
      .lean();
    const roles = await UserRol.find().lean();
    res.render("employees/edit-employee", {
      employee,
      roles: roles.reduce((acc, role) => {
        acc[role._id] = role;
        return acc;
      }, {})
    });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}
employeeCtrl.updateEmployee = async (req, res) => {
  try {
    const {id} = req.params;
    const {estadoTrabajador, ...updateEmployee} = req.body;
    await Employee.findByIdAndUpdate(id, {estadoTrabajador, ...updateEmployee});
    req.flash("success", "Trabajador actualizado exitosamente");
    res.redirect("/employees");
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

// Exportar a Excel
employeeCtrl.exportToExcel = async (req, res) => {
  try {
    // Obtener fecha actual
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    const fileName = `empleados${year}${month}${day}${hours}${minutes}${seconds}.xlsx`;

    // Obtener empleados a excel
    const employees = await Employee.find({eliminadoTrabajador: false})
      .populate({
        path: "rolTrabajador",
        populate: {
          path: "nombreRol"
        }
      })
      .lean();

    // Excluir campos
    const excludedFields = ["_id", "eliminadoTrabajador", "createdAt", "updatedAt"];
    const fillteredEmployees = employees.map(employee => {
      const filteredEmployee = {};
      Object.keys(employee).forEach(key => {
        if (!excludedFields.includes(key)) {
          filteredEmployee[key] = employee[key];
        }
      });
      return filteredEmployee;
    });

    // Transformar trabjadores
    const transformedEmployees = fillteredEmployees.map(employee => {
      return {
        "Rol": employee.rolTrabajador.nombreRol,
        "DNI": employee.dniTrabajador,
        "Nombre": employee.nombreTrabajador,
        "Apellidos": employee.apellidosTrabajador,
        "Celular": employee.celularTrabajador,
        "Correo": employee.correoTrabajador,
        "Estado": employee.estadoTrabajador
      }
    });

    // Creamos la hoja de cálculo
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(transformedEmployees);

    // Ajustar ancho de columnas
    worksheet["!cols"] = [
      {wch: 15}, // Rol
      {wch: 15}, // DNI
      {wch: 25}, // Nombre
      {wch: 25}, // Apellidos
      {wch: 15}, // Celular
      {wch: 30}, // Correo
      {wch: 10}, // Estado
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, `Trabajadores-${year}-${month}-${day}`);

    // Escribir la hoja de calculo en un archivo
    const excelBuffer = XLSX.write(workbook, {type: "buffer", bookType: "xlsx"});

    // Enviar la respuesta con el archivo Excel
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    res.send(excelBuffer);
    console.log("Trabajadores exportados a Excel");
    req.flash("success", "Trabajadores exportados a Excel exitosamente");
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

//Eliminar Trabajadores
employeeCtrl.renderDeleteEmployee = async (req, res) => {
  try {
    const {id} = req.params;
    const employee = await Employee.findById(id)
    .populate("rolTrabajador")
    .lean();
    res.render("employees/delete-employee", {employee});
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

employeeCtrl.deleteEmployee = async (req, res) => {
  try {
    const {id} = req.params;
    const deletedEmployee = await Employee.findById(id)
    .populate("rolTrabajador")
    .lean();

    if (!deletedEmployee) {
      req.flash("wrong", "Trabajador no encontrado");
      return res.redirect("/employees");
    }

    // Mostrar como eliminado
    await Employee.findByIdAndUpdate(id, {eliminadoTrabajador: true});

    // Agregar al historial
    const newEmployeeHistory = new EmployeeHistory({
      tipoHistorial: "Eliminado",
      trabajadorHistorial: deletedEmployee._id
    });
    console.log("Nuevo historial: ", newEmployeeHistory);
    await newEmployeeHistory.save(); // Guardando en historial

    req.flash("success", "Empleado eliminado exitosamente");
    res.redirect("/employees");
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
}

module.exports = employeeCtrl;