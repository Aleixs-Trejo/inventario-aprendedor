const {Schema} = require("mongoose");

const roomSchema = new Schema(
  {
    usuarioRegistroHabitacion: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    pisoHabitacion: {
      type: Schema.Types.ObjectId,
      ref: "FloorRoom",
      required: true
    },
    numeroHabitacion: {
      type: Number,
      required: true
    },
    descripcionHabitacion: {
      type: String,
      required: true
    },
    categoriaHabitacion: {
      type: Schema.Types.ObjectId,
      ref: "CategoryRoom",
      required: true
    },
    precioHabitacion: {
      type: Number,
      required: true
    },
    cantidadUsosHabitacion: {
      type: Number,
      default: 0
    },
    estadoHabitacion: {
      type: String,
      required: true
    },
    eliminadoHabitacion: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = roomSchema;