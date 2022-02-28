const mongoose = require("mongoose")
var schema = mongoose.Schema;

var boatlocationschema = new schema({
    Location_id:
    {
        type: Number
        // required: true,
        // unique: true
    },
    
    Boat_Location:
    {
        type: String,
        required: true,
    },
    Location_URL:
    {
        type: String,
        required: true,
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
    Updated_Time:
    {
        type: Date,
        default: null
    },
    

});
module.exports = mongoose.model('Tb_BoatLocation', boatlocationschema);