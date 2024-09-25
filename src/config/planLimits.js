const planLimits = {
  basico: {
    maxProveedoresCompany: 10,
    maxCategoriasCompany: 10,
    maxProductosCompany: 25,
    maxStoresCompany: 1,
    maxTrabajadoresCompany: 5
  },
  mediano: {
    maxProveedoresCompany: 25,
    maxCategoriasCompany: 25,
    maxProductosCompany: 50,
    maxStoresCompany: 2,
    maxTrabajadoresCompany: 10
  },
  amplio: {
    maxProveedoresCompany: 50,
    maxCategoriasCompany: 50,
    maxProductosCompany: 100,
    maxStoresCompany: 5,
    maxTrabajadoresCompany: 20
  }
};

// Método para obtener límites según el plan
const getPlanLimits = plan => {
  return planLimits[plan] || planLimits.basico;
}

module.exports = getPlanLimits;