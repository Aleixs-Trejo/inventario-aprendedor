const {Schema} = require("mongoose");

const roomHotelSchema = new Schema(
  {
    usuarioRegistroHabitacionHotel: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    habitacionHotel:{
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: true
    },
    precioHabitacionHotel: {
      type: Number,
      required: true
    },
    cantidadUsosHabitacionHotel: {
      type: Number,
      default: 0
    },
    estadoHabitacionHotel: {
      type: Schema.Types.ObjectId,
      ref: "StatusRoom",
      required: true
    },
    eliminadoHabitacionHotel: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = roomHotelSchema;