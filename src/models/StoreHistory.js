const {Schema} = require("mongoose");

const storeHistorySchema = new Schema(
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
    almacenHistorial: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true
    },
    almacenProductoHistorial: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    almacenStockUbicacionHistorial: {
      type: Schema.Types.ObjectId,
      ref: "StockLocation",
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = storeHistorySchema;