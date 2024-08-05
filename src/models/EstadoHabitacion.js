const {Schema} = require("mongoose");

const roomStateSchema = new Schema(
  {
    nombreEstadoHabitacion: {
      type: String,
      required: true
    },
    descripcionEstadoHabitacion: {
      type: String,
      required: true
    },
    eliminadoEstadoHabitacion: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = roomStateSchema;