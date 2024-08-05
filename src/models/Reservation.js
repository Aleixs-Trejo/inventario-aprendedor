const {Schema} = require('mongoose');

const reservationSchema = new Schema(
  {
    usuarioReserva: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    dniClienteReserva: {
      type: String,
      required: true
    },
    nombreClienteReserva: {
      type: String,
      required: true
    },
    celularClienteReserva: {
      type: String
    },
    correoClienteReserva: {
      type: String
    },
    habitacionReserva: {
      type: Schema.Types.ObjectId,
      ref: 'Room',
      required: true
    },
    fechaInicioReserva: {
      type: Date,
      required: true
    },
    fechaFinReserva: {
      type: Date,
      required: true
    },
    nochesReserva: {
      type: Number,
    },
    importeReserva: {
      type: Number,
      required: true
    },
    adelantoReserva: {
      type: Number,
      default: 0
    },
    restanteReserva: {
      type: Number,
      default: 0
    },
    observacionesReserva: {
      type: String,
    },
    limpiezaReserva: {
      type: Boolean,
      default: false
    },
    estadoReserva: {
      type: String,
      enum: ["Pendiente", "Confirmada", "Proxima", "Tardada", "Ocupada", "Limpieza Intermedia", "Expirando", "Extendida", "Finalizada"],
      default: "Pendiente"
    },
    finalizadaReserva: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Método para verificar y actualizar el estado de la reserva según el tiempo	
reservationSchema.methods.actualizarEstadoReserva = async function() {
  const currentDate = new Date();

  // Calcular el tiempo restante para la fecha de inicio y la fecha final
  const tiempoInicio = this.fechaInicioReserva - currentDate;
  const tiempoFinal = this.fechaFinReserva - currentDate;

  // Estado "Proxima" si el tiempo restante es menor o igual a 60 minutos
  if (tiempoInicio <= 60 * 60 * 1000 && tiempoInicio >= 0 && this.estadoReserva === "Confirmada") {
    this.estadoReserva = "Proxima";
    await this.save();
  }

  // Estado "Expirando" si el tiempo restante es menor o igual a 30 minutos
  if (tiempoFinal <= 30 * 60 * 1000 && tiempoFinal >= 0 && this.estadoReserva === "Ocupada") {
    this.estadoReserva = "Expirando";
    await this.save();
  }

  // Estado "Extendido" si se pasó el tiempo de la fecha final
  if (tiempoFinal < 0 && this.estadoReserva === "Expirando") {
    this.estadoReserva = "Extendido";
    await this.save();
  }

  // Estado "Tardada" si el tiempo se pasó a la fecha inicial y el cliente no ha llegado
  if (tiempoInicio <= 0 && tiempoFinal > 0 && this.estadoReserva === "Confirmada") {
    this.estadoReserva = "Tardada";
    await this.save();
  }
}

module.exports = reservationSchema;