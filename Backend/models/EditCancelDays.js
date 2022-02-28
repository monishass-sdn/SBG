const mongoose = require("mongoose");
const moment  = require('moment');
var schema = mongoose.Schema;
var EditCancelDaysschema = new schema({
Scheduleid:{

    type: schema.ObjectId,
    required: true,
    ref: 'Tb_Schedules'

},   
Boat_Id:
   {
    type: schema.ObjectId,
    required: true,
    ref: 'Tb_BoatMaster'
 },
 Owner_Id:{

    type: schema.ObjectId,
    required: true,
    ref: 'Tb_AddOwner'

 },
 
 cancaledDays:Array,
 User_RoleType:{type:String},
 CreatedAt: { type: Date, default:moment(Date.now()) },
 cancelexpiretime:{type: Date},
 cancelexpiretimeStr:{type: Number,default:0}

 
});
module.exports = mongoose.model('edit_canceldays', EditCancelDaysschema);