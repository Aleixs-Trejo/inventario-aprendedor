const {Schema} = require("mongoose");

const maintenanceRoomHoteSchema = new Schema(
  {
    usuarioRegistroMantenimiento: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    habitacionHotelMantenimiento: {
      type: Schema.Types.ObjectId,
      ref: "RoomHotel",
      required: true,
    },
    tipoMantenimiento: {
      type: Schema.Types.ObjectId,
      ref: "StatusRoom",
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