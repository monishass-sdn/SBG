const mongoose = require("mongoose")
var schema = mongoose.Schema;
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
    
        {type: schema.ObjectId,required: true,ref: 'tb_addowners'},
    
    Admin_Id:
    
        {type: schema.ObjectId,required: true,ref: 'tb_logins'},

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
        default:new Date()
    },
    Updated_time:
    {
        type: Date,
        default:new Date()
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

    TotalDay_Count:
    {
        type: Number,
        default: null
    },
    WeekDay_Count:
    {
        type: Number,
        default: null
    },

    WeekEnd_Count:
    {
        type: Number,
        default: null
    },

    BookingStatus:
    {
        type: String,
        default: null
    },
    specialDayCheck:
    {
        type: String,
        default: null
        
    },
    specialDayId:
    {
        type: String,
       default: null
        
    },
    isAStandByBooking:{
        type:Boolean,
        default:true
    },
    showThisBookingInCalendar:{
        type:Boolean,
        default:true
    },
    isOrginalBookingCanceled:{
        type:Boolean,
        dafault:false
    }


   
});
module.exports = mongoose.model('Tb_AddStandByBooking', scheduleschema);