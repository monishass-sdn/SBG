const mongoose = require("mongoose")
var schema = mongoose.Schema;

var AddUnavailableDaysSchema = new schema({

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

    UnAvailableDates:
    [{
         type:String,
        required:true,
        default:null
    }],
    Block:
    {
        type: Boolean,
        default:true
    },
    IsActive:
    {
        type: Boolean,
        default: true
    },
    Current_Time:
    {
        type: Date,
        default:new Date()
    },
    Update_Time:
    {
        type: Date,
        default: new Date()
    },




});
module.exports = mongoose.model('Tb_UnAvailableDates', AddUnavailableDaysSchema);