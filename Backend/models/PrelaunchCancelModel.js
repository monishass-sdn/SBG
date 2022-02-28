const mongoose = require("mongoose")
var schema = mongoose.Schema;

var prelaunchcancel = new schema({

  Boat_Id:
   {
       type: String,
       required:true

     
   },
   Owner_Id:
   {
       type: String,
      
  
      
   },
   Start_Date:{

    type: Date,

   },
   End_Date:{
    type: Date,

   },
   StartdateStr:{

    type: Number,
    default:0

   },
   EnddateStr:{

    type: Number,
    default:0

   },
   Yearcancel:{

    type: Number,
    default:0

   },
   Monthcancel:{

    type: Number,
    default:0

   },
  
    created: { type: Date, default: Date.now },

});
module.exports = mongoose.model('tb_prelaunchcancels', prelaunchcancel);