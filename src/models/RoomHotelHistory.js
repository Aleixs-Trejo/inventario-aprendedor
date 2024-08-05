const {Schema} = require('mongoose');

const roomHotelHistorySchema = new Schema(
  {
    tipoHistorial: {
      type: String,
      required: true,
    },
    habitacionHotelHistorial: {
      type: Schema.Types.ObjectId,
      ref: 'RoomHotel',
      required: true,
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = roomHotelHistorySchema;