const {Schema} = require('mongoose');

const balanceHotelSchema = new Schema(
  {
    usuarioRegistroBalance: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    checkOutsBalance: {
      type: Schema.Types.ObjectId,
      ref: "CheckOutHotelHistory"
    },
    totalCheckOuts: {
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

module.exports = balanceHotelSchema;