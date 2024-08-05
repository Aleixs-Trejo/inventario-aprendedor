const {Schema} = require("mongoose");

const categorySchema = new Schema(
  {
    usuarioRegistroCategoria: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    nombreCategoria: {
      type: String,
      required: true
    },
    descripcionCategoria: {
      type: String,
      required: true
    },
    eliminadoCategoria: {
      type: Boolean,
      default: false
    },
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = categorySchema;