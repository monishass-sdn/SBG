const mongoose = require("mongoose")
var schema = mongoose.Schema;
var ownerbookingschema = new schema({
    Owner_Name:
   {
       type: String,
       required: true,
   },
   Boat_Name:
   {
       type: String,
       default:null
       
   },
   Owner_Id:
   {type: schema.ObjectId,required: true,ref: 'Tb_AddOwner'},
   Boat_Id:
   {type: schema.ObjectId,required: true,ref: 'Tb_BoatMaster'},

   Boattype_id:
   {type: schema.ObjectId,required: true,ref: 'Tb_BoatType'}
 ,
 From_Date:
 {
     type:Date,
     required:true,
     default:new Date()
 },
 To_Date:
 {
     type:Date,
     required:true,
     default:new Date()
 },
 Comments:
 {
     type:String,
     default:null
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
   Status:
   {
       type: String,
       required:true,
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

 const model=mongoose.model('Tb_OwnerBooking', ownerbookingschema);
 module.exports = model;
