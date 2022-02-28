const mongoose = require("mongoose")
var schema = mongoose.Schema;

var Partialschema = new schema({
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

    No_Cancellation:
    {
        type: Number,
        default: null
    },
     
    IsActive:
    {
        type: Boolean,
        default: null
    },
    Cancellationyear:
    {
        type: Number,
        default: 0
    }
    

});
module.exports = mongoose.model('tb_totalCancellation', Partialschema);