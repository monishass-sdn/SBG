const mongoose = require("mongoose")
var schema = mongoose.Schema;

var AddNewOwner = new schema({
    First_Name:
   {
       type: String,
       required:true
      
   },
   Last_Name:
   {
       type: String,
       required:true
     
   },
        
   Home_Address:
   {
     type: String,
     default:null
    //  required:true
    
   },
   Email:
   {
       type: String,
       required:true,
       
   },
   Password:
    {
        type: String
          
    },
    DecryptPassword:
    {
        type: String
          
    },
  
  Profile_Image:
  {
   type: String,
   default:null
     

  },
  Profile_ImageOriginalName:
  {
   type: String,
   default:null
     

  },

   Mobile:
   {
      type:String,
      required:true
    
   },
   Family_Name:
    {
        type: String,
       
       
    
    },
    Parking_Ability:
    {
        type: String,
        required:true
       
    },
    Sailing_Ability:
    {
        type: String,
        required:true
       
    },
    Housekeeping:
    {
        type: String,
        required:true
       
    },
    Notes:
    {
        type: String,
        default: null
    },
    Emergency_Contact_Name:
    {
        type: String,
      
       
    },
    Emergency_Contact_Mobile:
    {
        type: String,
      
    },
    Status:
    {
        type: String,
        default: 1
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
   Updated_time:
   {
       type: Date,
       default: null
   },
   resetPasswordToken:
   {
       type: String,

   },
   resetPasswordExpires: Date,
   created: { type: Date, default: Date.now },

 });
const model=mongoose.model('Tb_AddOwner', AddNewOwner);
module.exports = model;

