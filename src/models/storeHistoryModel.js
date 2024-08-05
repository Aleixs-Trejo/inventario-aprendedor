const {model} = require('mongoose');
const storeHistorySchema = require('./StoreHistory');

const StoreHistory = model('StoreHistory', storeHistorySchema);
module.exports = StoreHistory;