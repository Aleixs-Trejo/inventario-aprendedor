const {Schema} = require("mongoose");

const saleSchema = new Schema(
  {
    usuarioVenta:{
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    estadoVenta: {
      type: String,
      required: true
    },
    clienteVenta: {
      type: Schema.Types.ObjectId,
      ref: "Client",
    },
    productosVenta: [{
      productoVenta: {
        type: Schema.Types.ObjectId,
        ref: "Store",
        required: true
      },
      cantidadVenta: {
        type: Number,
        required: true
      },
      descuentoProductoVenta: {
        type: Number,
        required: true
      },
      precioTotalProducto: {
        type: Number,
        required: true
      }
    }],
    tipoProductosVenta: {
      type: Number,
      required: true
    },
    precioTotalVenta: {
      type: Number,
      required: true
    },
    descuentoTotalVenta: {
      type: Number,
      default: 0,
    },
    ventaCerrada: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = saleSchema;
