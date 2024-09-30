const {Schema} = require("mongoose");

const productSchema = new Schema(
  {
    usuarioProducto: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    cod: {
      type: String,
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
    precioCompraProducto: {
      type: Number,
      default: 0
    },
    precioVentaProducto: {
      type: Number,
      required: true
    },
    stockSeguridadProducto: {
      type: Number,
      default: 10
    },
    stockMinimoProducto: {
      type: Number,
      default: 5
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