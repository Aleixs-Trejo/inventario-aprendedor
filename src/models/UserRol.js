const { Schema } = require("mongoose");

const userRolSchema = new Schema(
  {
    nombreRol: {
      type: String,
      required: true
    },
    descripcionRol: {
      type: String,
      required: true
    },
    permisosRol: {
      type: [String],
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = userRolSchema;