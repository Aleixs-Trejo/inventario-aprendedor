const {Schema} = require("mongoose");

const userHistorySchema = new Schema (
  {
    tipoHistorial: {
      type: String,
      required: true
    },
    usuarioHistorial: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = userHistorySchema;