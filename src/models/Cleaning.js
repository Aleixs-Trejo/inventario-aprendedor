const {Schema} = require('mongoose');

const cleaningReservationSchema = new Schema(
  {
    usuarioRegistroLimpieza: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    usuarioACargoLimpieza: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    tipoLimpieza: {
      type: String,
      required: true,
      enum: ["Ocupacion", "Reservacion"]
    },
    comentariosLimpieza: {
      type: String,
      required: true
    },
    finalizadoLimpieza: {
      type: Boolean,
      default: false
    },
    fechaFinLimpieza: {
      type: Date,
      required: false
    },
    referenciaEntidad: {
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
    versionKey: false
  }
);

module.exports = cleaningReservationSchema;