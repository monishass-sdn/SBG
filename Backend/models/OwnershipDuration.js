const mongoose = require("mongoose");
var schema = mongoose.Schema;

var AddNewOwner = new schema({
  Owner_Id: {
    type: schema.ObjectId,
    required: true,
    ref: "Tb_AddOwner",
  },

  Owner_Name: {
    type: String,
    required: true,
  },
  
  Boat_Id: {
    type: schema.ObjectId,
    required: true,
    ref: "Tb_BoatMaster",
  },
  Boat_Name: {
    type: String,
    default: null,
  },
  Boat_Type: {
    type: String,
    required: true,
  },
  Owners_Allowed: {
    type: Number,
    default: null,
  },

  From_Date: {
    type: Date,
  },

  To_Date: {
    type: Date,
  },
  Block: {
    type: Boolean,
    required: true,
  },
  IsActive: {
    type: Boolean,
    required: true,
  },

  Duration_SDate: {
    type: String,
  },

  Duration_EDate: {
    type: String,
  },

  Current_Time: {
    type: Date,
    default: null,
  },
  Update_Time: {
    type: Date,
    default: null,
  },
  lastResetedAnniversary:Number,
});
const model = mongoose.model("Tb_OwnershipDuration", AddNewOwner);
module.exports = model;
