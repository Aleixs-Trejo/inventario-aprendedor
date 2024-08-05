const {Schema} = require("mongoose");

const maintenanceRoomHoteHistorySchema = new Schema(
  {
    tipoHistorial: {
      type: String,
      required: true,
    },
    mantenimientoHabitacionHotelHistorial: {
      type: Schema.Types.ObjectId,
      ref: "MaintenanceRoomHotel",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = maintenanceRoomHoteHistorySchema;