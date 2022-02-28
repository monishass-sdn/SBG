const mongoose = require("mongoose")
var schema = mongoose.Schema;

var  AddUnavailableDaysAllSchema = new schema({
    
    UnAvailableDates:
    [{
         type:String,
        required:true,
        default:null
    }],
    Block:
    {
        type: Boolean,
        default:null
    },
    IsActive:
    {
        type: Boolean,
        default: null
    },
    Current_Time:
    {
        type: Date,
        default:null
    },
    Update_Time:
    {
        type: Date,
        default: null
    },
   

});
module.exports = mongoose.model('Tb_UnAvailableDatesForAllBoats', AddUnavailableDaysAllSchema);