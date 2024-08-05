const {Schema} = require('mongoose');

const ReservationHistorySchema = new Schema(
  {
    tipoHistorial: {
      type: String,
      required: true,
    },
    reservacionHistorial: {
      type: Schema.Types.ObjectId,
      ref: 'Reservation',
      required: true,
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = ReservationHistorySchema;