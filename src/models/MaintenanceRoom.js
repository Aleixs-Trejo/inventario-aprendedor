const {Schema} = require("mongoose");

const maintenanceRoomHoteSchema = new Schema(
  {
    usuarioRegistroMantenimiento: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    habitacionMantenimiento: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    tipoMantenimiento: {
      type: String,
      enum: ["Limpieza", "Mantenimiento"],
      required: true,
    },
    descripcionMantenimiento: {
      type: String,
    },
    usuarioMantenimiento: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    finalizadoMantenimiento: {
      type: Boolean,
      default: false
    },
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = maintenanceRoomHoteSchema;