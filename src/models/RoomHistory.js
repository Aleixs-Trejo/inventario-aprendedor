const {Schema} = require('mongoose');

const roomHistorySchema = new Schema(
  {
    tipoHistorial: {
      type: String,
      required: true,
    },
    usuarioHistorial: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    habitacionHistorial: {
      type: Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    pisoHabitacionHistorial: {
      type: Schema.Types.ObjectId,
      ref: 'FloorRoom',
      required: true,
    },
    numeroHabitacionHistorial: {
      type: String,
      required: true,
    },
    descripcionHabitacionHistorial: {
      type: String,
      required: true,
    },
    categoriaHabitacionHistorial: {
      type: Schema.Types.ObjectId,
      ref: 'CategoryRoom',
      required: true,
    },
    precioHabitacionHistorial: {
      type: Number,
      required: true,
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = roomHistorySchema;