const mongoose = require("mongoose")
var schema = mongoose.Schema;

var boattypeschema = new schema({

Boat_Type:
{
type: String,
required:true

},
Type_Description:
{
type: String,
default:null

},

Block:
{
type: Boolean,
required:true
},
IsActive:
{
type: Boolean,
required:true
},
Current_Time:
{
type: Date,
default:new Date()
},
Update_Time:
{
type: Date,
default:new Date()
}


});
const boat=mongoose.model('Tb_BoatType', boattypeschema);
module.exports = boat;