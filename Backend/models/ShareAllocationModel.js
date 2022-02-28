const mongoose = require("mongoose")
var schema = mongoose.Schema;

var AddNewOwner = new schema({
    Owner_Name:
   {
       type: String,
       required:true
      
   },
  Boat_name:
   {
       type: String,
       required:true
     
   },
        
  Boat_Type:
   {
     type: String,
     required:true
    
   },
  
   SharePercentage:
   {
    type: String,
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
       default:null
   },
   Update_Time:
   {
       type: Date,
       default: null
   }

 });
const model=mongoose.model('Tb_ShareAllocation', AddNewOwner);
module.exports = model;

