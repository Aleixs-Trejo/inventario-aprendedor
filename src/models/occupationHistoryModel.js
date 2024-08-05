const {model} = require('mongoose');
const OccupationHistorySchema = require('./OccupationHistory');

const OccupationHistory = model('OccupationHistory', OccupationHistorySchema);

module.exports = OccupationHistory;