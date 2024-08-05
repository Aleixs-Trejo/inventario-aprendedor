const {Schema} = require('mongoose');

const balanceSchema = new Schema(
  {
    usuarioRegistroBalance: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    ventasBalance: {
      type: Schema.Types.ObjectId,
      ref: 'SalesHistory'
    },
    totalVentas: {
      type: Number,
      required: true
    },
    gananciasNetas: {
      type: Number,
      required: true
    },
    eliminadoBalance: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = balanceSchema;