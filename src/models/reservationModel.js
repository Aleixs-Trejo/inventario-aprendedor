const {model} = require('mongoose');
const ReservationSchema = require('./Reservation');

const reservationModel = model('Reservation', ReservationSchema);

module.exports = reservationModel;