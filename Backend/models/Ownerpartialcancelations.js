const mongoose = require("mongoose")
var schema = mongoose.Schema;
var ownerpartialcancelationschema = new schema({
Scheduleid:{

    type: schema.ObjectId,
    required: true,
    ref: 'Tb_Schedules'

},   
Boat_Id:
   {
    type: schema.ObjectId,
    required: true,
    ref: 'Tb_BoatMaster'
 },
 Owner_Id:{

    type: schema.ObjectId,
    required: true,
    ref: 'Tb_AddOwner'

 },
 Booking_ID:{
    type: Number,
 },
 Boat_Name:
 {
  type: String,
  default:null
 },
 cancaledDays:Array,
 LOA:
 {
     type: Number,
     default: 0
 },

 Approved_LOA:
 {
     type: Number,
     default: 0
 },
 WeekDay_Count:{

    type: Number,
     default: 0

 },
 WeekEnd_Count:{

    type: Number,
     default: 0

 },
 WeekDay_Count_Edit:{

    type: Number,
     default: 0

 },
 WeekEnd_Count_Edit:{

    type: Number,
     default: 0

 },

 Total_Edit_Loa:{
    type: Number,
     default: 0

 },
 PartialCancellation_Status:{
    type: Number
 },

 StartDate:
 {
     type: Date,
    
 },

 Enddate:
 {
     type: Date,
    
 },

 BookingStatus:
 {
     type: String,
     default: null
 },
 CreatedAt: { type: Date, default: Date.now },

 
});
module.exports = mongoose.model('owner_partialcancelations', ownerpartialcancelationschema);