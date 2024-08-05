const {Schema} = require('mongoose');

const floorSchema = new Schema (
  {
    usuarioRegistroPiso: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    numeroPiso: {
      type: Number,
      required: true
    },
    descripcionPiso: {
      type: String
    },
    eliminadoPiso: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = floorSchema;