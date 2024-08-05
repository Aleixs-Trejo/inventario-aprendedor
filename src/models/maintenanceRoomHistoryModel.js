const {model} = require("mongoose");
const maintenanceRoomHistorySchema = require("./MaintenanceRoomHistory");

const MaintenanceRoomHistoryModel = model("MaintenanceRoomHistory", maintenanceRoomHistorySchema);

module.exports = MaintenanceRoomHistoryModel;