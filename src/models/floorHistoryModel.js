const {model} = require('mongoose');

const pisoHabitacionHistorialModel = require('./FloorHistory');
const PisoHabitacionHistorialSchema = model('FloorRoomHistory', pisoHabitacionHistorialModel);

module.exports = PisoHabitacionHistorialSchema;