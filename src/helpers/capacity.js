const capacity = {};

const Company = require("../models/companyModel");
const Employee = require("../models/employeeModel");
const Provider = require("../models/providerModel");
const Category = require("../models/categoryModel");
const Product = require("../models/productModel");
const StockLocation = require("../models/stockLocationModel");

// Validar que la capacidad de registro de empleados no supere a process.env.MAX_EMPLOYEES
capacity.maxEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find({eliminadoTrabajador: false}).lean();
    const currentEmployees = employees.length;
    if (currentEmployees === process.env.MAX_EMPLOYEES) {
      req.flash("wrong", "Ya tienes más de " + process.env.MAX_EMPLOYEES + " empleados registrados.");
      return res.redirect("/");
    }
    next();
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al validar la capacidad de registro de empleados, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Validar la capacidad de company
capacity.maxCompanies = async (req, res, next) => {
  try {
    const companies = await Company.find({eliminadoCompany: false}).lean();
    const currentCompanies = companies.length;
    if (currentCompanies === process.env.MAX_COMPANIES) {
      req.flash("wrong", "Ya tienes más de " + process.env.MAX_COMPANIES + " companias registradas.");
      return res.redirect("/");
    }
    next();
  } catch (error) {
    req.flash("wrong", "Ocurrió un error al validar la capacidad de company, intente nuevamente.");
    console.log("Error: ", error);
    res.status(500).send("Error interno, posiblemente haya escrito algo mal, así que perdón por ello 😿, puede reportar el error para corregirlo en la próxima actualización. Detalles del error " + error.message);
  }
};

// Validar proveedores
capacity.maxProviders = async (req, res, next) => {
  try {
    const providers = await Provider.find({eliminadoProvider: false}).lean();
    const currentProviders = providers.length;
    if (currentProviders === process.env.MAX_PROVIDERS) {
      req.flash("wrong", "Ya tienes más de " + process.env.MAX_PROVIDERS + " proveedores registrados.");
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
    const categories = await Category.find({eliminadoCategoria: false}).lean();
    const currentCategories = categories.length;
    if (currentCategories === process.env.MAX_CATEGORIES) {
      req.flash("wrong", "Ya tienes más de " + process.env.MAX_CATEGORIES + " categorías registradas.");
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
    const products = await Product.find({eliminadoProducto: false}).lean();
    const currentProducts = products.length;
    if (currentProducts === process.env.MAX_PRODUCTS) {
      req.flash("wrong", "Ya tienes más de " + process.env.MAX_PRODUCTS + " productos registrados.");
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
    const stockLocations = await StockLocation.find({eliminadoStockUbicacion: false}).lean();
    const currentStockLocations = stockLocations.length;
    if (currentStockLocations === process.env.MAX_STOCK_LOCATIONS) {
      req.flash("wrong", "Ya tienes más de " + process.env.MAX_STOCK_LOCATIONS + " sucursales registradas.");
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