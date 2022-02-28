const mongoose = require("mongoose")
var schema = mongoose.Schema;

var userschema = new schema({

  
  Boat_Name:
   {
       type: String,
       required:true
     
   },
   Boat_Id:
   {
       type: String,
       required:true

     
   },
   Owner_Name:
   {
       type: String,
       default:null
  
      
   },
    Season_Type:
    {
        type: String

    },

    Season_SDate:
    {
        type: Date,
        
    },

    Season_EDate:
    {
        type: Date,
        
    },
    Block:
    {
        type: Boolean,
        default:null
    },
    IsActive:
    {
        type: Boolean,
        default: null
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

    
    created: { type: Date, default: Date.now },

});
module.exports = mongoose.model('Tb_Season', userschema);