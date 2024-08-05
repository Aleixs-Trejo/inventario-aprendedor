const {Schema} = require("mongoose");

const employeeHistorySchema = new Schema(
  {
    tipoHistorial: {
      type: String,
      required: true
    },
    trabajadorHistorial: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

module.exports = employeeHistorySchema;