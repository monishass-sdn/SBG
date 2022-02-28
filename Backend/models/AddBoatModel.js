const mongoose = require("mongoose")
var schema = mongoose.Schema;
var newboatschema = new schema({
    Boat_Name:
   {
       type: String,
       required: true,
       
   },

  Boat_Number:
   {
    type: String,
    default:null
   },

  Owner_Name:
   {
       type: String,
       default:null
       
   },

   Owner_Id:
   {  type: String,
    default:null
    },
   Boat_Facility:
   {
       type: String,
       default: null,
   },
   Boat_Description:
   {
       type: String,
       default:null
   },
   Location_Name:
   {
       type: String,
       default:null
   },
   Boattype_Name:
   {
       type: String,
       default:null
   },
//to set foreign key in two tables//
    Location_Id:
        
         {type: schema.ObjectId,required: true,ref: 'Tb_BoatLocation'}
     ,
      
        
       Boattype_id:
           {type: schema.ObjectId, required: true,ref: 'Tb_BoatType'}
         ,
     
         

   Owners_Allowed:
   {
       type: Number,
       default:0
   },
   Launch_Date:
   {
       type:Date,
       required:true,
       default:new Date()
   },
   PreLaunch_Date:
   {
       type:Date,
       required:true,
       default:new Date()
   },
   Boat_Image:
   {
    type : Array , 
    default : []
   },
   //Added by chitra on 09.04.2021
   Boat_originalimage:
   {
    type : Array , 
    default : []
   },
   //Added by chitra on 09.04.2021
   Boat_originalhandBook:
   {
    type: String,
    default:null
      

   },
   Boat_HandBook:
   {
    type: String,
    default:null
      

   },

   Boat_original_Owner_Manual:{

    type: String,
    default:""

   },
   Boat_Owner_Manual:{

    type: String,
    default:""

   },

SummerSeason_SDate:
{
    type: Date,
    
},

SummerSeason_EDate:
{
    type: Date,
    
},

WinterSeason_SDate:
{
    type: Date,
    
},

WinterSeason_EDate:
{
    type: Date,
    
},
Summer_WeekDays:
{
type:Number,
default:null
},

Summer_WeekEndDays:
{
type:Number,
default:null
},

Winter_WeekDays:
{
type:Number,
default:null
},

Winter_WeekEndDays:
{
type:Number,
default:null
},
// summer Winter New Format

SummerS_SDate:
{
    type:String
  
    
},

SummerS_EDate:
{
    type:String
    
},

WinterS_SDate:
{
    type:String
    
},

WinterS_EDate:
{
    type:String
    
},
// summer winter New Format
//Added by chitra on 30.03.2021 to get the total count//
Total_Days:
{
type:Number,
default:null
},

   Block:
   {
       type: Boolean,
       required:true,
   },
   IsActive:
   {
       type: Boolean,
       required:true,
   },
   Boat_Status:
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
   Owner_Manual:String

 });

 const model=mongoose.model('Tb_BoatMaster', newboatschema);
 module.exports = model;
