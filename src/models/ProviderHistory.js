const {Schema} = require("mongoose");

const providerHistorySchema = new Schema(
  {
    tipoHistorial: {
      type: String,
      required: true
    },
    usuarioHistorial: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    proveedorHistorial: {
      type: Schema.Types.ObjectId,
      ref: "Provider",
      required: true
    },
    dniProveedorHistorial: {
      type: String,
      required: true
    },
    nombreProveedorHistorial: {
      type: String,
      required: true
    },
    celularProveedorHistorial: {
      type: String,
      required: true
    },
    correoProveedorHistorial: {
      type: String,
      required: true
    },
    direccionProveedorHistorial: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = providerHistorySchema;