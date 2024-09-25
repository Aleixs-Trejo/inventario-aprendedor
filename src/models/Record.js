const {Schema} = require('mongoose');

const RecordSchema = new Schema(
  {
    usuarioRegistroRegistro: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    tipoRegistro: {
      type: String,
      required: true
    },
    nombreProductoRegistro: {
      type: String,
      required: true
    },
    descripcionProductoRegistro: {
      type: String,
      required: true
    },
    cantidadProductoRegistro: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = RecordSchema;