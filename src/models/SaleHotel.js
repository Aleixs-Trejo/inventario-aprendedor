const {Schema} = require("mongoose");

const saleHotelSchema = new Schema(
  {
    usuarioRegistroVentaHotel: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    estadoVentaHotel: {
      type: String,
      required: true,
    },
    productosVentaHotel: [{
      productoVentaHotel: {
        type: Schema.Types.ObjectId,
        ref: "StoreHotel",
        required: true,
      },
      cantidadVentaHotel: {
        type: Number,
        required: true,
      },
      descuentoProductoVentaHotel: {
        type: Number,
        required: true,
      },
      precioTotalProductoVentaHotel: {
        type: Number,
        required: true
      }
    }],
    cantidadProductosVentaHotel: {
      type: Number,
      required: true,
    },
    precioTotalVentaHotel: {
      type: Number,
      required: true,
    },
    descuentoTotalVentaHotel: {
      type: Number,
      default: 0,
    },
    pagoAdelantoVentaHotel: {
      type: Number,
      default: 0,
    },
    pagoRestanteVentaHotel: {
      type: Number,
      default: 0,
    },
    ventaPagadaHotel: {
      type: Boolean,
      default: false
    },
    comentariosVentaHotel: {
      type: String,
      default: ""
    },
    ventaCerradaHotel: {
      type: Boolean,
      default: false
    },
    eliminadoVentaHotel: {
      type: Boolean,
      default: false
    },
    referenciEntidad: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "tipoEntidad"
    },
    tipoEntidad: {
      type: String,
      required: true,
      enum: ["Occupation", "Reservation"]
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = saleHotelSchema;