const {Schema} = require('mongoose');

const roomHistorySchema = new Schema(
  {
    tipoHistorial: {
      type: String,
      required: true,
    },
    habitacionHistorial: {
      type: Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = roomHistorySchema;