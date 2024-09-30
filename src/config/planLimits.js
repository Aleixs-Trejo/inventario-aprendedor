const planLimits = {
  basico: { // 50 soles mensuales
    maxProveedoresCompany: 5,
    maxCategoriasCompany: 5,
    maxProductosCompany: 25,
    maxStoresCompany: 1,
    maxTrabajadoresCompany: 5
  },
  mediano: { // 65 soles mensual
    maxProveedoresCompany: 25,
    maxCategoriasCompany: 25,
    maxProductosCompany: 50,
    maxStoresCompany: 2,
    maxTrabajadoresCompany: 10
  },
  amplio: { // 80 soles mensual
    maxProveedoresCompany: 50,
    maxCategoriasCompany: 50,
    maxProductosCompany: 100,
    maxStoresCompany: 5,
    maxTrabajadoresCompany: 20
  },
  empresa: { // 100 soles mensual
    maxProveedoresCompany: 100,
    maxCategoriasCompany: 100,
    maxProductosCompany: 250,
    maxStoresCompany: 10,
    maxTrabajadoresCompany: 50
  }
};

// Método para obtener límites según el plan
const getPlanLimits = plan => {
  return planLimits[plan] || planLimits.basico;
}

module.exports = getPlanLimits;