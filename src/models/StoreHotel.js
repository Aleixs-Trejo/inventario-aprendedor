const { Schema } = require("mongoose");

const StoreHotelSchema = new Schema(
  {
    usuarioRegistroAlmacenHotel: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    productoAlmacenHotel: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    stockProductoAlmacenHotel: {
      type: Number,
      required: true
    },
    minStockProductoAlmacenHotel: {
      type: Number,
      required: true
    },
    eliminadoProductoAlmacenHotel: {
      type: Boolean,
      default: false
    },
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = StoreHotelSchema;