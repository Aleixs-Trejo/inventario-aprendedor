const {Schema} = require("mongoose");

const CompanySchema = new Schema(
  {
    rucCompany: {
      type: String,
      required: true
    },
    nombreCompany: {
      type: String,
      required: true
    },
    celularCompany: {
      type: String,
      required: true
    },
    correoCompany: {
      type: String,
      required: true
    },
    direccionCompany: {
      type: String,
      required: true
    },
    imagenCompany: {
      type: String,
      required: true
    },
    eliminadoCompany: {
      type: Boolean,
      default: false
    },
    maxProveedoresCompany: {
      type: Number,
      default: 5
    },
    maxCategoriasCompany: {
      type: Number,
      default: 5
    },
    maxProductosCompany: {
      type: Number,
      default: 25
    },
    maxStoresCompany: {
      type: Number,
      default: 1
    },
    maxTrabajadoresCompany: {
      type: Number,
      default: 5
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = CompanySchema;