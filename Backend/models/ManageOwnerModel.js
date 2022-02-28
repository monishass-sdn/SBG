const mongoose = require("mongoose")
var schema = mongoose.Schema;

var AddMangeOwner = new schema({
    Owner_Name:
   {
       type: String,
       required:true
      
   },
//    Boat_Name:
//    {
//     type : Array, 
//     default : [],
//     required:true
//    },
   Boat_Name:
   {
    type: String,
    required:true
   },

   Boat_Id:
   {
    type: schema.ObjectId,
    required: true,
    ref: 'Tb_BoatMaster'
},

   Owner_Id:
   {
    type: schema.ObjectId,
    required: true,
    ref: 'Tb_AddOwner'
     
   }, 
  Boat_Type:
   {
     type: String,
     required:true
    
   },
   Owners_Allowed:
   {
       type: String,
       default:null
   },

   Home_Address:
   {
     type: String,
     default:null
    
   },
   Email:
   {
       type: String,
       default:null
       
   },

 
   //jibin 5/24
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
//jibin 5/24
   First_Name:
   {
       type: String,
       default:null
      
   },
   Last_Name:
   {
       type: String,
       default:null
     
   },
   Mobile:
   {
      type:String,
      default:null
    
   },
   Family_Name:
    {
        type: String,
        default:null
    
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

   Parking_Ability://jibin 5/21
   {
       type: String,
       default:null
      
   },
   Sailing_Ability://jibin 5/21
   {
       type: String,
       default:null
      
   },
   ShareAllocation:
   {
    type: String,
   },
   
   No_PartialCancellation:
   {
       type: Number,
       default: 0
   },
    
   Block:
   {
       type: Boolean,
       default:null
      
   },
   IsActive:
   {
       type: Boolean,
       default:null
      
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
   },
   

 });
const model=mongoose.model('Tb_ManageOwner', AddMangeOwner);
module.exports = model;
