const {Schema} = require("mongoose");

const floorHistorySchema = new Schema(
  {
    tipoHistorial: {
      type: String,
      required: true
    },
    pisoHabitacionHistorial: {
      type: Schema.Types.ObjectId,
      ref: 'FloorRoom',
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = floorHistorySchema;