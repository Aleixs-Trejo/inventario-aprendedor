const {Schema} = require("mongoose");

const statusRoomSchema = new Schema(
  {
    usuarioRegistroEstadoHabitacion: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    nombreEstadoHabitacion: {
      type: String,
      required: true,
    },
    descripcionEstadoHabitacion: {
      type: String,
      required: true,
    },
    trabajosEnHabitacion: {
      type: String,
      enum: ["no", "yes"],
      default: "no",
    },
    eliminadoEstadoHabitacion: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = statusRoomSchema;