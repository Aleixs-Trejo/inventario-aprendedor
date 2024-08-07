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
    precioProductoHistorial: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = productHistorySchema;