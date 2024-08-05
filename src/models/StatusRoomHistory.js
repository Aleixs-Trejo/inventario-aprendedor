const {Schema} = require("mongoose");

const statusRoomHistorySchema = new Schema(
  {
    tipoHistorial: {
      type: String,
      required: true,
    },
    estadoHabitacionHistorial: {
      type: Schema.Types.ObjectId,
      ref: "StatusRoom",
      required: true,
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = statusRoomHistorySchema;