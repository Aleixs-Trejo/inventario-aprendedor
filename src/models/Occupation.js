const {Schema} = require('mongoose');

const occupationSchema = new Schema(
  {
    usuarioRegistroOcupacion: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    habitacionOcupacion: {
      type: Schema.Types.ObjectId,
      ref: 'Room',
      required: true
    },
    dniClienteOcupacion: {
      type: String,
      required: true
    },
    nombreClienteOcupacion: {
      type: String,
      required: true
    },
    celularClienteOcupacion: {
      type: String
    },
    correoClienteOcupacion: {
      type: String
    },
    fechaFinOcupacion: {
      type: Date,
      required: true
    },
    nochesOcupacion: {
      type: Number,
      required: true
    },
    adelantoOcupacion: {
      type: Number,
      default: 0
    },
    importeOcupacion: {
      type: Number,
      required: true
    },
    restanteOcupacion: {
      type: Number,
      default: 0
    },
    observacionesOcupacion: {
      type: String,
      required: true
    },
    estadoOcupacion: {
      type: String,
      enum: ["En Curso", "Limpieza Intermedia", "Expirando", "Extendida", "Finalizada"],
      default: "En Curso"
    },
    limpiezaOcupacion: {
      type: Boolean,
      default: false
    },
    ventaOcupacion: {
      type: Boolean,
      default: false
    },
    finalizadoOcupacion: {
      type: Boolean,
      default: false
    },
  },
  {
    timestamps: true,
    versionKey: false
  }
);

occupationSchema.methods.calcularTiempoRestante = function() {
  const currentDate = new Date();
  const tiempoTranscurrido = currentDate - this.createdAt;
  const tiempoRestante = this.fechaFinOcupacion - currentDate;
  return tiempoRestante;
};

occupationSchema.methods.actualizarEstadoOcupacion = async function() {
  const tiempoRestante = this.calcularTiempoRestante();

  if (tiempoRestante <= 30 * 60 * 1000) {
    if (this.estadoOcupacion === "En Curso") {
      this.estadoOcupacion = "Expirando";
    }
  } else if (tiempoRestante < 0) {
    if (this.estadoOcupacion === "En Curso" || this.estadoOcupacion === "Expirando") {
      this.estadoOcupacion = "Extendido";
    }
  }
  await this.save();
};

module.exports = occupationSchema;