const {Schema} = require("mongoose");

const productSchema = new Schema(
  {
    cod: {
      type: Number,
      required: true
    },
    usuarioProducto: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    proveedorProducto: {
      type: Schema.Types.ObjectId,
      ref: "Provider",
      required: true
    },
    categoriaProducto: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },
    nombreProducto: {
      type: String,
      required: true
    },
    descripcionProducto: {
      type: String,
      required: true
    },
    precioProducto: {
      type: Number,
      required: true
    },
    eliminadoProducto: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = productSchema;