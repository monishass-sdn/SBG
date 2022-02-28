const mongoose = require("mongoose")
var schema = mongoose.Schema;
var cleanchema = new schema({
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
Cleans:
{
    type: Number,
    default:null
},
User_RoleType:
{
    type: String,
    default: null
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
Updated_time:
{
    type: Date,
    default: null
},


         
        });

const model=mongoose.model('Tb_BoatCleans', cleanchema);
module.exports = model;