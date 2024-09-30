const {Schema} = require("mongoose");

const salesHistorySchema = new Schema(
  {
    tipoHistorial: {
      type: String,
      required: true
    },
    usuarioCierreVenta: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    ventaHistorial: [{
      cierreVentas: {
        type: Schema.Types.ObjectId,
        ref: "Sale",
        required: true
      }
    }],
    cantidadCierreVentas: {
      type: Number,
      required: true
    },
    totalVentasConfirmadas: {
      type: Number,
      required: true
    },
    totalVentasCanceladas: {
      type: Number,
      required: true
    },
    totalDescuentosVentas: {
      type: Number,
      default: 0,
      required: true
    },
    totalCostosVentas: {
      type: Number,
      default: 0
    },
    totalCierreVentas: {
      type: Number,
      required: true
    },
    totalGananciasVentas: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = salesHistorySchema;