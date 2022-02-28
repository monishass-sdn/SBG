
const mongoose = require("mongoose")
var schema = mongoose.Schema;
var AddSpecialDays = new schema({
    Name:
    {
        type: String,
        required:true
       
    },
    Start_Date:
    {
        type: Date,
        required:true
       
    },
    End_Date:
    {
        type: Date,
        required:true
       
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
    default: null
}

});
const model=mongoose.model('Tb_AddSpecialDays', AddSpecialDays);
module.exports = model;
