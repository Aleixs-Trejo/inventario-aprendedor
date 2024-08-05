const {Schema} = require("mongoose");

const recordSchema = new Schema(
  {
    nombreRegistro: {
      type: String,
      required: true
    },
    descripcionRegistro: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = recordSchema;