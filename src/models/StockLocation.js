const {Schema} = require("mongoose");

const stockLocationSchema = new Schema(
  {
    nombreStockUbicacion: {
      type: String,
      required: true
    },
    descripcionStockUbicacion: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = stockLocationSchema;
