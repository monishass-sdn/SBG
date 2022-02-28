const mongoose = require("mongoose")
var schema = mongoose.Schema;
var addbookingchema = new schema({
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
Summer_WeekDays:
{
type:Number,
default:0
},

Summer_WeekEndDays:
{
type:Number,
default:0
},

Winter_WeekDays:
{
type:Number,
default:0
},

Winter_WeekEndDays:
{
type:Number,
default:0
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

previousYearsPendingDaysData:{
    type:Array,
    default:[]
},

expiredyear:{

    type:Number,
    default:0

},
dispStatus:{
    type:Number,
    default:1

},

         
        });

const model=mongoose.model('Tb_OwnerBookingDays', addbookingchema);
module.exports = model;