const {Schema} = require("mongoose");
const getPlanLimits = require("../config/planLimits");

const CompanySchema = new Schema(
  {
    comercioCompany: {
      type: String,
      enum: ["minimarket", "hotel", "minimarkethotel"],
      required: true
    },
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
    planCompany: {
      type: String,
      enum: ["basico", "mediano", "amplio"], // Tipos de planes de servicio
      default: "basico"
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

// Actializar limites al cambiar el plan
CompanySchema.pre("save", function (next) {
  if (this.isModified("planCompany")) {
    const limits = getPlanLimits(this.planCompany);
    this.maxProveedoresCompany = limits.maxProveedoresCompany;
    this.maxCategoriasCompany = limits.maxCategoriasCompany;
    this.maxProductosCompany = limits.maxProductosCompany;
    this.maxStoresCompany = limits.maxStoresCompany;
    this.maxTrabajadoresCompany = limits.maxTrabajadoresCompany;
  }
  next();
});

module.exports = CompanySchema;