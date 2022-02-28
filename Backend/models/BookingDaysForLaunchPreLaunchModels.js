const mongoose = require("mongoose")
var schema = mongoose.Schema;

var LaunchPrelaunchschema = new schema({
    Boat_Id:
    {
        type: schema.ObjectId,required: true,ref: 'Tb_BoatMaster'
    },
    Boat_Name:
    {
        type: String,
        required: true,
        
    },
 
    Booking_Days:
    { 
        type: Number
    },
   No_Of_WeekDays:
    { 
        type: Number
    },
    No_Of_WeekEndDays:
    { 
        type: Number
    },
    IsActive:
    {
        type: Boolean,
        required:true,
    },  
    Current_Time:
    {
        type: Date,
        default:new Date()
    },
    Updated_Time:
    {
        type: Date,
        default:new Date()
    }

});
module.exports = mongoose.model('Tb_BookingDaysForLaunchPreLaunch',LaunchPrelaunchschema );