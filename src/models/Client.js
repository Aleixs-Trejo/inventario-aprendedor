const {Schema} = require("mongoose");

const clientSchema = new Schema(
  {
    usuarioRegistroCliente: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    dniCliente: {
      type: String,
      required: true
    },
    nombreCliente: {
      type: String,
      required: true
    },
    celularCliente: {
      type: String,
    },
    correoCliente: {
      type: String
    },
    eliminadoCliente :{
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = clientSchema;