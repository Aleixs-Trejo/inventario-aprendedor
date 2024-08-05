const {Schema} = require('mongoose');

const OccupationHistorySchema = new Schema(
  {
    tipoHistorial: {
      type: String,
      required: true
    },
    ocupacionHistorial: {
      type: Schema.Types.ObjectId,
      ref: 'Occupation',
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = OccupationHistorySchema;