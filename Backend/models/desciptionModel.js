const mongoose = require("mongoose")
var schema = mongoose.Schema;

var Description_Schema = new schema({

    Boat_Id:
    {type: schema.ObjectId,
        required: true,
        ref: 'Tb_BoatMaster'
        
    },
    
    Boattype_Name:
   {
       type: String,
       default:null
   },
   Boat_Description:
   {
       type: String,
       default:null
   },
   
    
    IsActive:
    {
        type: Boolean,
        default: null
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
module.exports = mongoose.model('Tb_Description_Schema', Description_Schema );