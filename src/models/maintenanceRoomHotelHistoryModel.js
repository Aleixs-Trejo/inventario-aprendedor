const {model} = require("mongoose");
const maintenanceRoomHoteHistorySchema = require("./MaintenanceRoomHotelHistory");

const MaintenanceRoomHotelHistoryModel = model("MaintenanceRoomHotelHistory", maintenanceRoomHoteHistorySchema);

module.exports = MaintenanceRoomHotelHistoryModel;