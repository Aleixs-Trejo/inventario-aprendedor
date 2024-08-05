const {Schema} = require('mongoose');

const clientHistorySchema = new Schema(
  {
    tipoHistorial: {
      type: String,
      required: true
    },
    clienteHistorial: {
      type: Schema.Types.Mixed,
      ref: 'Client',
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = clientHistorySchema;