const employeeHistory = {};
const EmployeeHistory = require("../models/employeeHistoryModel");

// Mostrar historial de empleados
employeeHistory.renderEmployeeHistory = async (req, res) => {
  try {
    const employeesHistory = await EmployeeHistory.find()
    .populate({
      path: "trabajadorHistorial",
      populate: {
        path: "rolTrabajador"
      }
    })
    .lean();
    console.log("Historial de Empleados: ", employeesHistory);
    res.render("employees/history-employees", { employeesHistory });
  } catch (error) {
    req.flash("wrong", "Ocurrió un error, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

module.exports = employeeHistory;