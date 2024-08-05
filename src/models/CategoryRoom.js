const {Schema} = require("mongoose");

const categoryRoomSchema = new Schema(
  {
    usuarioRegistroCategoriaHabitacion: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    nombreCategoriaHabitacion: {
      type: String,
      required: true
    },
    descripcionCategoriaHabitacion: {
      type: String,
      required: true
    },
    eliminadoCategoriaHabitacion: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = categoryRoomSchema;