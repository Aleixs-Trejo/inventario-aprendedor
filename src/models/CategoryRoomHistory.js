const {Schema} = require('mongoose');

const categoryRoomHistorySchema = new Schema(
  {
    tipoHistorial: {
      type: String,
      required: true,
    },
    categoriaHabitacionHistorial: {
      type: Schema.Types.ObjectId,
      ref: 'CategoryRoom',
      required: true,
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = categoryRoomHistorySchema;