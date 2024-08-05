const {model} = require("mongoose");
const maintenanceRoomHoteSchema = require("./MaintenanceRoom");

const MaintenanceRoomHotelModel = model("MaintenanceRoomHotel", maintenanceRoomHoteSchema);

module.exports = MaintenanceRoomHotelModel;