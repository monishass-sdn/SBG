const mongoose = require("mongoose")
var schema = mongoose.Schema;
var scheduleschema = new schema({
  Boat_Id:
  {
    type: schema.ObjectId,
    required: true,
    ref: 'Tb_BoatMaster'
  },
  Year: {
    type: Number,
    required: true,
  },
  Freecount: {
    type: Number,
    required: true,
  },


  Owner_Id:

    { type: schema.ObjectId, required: true, ref: 'tb_addowners' },



  Current_Time:
  {
    type: Date,
    default: new Date()
  },
  Updated_time:
  {
    type: Date,
    default: new Date()
  },


});
module.exports = mongoose.model('tb_freepartialcancels', scheduleschema);