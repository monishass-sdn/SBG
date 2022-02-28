const mongoose = require("mongoose")
var schema = mongoose.Schema;
var shareschema = new schema({

    Boat_Id://jibin 5/22/2021
    {
     type: schema.ObjectId,
     required: true,
     ref: 'Tb_BoatMaster'
 },

 Boat_Name://jibin 6/1/2021
 {
     type: String,
     required: true,
     
 },

    No_of_Shares:
    {
    type:Number,
    required:true,
    default:null
    },
   No_of_SummerWeekDays:
   {
   type:Number,
   required:true,
   default:null
   },
   No_of_SummerWeekEndDays:
    {
    type:Number,
    required:true,
    default:null
    },
    No_of_WinterWeekDays:
    {
    type:Number,
    required:true,
    default:null
    },
    No_of_WinterWeekEndDays:
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
module.exports = mongoose.model('Tb_AddNewShares', shareschema);