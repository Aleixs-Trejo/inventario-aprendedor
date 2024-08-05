const {model} = require('mongoose');
const categoryHistory = require('./CategoryHistory');

const CategoryHistory = model('CategoryHistory', categoryHistory);
module.exports = CategoryHistory;