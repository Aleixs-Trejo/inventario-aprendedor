const {Schema} = require('mongoose');

const RecordSchema = new Schema(
  {
    usuarioRegistroRegistro: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    tipoRegistro: {
      type: String,
      enum: ['Ingreso', 'Modificacion-sucursal', 'Modificacion', 'Salida', 'Re-ingreso'],
      required: true
    },
    productoRegistro: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    sucursalRegistro: {
      type: Schema.Types.ObjectId,
      ref: 'StockLocation',
      required: true
    },
    ventaAsociada: { // En caso que haya salida por venta
      type: Schema.Types.ObjectId,
      ref: 'Sale'
    },
    proveedorProductoRegistro: {
      type: Schema.Types.ObjectId,
      ref: 'Provider',
      required: true
    },
    categoriaProductoRegistro: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    cantidadProductoRegistro: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = RecordSchema;