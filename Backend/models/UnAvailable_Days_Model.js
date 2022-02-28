const mongoose = require("mongoose")
var schema = mongoose.Schema;

var UnavailableDays_Schema = new schema({

    Boat_Id:
    {type: schema.ObjectId,
        required: true,
        ref: 'Tb_BoatMaster'
       
    },
    Boat_Name:                           
    {
        type: String,
        required:true
    },

    UnAvailableDates:
    {
         type:Date,
        required:true,
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
module.exports = mongoose.model('Tb_SchemaUnavailableDays', UnavailableDays_Schema );