const mongoose = require("mongoose")
var schema = mongoose.Schema;
var nextbookingschema = new schema({


    Boat_Id:
    {
     type: schema.ObjectId,
     required: true,
     ref: 'Tb_BoatMaster'
 },
 Boat_Name:
 {
  type: String,
  required:true
 },


   Next_BookingDay:
   {
   type:Number,
   required:true,
   default:null
   },
   Status:
    {
     type: String,
     default: null
    },
    Block:
    {
        type: Boolean,
        required:true,
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
    Updated_time:
    {
        type: Date,
        default:new Date()
    }

});
module.exports = mongoose.model('Tb_NextBooking', nextbookingschema);