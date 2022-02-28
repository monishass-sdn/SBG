const mongoose = require("mongoose")
var schema = mongoose.Schema;
var scheduleschema = new schema({
Boat_Id:
   {
    type: schema.ObjectId,
    required: true,
    ref: 'Tb_BoatMaster'
 },

 Boat_Name:
 {
  type: String,
  default:null
 },

   start:
    {
    type:Date,
    required:true,
    default:null
    },
//     end:
//     {
//      type: Date,
//      required:true,
//      default: null
//     },

    start_NoTime:
    {
    type:Date,
    required:true,
    default:null
    },
//     end_NoTime:
//     {
//      type: Date,
//      required:true,
//      default: null
//     },
     
   
    User_RoleType:
    {
        type: String,
        default: null
    },

    Owner_Id:
    
        {type: schema.ObjectId,required: true,ref: 'tb_addowners'},
    
    SpecialDay_Id:
    
        {type: schema.ObjectId,required: true,ref: 'tb_addspecialdays'}, 
        Scheduleid:
    
        {type: schema.ObjectId,required: true,ref: 'tb_schedules'},

     OwnerDurationStart:{
         type:Date,
         default:null
     },

     OwnerDurationEnd:{
          type:Date,
        default:null
    },


    IsActive:
    {
        type: Boolean
       
    },
    Status:
    {
     type: String,
     default: null
    },
    Current_Time:
    {
        type: Date,
        default:new Date()
    },
    Updated_time:
    {
        type: Date,
        default:new Date()
    },
  
    BookingStatus:
    {
        type: String,
        default: null
    },
});
module.exports = mongoose.model('Tb_SpecialDayBooking', scheduleschema);