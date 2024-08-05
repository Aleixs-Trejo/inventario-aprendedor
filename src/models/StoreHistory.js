const {Schema} = require("mongoose");

const storeHistorySchema = new Schema(
  {
    tipoHistorial: {
      type: String,
      required: true
    },
    almacenHistorial: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = storeHistorySchema;