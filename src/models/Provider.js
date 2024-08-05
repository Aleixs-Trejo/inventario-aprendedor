const {Schema} = require("mongoose");

const providerSchema = new Schema(
  {
    usuarioRegistroProveedor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    dniProveedor: {
      type: Number,
      required: true
    },
    nombreProveedor: {
      type: String,
      required: true
    },
    celularProveedor: {
      type: Number,
      required: true,
    },
    correoProveedor: {
      type: String,
      required: true,
    },
    direccionProveedor: {
      type: String
    },
    eliminadoProveedor: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = providerSchema;
