const {Schema} = require("mongoose");

const categoryHistorySchema = new Schema(
  {
    tipoHistorial: {
      type: String,
      required: true
    },
    categoriaHistorial: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

module.exports = categoryHistorySchema;