const {Schema} = require('mongoose');

const checkOutHotelSchema = new Schema(
  {
    usuarioRegistroCheckOut: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    tipoUsoCheckOut: {
      type: String,
      required: true,
      enum: ["Ocupacion", "Reservacion", "Anulacion"]
    },
    comentariosCheckOut: {
      type: String
    },
    importeAdicionalCheckOut: {
      type: Number,
      default: 0
    },
    descuentoCheckOut: {
      type: Number,
      default: 0
    },
    totalVentaHotelCheckOut: {
      type: Number,
      default: 0
    },
    adelantoVentaHotelCheckOut: {
      type: Number,
      default: 0
    },
    descuentoVentaHotelCheckOut: {
      type: Number,
      default: 0
    },
    restanteVentaHotelCheckOut: {
      type: Number,
      default: 0
    },
    pagoAlSalirCheckOut: {
      type: Number,
      default: 0
    },
    importeTotalCheckOut: {
      type: Number,
      default: 0
    },
    eliminadoCheckOut: {
      type: Boolean,
      default: false
    },
    referenciaCheckOut: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "tipoCheckOut"
    },
    tipoCheckOut: {
      type: String,
      required: true,
      enum: ["Occupation", "Reservation"]
    },
    checkOutCerrado: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = checkOutHotelSchema;