const {Schema} = require("mongoose");

const balanceHotelHistorySchema = new Schema(
  {
    tipoHistorial: {
      type: String,
      required: true
    },
    balanceHotelHistorial: {
      type: Schema.Types.ObjectId,
      ref: "BalanceHotel",
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = balanceHotelHistorySchema;