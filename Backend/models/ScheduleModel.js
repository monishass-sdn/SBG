const mongoose = require("mongoose")
var schema = mongoose.Schema;
//const moment = require('moment-timezone');
//const dateAustraila = moment.tz(Date.now(), "Australia/Sydney");

var scheduleschema = new schema({
Boat_Id:
   {
    type: schema.ObjectId,
    required: true,
    ref: 'Tb_BoatMaster'
 },

 Boat_Name:
 {
  type: String,
  default:null
 },
    calendarId:
    {
     type: String,
     default:null
    },
    title:
   {
   type:String,
   default:null
   },
   body:
   {
   type:String,
   required:true,
   default:null
   },

   start:
    {
    type:Date,
    required:true,
    default:null
    },
    end:
    {
     type: Date,
     required:true,
     default: null
    },

    start_NoTime:
    {
    type:Date,
    required:true,
    default:null
    },
    end_NoTime:
    {
     type: Date,
     required:true,
     default: null
    },
    goingDuration:
    {
     type: Number,
     default: 0
    },
    
    comingDuration:
    {
        type: Number,
        default: 0
    },
    
    isAllDay:
    {
        type: Boolean
     
    },
    
    category:
    {
     type: String,
     default: null
    },
    
    dueDateClass:
    {
     type: String,
     default: null
    },
    
    location:
    {
     type: String,
     default: null
    },
    
    attendees:
    {
        type : Array , 
        default : []
    },
    recurrenceRule:
    {
        type: String,
        default: null
    },
    
    isPending:
    {
        type: Boolean
       
    },
    
    isFocused:
    {
        type: Boolean
        
    },
    
    isVisible:
    {
        type: Boolean
      
    },
    isReadOnly:
    {
        type: Boolean,
       
    },
    isPrivate:
    {
        type: Boolean,
       
    },
    color:
    {
        type: String,
        default: null
    },
    bgColor:
    {
        type: String,
        default: null
    },
    bgColor:
    {
        type: String,
        default: null
    },
    dragBgColor:
    {
        type: String,
        default: null
    },
    borderColor:
    {
        type: String,
        default: null
    },
    customStyle:
    {
        type: String,
        default: null
    },
    raw:
    {
        type: String,
        default: null
    },
    User_RoleType:
    {
        type: String,
        default: null
    },

    User_Id:
    
        {type: schema.ObjectId,ref: 'tb_addowners'},
    
    Admin_Id:
    
        {type: schema.ObjectId,ref: 'tb_logins'},

    Is_StandByBooking://6/11/2021 jibin
        {
            type: Boolean
           
        },   
    
    IsActive:
    {
        type: Boolean
       
    },
    Status:
    {
     type: String,
     default: null
    },
    Current_Time:
    {
        type: Date,
       
    },
    Updated_time:
    {
        type: Date,
        
    },

    Check_Status:
    {
        type: String,
        default: null
    },


    Check_Month:
    {
        type: String,
        default: null
    },
    Booking_ID:
    {
        type: Number,
        default: null
    },
    commends:
    {
        type: String,
        default: null
    },

    LOA:
    {
        type: Number,
        default: 0
    },

    Approved_LOA:
    {
        type: Number,
        default: 0
    },

    BookingStatus:
    {
        type: String,
        default: null
    },
    Cancelled_Status:
    {
        type: Number,
        default: 0
    },

    Total_DaysBooked:
    {
        type: Number,
        default: 0
    },
    WeekDay_Count:
    {
        type: Number,
        default: 0
    },
    WeekEnd_Count:
    {
        type: Number,
        default: 0
    },

    Total_DaysBooked_Reassign:
    {
        type: Number,
        default: 0
    },
    WeekDay_Count_Reassign:
    {
        type: Number,
        default: 0
    },
    WeekEnd_Count_Reassign:
    {
        type: Number,
        default: 0
    },
    Booking_Type:{
        type:String,
        default:''
    },
    WeekDay_Count_Edit:
    {
        type: Number,
        default: 0
    },
    WeekEnd_Count_Edit:
    {
        type: Number,
        default: 0
    },
    Total_Edit_Loa:
    {
        type: Number,
        default: 0
    },
    PartialCancellation_Status:
    {
        type: Number,
        default: 0
    },
    start_CancelledDate:
    {
    type:Date,
    default:null
    },
    end_CancelledDate:
    {
     type: Date,
     default: null
    },

    cancaledDays:Array,
    isBookingPending:{
        type:Boolean,
        default:false
    },
    isBookingCancelled:{
        type:Boolean,
        default:false
    },
    delStatus:{
        type:Number,
        default:0
    },
    isBookingAccepted:{
        type:Boolean,
        default:false
    },
    isNextDayBookingIncluded:{
        type:Boolean,
        default:false
    },
    isStandByBookingIncluded:{
        type:Boolean,
        default:false
    },
    standByBookingId:{
        type:mongoose.Schema.ObjectId,
        ref:'tb_addstandbybookings'
    }


});
module.exports = mongoose.model('Tb_Schedule', scheduleschema);