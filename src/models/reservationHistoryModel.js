const {model} = require('mongoose');
const ReservationHistorySchema = require('./ReservationHistory');

const reservationHistoryModel = model('ReservationHistory', ReservationHistorySchema);

module.exports = reservationHistoryModel;