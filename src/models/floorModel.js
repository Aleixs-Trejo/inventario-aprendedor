const {model} = require('mongoose');

const pisoHabitacionModel = require('./Floor');
const PisoHabitacionSchema = model('FloorRoom', pisoHabitacionModel);

module.exports = PisoHabitacionSchema;