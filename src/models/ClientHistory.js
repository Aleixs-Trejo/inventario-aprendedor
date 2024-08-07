const {Schema} = require('mongoose');

const clientHistorySchema = new Schema(
  {
    tipoHistorial: {
      type: String,
      required: true
    },
    usuarioHistorial: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    clienteHistorial: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
      required: true
    },
    dniClienteHistorial: {
      type: String,
      required: true
    }, 
    nombreClienteHistorial: {
      type: String,
      required: true
    },
    celularClienteHistorial: {
      type: String
    },
    correoClienteHistorial: {
      type: String
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = clientHistorySchema;