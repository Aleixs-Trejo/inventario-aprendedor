const {Schema} = require("mongoose");

const categoryHistorySchema = new Schema(
  {
    tipoHistorial: {
      type: String,
      required: true
    },
    usuarioHistorial: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    categoriaHistorial: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },
    nombreCategoriaHistorial: {
      type: String,
      required: true
    },
    descripcionCategoriaHistorial: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

module.exports = categoryHistorySchema;