const mongoose = require("mongoose")
var schema = mongoose.Schema;
var newboatschema = new schema({

Owner_Id:
{type: schema.ObjectId,required: true,ref: 'tb_addowners'},


Boat_Id:
{
 type: schema.ObjectId,
 required: true,
 ref: 'Tb_BoatMaster'
},

Summer_WeekDays:
{
type:Number,
default:null
},

Summer_WeekEndDays:
{
type:Number,
default:null
},

Winter_WeekDays:
{
type:Number,
default:null
},

Winter_WeekEndDays:
{
type:Number,
default:null
},

Total_Days:
{
type:Number,
default:null
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
  

 });

 const model=mongoose.model('Tb_BookedDays', newboatschema);
 module.exports = model;