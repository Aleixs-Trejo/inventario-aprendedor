const capacity = {};

const Company = require("../models/companyModel");
const Employee = require("../models/employeeModel");
const Provider = require("../models/providerModel");
const Category = require("../models/categoryModel");
const Product = require("../models/productModel");
const StockLocation = require("../models/stockLocationModel");

const getPlanLimits = require("../config/planLimits");

// Validar la capacidad de company
capacity.maxCompanies = async (req, res, next) => {
  try {
    const companies = await Company.find({eliminadoCompany: false}).lean();
    const currentCompanies = companies.length;

    if (currentCompanies >= parseInt(process.env.MAX_COMPANIES)) {
      req.flash("wrong",`Ya tienes ${process.env.MAX_COMPANIES} companies registradas.`);
      console.log(`Ya tienes ${process.env.MAX_COMPANIES} companies registradas.`);
      return res.redirect("/");
    }

    next();
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al validar la capacidad de company, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Validar que la capacidad de registro de empleados no supere a process.env.MAX_EMPLOYEES
capacity.maxEmployees = async (req, res, next) => {
  try {
    const company = req.company;
    const employees = await Employee.find({eliminadoTrabajador: false}).lean();
    const currentEmployees = employees.length;

    if (currentEmployees >= company.maxTrabajadoresCompany) {
      req.flash("wrong", `Ya tienes ${company.maxTrabajadoresCompany} empleados registrados.`);
      console.log(`Ya tienes ${company.maxTrabajadoresCompany} empleados registrados.`);
      return res.redirect("/");
    }

    next();
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al validar la capacidad de registro de empleados, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Validar proveedores
capacity.maxProviders = async (req, res, next) => {
  try {
    const company = req.company;
    const providers = await Provider.find({eliminadoProvider: false}).lean();
    const currentProviders = providers.length;

    if (currentProviders >= company.maxProveedoresCompany) {
      req.flash("wrong", `Ya tienes ${company.maxProveedoresCompany} proveedores registrados.`);
      console.log(`Ya tienes ${company.maxProveedoresCompany} proveedores registrados.`);
      return res.redirect("/");
    }

    next();
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al validar la capacidad de proveedores, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Validar categorías
capacity.maxCategories = async (req, res, next) => {
  try {
    const company = req.company;
    const categories = await Category.find({eliminadoCategoria: false}).lean();
    const currentCategories = categories.length;

    if (currentCategories >= company.maxCategoriasCompany) {
      req.flash("wrong", `Ya tienes ${company.maxCategoriasCompany} categorías registradas.`);
      console.log(`Ya tienes ${company.maxCategoriasCompany} categorías registradas.`);
      return res.redirect("/");
    }

    next();
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al validar la capacidad de categorías, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Validar productos
capacity.maxProducts = async (req, res, next) => {
  try {
    const company = req.company;
    const products = await Product.find({eliminadoProducto: false}).lean();
    const currentProducts = products.length;

    if (currentProducts >= company.maxProductosCompany) {
      req.flash("wrong", `Ya tienes ${company.maxProductosCompany} productos registrados.`);
      console.log(`Ya tienes ${company.maxProductosCompany} productos registrados.`);
      return res.redirect("/");
    }

    next();
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al validar la capacidad de productos, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Validar sucursales
capacity.maxStockLocations = async (req, res, next) => {
  try{
    const company = req.company;
    const stockLocations = await StockLocation.find().lean();
    const currentStockLocations = stockLocations.length;

    const limits = getPlanLimits(company.planCompany);

    const companyMaxStores = limits.maxStoresCompany;

    console.log("Company desde capacity: ", company);
    console.log("limits: ", limits);
    console.log("companyMaxStores: ", companyMaxStores);
    console.log("currentStockLocations: ", currentStockLocations);
    console.log("currentStockLocations >= companyMaxStores: ", currentStockLocations >= companyMaxStores);

    if (currentStockLocations >= companyMaxStores) {
      req.flash("wrong", `Ya tienes ${company.maxStoresCompany} sucursales registradas.`);
      console.log(`Ya tienes ${company.maxStoresCompany} sucursales registradas.`);
      return res.redirect("/");
    }

    next();
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al validar la capacidad de sucursales, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

module.exports = capacity;