               
const mongoose = require("mongoose")
var schema = mongoose.Schema;
var AddCancellation = new schema({
    Boat_Name:
    {
        type: String,
        required:true
       
    },
    Cancellation_Time_Limit:
    {
        type: Number,
        required:true
       
    },
   
    IsActive:
    {
        type: Boolean,
        required:true,
    },
    Current_Time:
    {
        type:Date,
        default:new Date()
    }

});
const model=mongoose.model('Tb_Cancellation', AddCancellation );
module.exports = model;
