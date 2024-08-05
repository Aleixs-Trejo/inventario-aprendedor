const {Schema} = require("mongoose");

const checkOutHotelHistorySchema = new Schema(
  {
    tipoHistorial: {
      type: String,
      required: true,
    },
    usuarioCierreCheckOuts: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    checkOutHotelHistorial: [{
      cierreCheckOuts: {
        type: Schema.Types.ObjectId,
        ref: "CheckOutHotel",
        required: true
      }
    }],
    cantidadCierreCheckOuts: {
      type: Number,
      required: true
    },
    totalAdicionalesCheckOuts: {
      type: Number,
      required: true
    },
    totalDescuentosCheckOuts: {
      type: Number,
      default: 0
    },
    totalImporteCheckOuts: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = checkOutHotelHistorySchema;