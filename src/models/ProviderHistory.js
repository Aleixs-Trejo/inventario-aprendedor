const {Schema} = require("mongoose");

const providerHistorySchema = new Schema(
  {
    tipoHistorial: {
      type: String,
      required: true
    },
    proveedorHistorial: {
      type: Schema.Types.ObjectId,
      ref: "Provider",
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = providerHistorySchema;