const {Schema} = require('mongoose');

const productHistorySchema = new Schema(
  {
    tipoHistorial: {
      type: String,
      required: true
    },
    usuarioHistorial: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    productoHistorial: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    codProductoHistorial: {
      type: String,
      required: true
    },
    proveedorProductoHistorial: {
      type: Schema.Types.ObjectId,
      ref: 'Provider',
      required: true
    },
    categoriaProductoHistorial: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    nombreProductoHistorial: {
      type: String,
      required: true
    },
    descripcionProductoHistorial: {
      type: String,
      required: true
    },
    precioCompraProductoHistorial: {
      type: Number,
      required: true
    },
    precioVentaProductoHistorial: {
      type: Number,
      default: 0
    },
    stockSeguridadProductoHistorial: {
      type: Number,
      default: 10
    },
    stockMinimoProductoHistorial: {
      type: Number,
      default: 5
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = productHistorySchema;