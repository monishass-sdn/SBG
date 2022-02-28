const mongoose = require("mongoose")
var schema = mongoose.Schema;

var OwnershipTransfer = new schema({

    from_ownerid:
    {
        type: String,
        required:true,
        ref: 'Tb_AddOwner'
       
    },
 
    to_ownerid:
    {
        type: String,
        required:true,
        ref: 'Tb_AddOwner'
       
    },
    from_owner:
   {
       type: String,
       required:true
      
   },

   to_owner:
   {
       type: String,
       required:true
      
   },

   boat_Name:
   {
    type: String,
    required:true
   },

   boat_type:
   {
    type: String,
    required:true
   },

   boat_Id:
   {
    type: String,
    required: true,
    ref: 'Tb_BoatMaster'
 },
 start_date:{
    type: Date,
    default:"",

 },

 end_date:{
    type: Date,
    default:"",

 },

 expire_current_owner:{

    type: Date,
    default:"",


 },
 Summer_WeekDays:{
    type: String,
    default:"",

 },
 Summer_WeekEndDays:{

    type: String,
    default:"",

 },

 Winter_WeekDays:{

    type: String,
    default:"",

 },

 Winter_WeekEndDays:{

    type: String,
    default:"",

 },

   trasnfered_at:
   {
       type: Date,
       default:Date.now()
   },
   

 });
const model=mongoose.model('Tb_Ownershiptransfer', OwnershipTransfer);
module.exports = model;
