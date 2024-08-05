const {Schema} = require("mongoose");

const cleaningHistorySchema = new Schema(
  {
    tipoHistorial: {
      type: String,
      required: true
    },
    limpiezaHistorial: {
      type: Schema.Types.ObjectId,
      ref: "Cleaning",
      required: false
    },
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = cleaningHistorySchema;