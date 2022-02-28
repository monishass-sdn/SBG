const mongoose = require("mongoose")
var schema = mongoose.Schema;

var userschema = new schema({
    Email:
    {
        type: String,
        unique: true
    },
    UserType: String,
    Password:
    {
        type: String
    
    },
    Phone:{

        type: Number

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

    resetPasswordToken:
    {
        type: String,

    },
    resetPasswordExpires: Date,
    created: { type: Date, default: Date.now },
    Username:String,
    Permissions:Object
});
module.exports = mongoose.model('Tb_Login', userschema);