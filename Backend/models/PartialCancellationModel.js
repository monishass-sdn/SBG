const mongoose = require("mongoose")
var schema = mongoose.Schema;

var Partialschema = new schema({
    No_PartialCancellation:
    {
        type: Number,
        default: null
    },
     
    IsActive:
    {
        type: Boolean,
        default: null
    }
    
    

});
module.exports = mongoose.model('tb_PartialCancellation', Partialschema);