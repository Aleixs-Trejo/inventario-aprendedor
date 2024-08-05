const {Schema} = require("mongoose");

const employeeSchema = new Schema(
  {
    rolTrabajador: {
      type: Schema.Types.ObjectId,
      ref: "UserRol",
      required: true
    },
    dniTrabajador: {
      type: String,
      required: true
    },
    nombreTrabajador: {
      type: String,
      required: true
    },
    apellidosTrabajador: {
      type: String,
      required: true
    },
    celularTrabajador: {
      type: Number,
      required: true,
      unique: true
    },
    correoTrabajador: {
      type: String,
      required: true
    },
    estadoTrabajador: {
      type: String,
      enum: ["activo", "inactivo"],
      default: "activo"
    },
    eliminadoTrabajador: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = employeeSchema;