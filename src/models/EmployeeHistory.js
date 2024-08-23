const {Schema} = require("mongoose");

const employeeHistorySchema = new Schema(
  {
    tipoHistorial: {
      type: String,
      required: true
    },
    usuarioHistorial: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    trabajadorHistorial: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    rolTrabajadorHistorial: {
      type: Schema.Types.ObjectId,
      ref: "UserRol",
      required: true,
    },
    dniTrabajadorHistorial: {
      type: String,
      required: true,
    },
    nombreTrabajadorHistorial: {
      type: String,
      required: true,
    },
    apellidosTrabajadorHistorial: {
      type: String,
      required: true
    },
    celularTrabajadorHistorial: {
      type: String,
      required: true
    },
    correoTrabajadorHistorial: {
      type: String,
      required: true
    },
    estadoTrabajadorHistorial: {
      type: String,
      enum: ["activo", "inactivo"],
      default: "activo",
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

module.exports = employeeHistorySchema;