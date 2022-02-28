               
const mongoose = require("mongoose")
var schema = mongoose.Schema;
var Add_LOA = new schema({
    Boat_Id:
    { 
        type: schema.ObjectId,                   
        required: true,
        ref: 'Tb_BoatMaster'                
       
    },                      
    Booking_ID:
    {
        type: Number,
        required: true,
        
       
    },
   
    LOA:
    {
        type: Number,
        required: true,
      
       
    },
   
    IsActive:
    {
        type: Boolean,
        required:true,
    },
    Updated_time:
    {
        type:Date,
        default:new Date()
    }

});
const model=mongoose.model('Tb_LOA', Add_LOA );
module.exports = model;
