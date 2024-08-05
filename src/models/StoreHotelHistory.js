const { Schema } = require("mongoose");

const StoreHotelHistorySchema = new Schema(
  {
    tipoHistorial: {
      type: String,
      required: true
    },
    almacenHotelHistorial: {
      type: Schema.Types.ObjectId,
      ref: "StoreHotel",
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = StoreHotelHistorySchema;