const {model} = require("mongoose");
const maintenanceRoomHoteSchema = require("./MaintenanceRoomHotel");

const MaintenanceRoomHotelModel = model("MaintenanceRoomHotel", maintenanceRoomHoteSchema);

module.exports = MaintenanceRoomHotelModel;