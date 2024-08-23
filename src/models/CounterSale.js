const {Schema} = require("mongoose");

const counterSaleSchema = new Schema(
  {
    id: {
      type: String,
      required: true
    },
    prefix: {
      type: Number,
      default: 0
    },
    seq: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = counterSaleSchema;