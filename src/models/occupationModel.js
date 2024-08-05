const {model} = require('mongoose');
const occupationSchema = require('./Occupation');

const Occupation = model('Occupation', occupationSchema);

module.exports = Occupation;