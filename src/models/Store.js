const {Schema} = require("mongoose");

const storeSchema = new Schema(
  {
    almacenUsuario: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    almacenProducto: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    almacenStockUbicacion: {
      type: Schema.Types.ObjectId,
      ref: "StockLocation",
      required: true
    },
    almacenStock: {
      type: Number,
      required: true
    },
    eliminadoProductoAlmacen: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = storeSchema;