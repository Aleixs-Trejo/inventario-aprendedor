const {Schema} = require("mongoose");

const saleHotelHistorySchema = new Schema(
  {
    tipoHistorial: {
      type: String,
      required: true,
    },
    usuarioCheckOutCierreVenta: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ventaHotelHistorial: [{
      cierreVentasHotel: {
        type: Schema.Types.ObjectId,
        ref: "SaleHotel",
        required: true,
      }
    }],
    cantidadCierreVentasHotel: {
      type: Number,
      required: true,
    },
    cantidadVentasConfirmadasHotel: {
      type: Number,
      required: true
    },
    cantidadVentasCanceladasHotel: {
      type: Number,
      required: true
    },
    totalDescuentosVentasHotel: {
      type: Number,
      default: 0,
      required: true
    },
    importeTotalCierreVentasHotel: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = saleHotelHistorySchema;