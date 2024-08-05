const {Schema} = require('mongoose');

const productHistorySchema = new Schema(
  {
    tipoHistorial: {
      type: String,
      required: true
    },
    productoHistorial: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = productHistorySchema;