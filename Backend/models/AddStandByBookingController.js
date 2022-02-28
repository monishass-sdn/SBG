//AuthorName:CHITRA V
//File:Schedule Controller.js
//Module:Manage Schedule
//Created Date:11.05.2021
//Purpose:To Manage Schedule

/***************************************************Import Packages and ViewModels Section******************************** */
const Schedule = require('../models/ScheduleModel')
const AddStandByBooking=require('../models/AddStandByBookingModel')
const Boats=require('../models/AddBoatModel')
const manageBoat=require('../models/ManageOwnerModel')
const mongoose = require("mongoose")
const moment  = require('moment');
const async = require('async');
const consecutive = require('../models/ConsecutiveDaysModel');
const PreLaunchAndLaunchBookingDays=require('../models/BookingDaysForLaunchPreLaunchModels')
const OwnerBooking_Days=require('../models/OwnerBookingDates');
const NewOwners = require('../models/AddOwnerModel');
const nodemailer = require('nodemailer')
const { checkIfIncludedInSeason } = require('./ScheduleController')
const { getDaysBetweenDates,getBookingIsFromWhichSeasonBasedOnStartDate } = require('../util/dateHelper')


//const Bookeddays=require('../models/BookedDaysForOwner');
/***************************************************Import Methods and Functions******************************** */
async function GetNextBookingID(){
 
    try {
        //  Schedule.find().count( async function(err, count){    
        const [result]  =await AddStandByBooking.find({}, null, { sort: { Booking_ID:-1 }, limit: 1 })
        if(result && result.Booking_ID)
       {
     
        return result.Booking_ID + 1; 
       }
       
    return 1001;
} 
    



catch (err) { 
    return 'error occured';
 }

  }


const AddStandByBookings=async (req, res, next)=>
{
    console.log(req.body.specialDayCheck,'speciallllllllllllllllllllllllllllllllllllllllllllllllllll')
   var check_Status=req.body.Check_Status;
   const globalbookingid=await GetNextBookingID();
    console.log(globalbookingid)
    var Total_Count=Number(req.body.TotalDay_Count);
    var WeekDay_Count=Number(req.body.WeekDay_Count);
    var WeekEnd_Count= Number(req.body.WeekEnd_Count);
    var User_role=req.body.User_RoleType;
    var Boat_id=req.body.Boat_Id;
    var Owner_id=req.body.User_Id;
    var start_Date=req.body.start;
    console.log(start_Date)
    var end_Date=req.body.end;
var TodaysDate= moment();
 var CurrentDate=moment(TodaysDate).format('DD-MM-YYYY');
 console.log(CurrentDate);

//var start_Date_NoTime=new Date(start_Date);
//console.log(start_Date_NoTime.toString(),'hi');
var Start_final=moment(start_Date);
var Start_final_withoutTime=Start_final.startOf('day');

// var end_Date_NoTime=new Date(end_Date);
var End_final=moment(end_Date);
var End_final_withoutTime=End_final.startOf('day');

var dif=Start_final.diff(moment(),'days')
console.log(dif)


    //check consecutive days 

      const dayBeforeIncomingStartDate = new Date(new Date(new Date(start_Date).setDate(new Date(start_Date).getDate() -1)).setUTCHours(00,00,00,00));
      const dayAfterIncomingEndDate = new Date(new Date(new Date(end_Date).setDate(new Date(end_Date).getDate() +1)).setUTCHours(00,00,00,00));

     console.log(dayBeforeIncomingStartDate,"dayBeforeIncomingStartDate")
     console.log(dayAfterIncomingEndDate,"dayAfterIncomingEndDate")


      // check consecutive days and if the booking exceeds consecutive day throw an error

        //decide booking is from summer or winter
   
        const boatData = await Boats.findOne({_id:Boat_id,IsActive:true},{SummerSeason_SDate:1,SummerSeason_EDate:1}).catch((error)=> console.log(error));
       
        if(!boatData) return res.json({status:false,message:"Invalid boat."});
   
        const consecutiveDays = await consecutive.findOne({Boat_Id:Boat_id,IsActive:true}).catch((error)=> console.log(error))
   
        if(!consecutiveDays) return res.json({status:false,message:"Set consecutive days."})


       let  incomingTotalDays = moment(new Date(end_Date)).diff(moment(new Date(start_Date)),"days") + 1;


        const bookingBeforeStandByBooking = await Schedule.findOne({Boat_Id:Boat_id,User_Id:Owner_id,IsActive:true,$and:[{start_NoTime:{$lte:dayBeforeIncomingStartDate}},{end_NoTime:{$gte:dayBeforeIncomingStartDate}}]}).catch((error)=> console.log(error))
        const bookingAfterStandByBooking = await Schedule.findOne({Boat_Id:Boat_id,User_Id:Owner_id,IsActive:true,$and:[{start_NoTime:{$lte:dayAfterIncomingEndDate}},{end_NoTime:{$gte:dayAfterIncomingEndDate}}]}).catch((error)=> console.log(error))
            
            if(bookingBeforeStandByBooking){
              incomingTotalDays +=  moment(new Date(bookingBeforeStandByBooking.end_NoTime)).diff(moment(new Date(bookingBeforeStandByBooking.start_NoTime)),"days") + 1
            }

            if(bookingAfterStandByBooking){
              incomingTotalDays +=  moment(new Date(bookingAfterStandByBooking.end_NoTime)).diff(moment(new Date(bookingAfterStandByBooking.start_NoTime)),"days") + 1
            }

        console.log(incomingTotalDays,"incomingTotalDays one")
   
       
      let {isIncludedInSummer} = getBookingIsFromWhichSeasonBasedOnStartDate(boatData.SummerSeason_SDate,boatData.SummerSeason_EDate,req.body.start) || {} ;
        

   
          if(isIncludedInSummer){
      if(incomingTotalDays > consecutiveDays.Summer_ConsecutiveDays) return res.json({status:false,message:"The booking exceeds the maximum booking duration. Please try to create a booking with fewer days."});
   }else{
     if(incomingTotalDays > consecutiveDays.Winter_ConsecutiveDays) return res.json({status:false,message:"The booking exceeds the maximum booking duration. Please try to create a booking with fewer days."});
   }

    //check consecutive days


    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    //check if this booking already exist or any of these days already booked in standby booking in this boat

    //get all dates between start and end date

    const allIncomingBookingDays =  getDaysBetweenDates(req.body.start,req.body.end).map((date)=> new Date(date));

    //create query to check if these days are booked or not

    const checkIfAlreadyBookedQuery = []
    allIncomingBookingDays.map((date)=> checkIfAlreadyBookedQuery.push({$and:[{start_NoTime:{$lte:new Date(date)}},{end_NoTime:{$gte:new Date(date)}}]}));

    const existingBooking = AddStandByBooking.findOne({Boat_Id:Boat_id,$or:checkIfAlreadyBookedQuery,BookingStatus:{$ne:"Rejected"}}).catch((error)=> console.log(error))

    console.log(existingBooking)

    if(existingBooking){
        res.json({
            status:false,
            message: 'An existing booking already exists for this date. A new booking cannot be created.'
        })
   
    }

    // console.log(allIncomingBookingDays)
    // console.log(checkIfAlreadyBookedQuery)

    

    // return res.json({status:'ok'})

// pending days
var PendingSummerWeekdays= Number(req.body.summer_Winter_Calc.PENDING_SUMMER_WEEKDAYS);
var PendingSummerWeekEnddays= Number(req.body.summer_Winter_Calc.PENDING_SUMMER_WEEKENDS);
var PendingWinterWeekdays= Number(req.body.summer_Winter_Calc.PENDING_WINTER_WEEKDAYS);
var PendingWinterWeekenddays= Number(req.body.summer_Winter_Calc.PENDING_WINTER_WEEKENDS);
console.log(PendingSummerWeekdays,PendingSummerWeekEnddays,PendingWinterWeekdays,PendingWinterWeekenddays)

//pending days
    if(req.body.Status=="Enable")
    {

        var  Module_status = 1;
    }
    else if (req.body.Status=="Disable")
    {
        var Module_status = 0;
     }

     //get month
     const Getmonth = new Date(Start_final);
     LaunchPreMonth=Getmonth.toLocaleString('default', { month: 'long' });
     //getmonth

     NewOwners.findById({_id:mongoose.Types.ObjectId(Owner_id)})
     .then(OwnerDetails=> {
     Boats.findById({_id:mongoose.Types.ObjectId(Boat_id)})
        .then(boatDetails=> {
          
     if(boatDetails.Boat_Status=="1")//check whether boat is Active or not
     {
        AddStandByBooking.find({Boat_Id:Boat_id,User_Id:Owner_id,start_NoTime:Start_final_withoutTime,IsActive:true}).then(CheckExist=>
            {
                console.log(CheckExist.length,'length')
                var _LengthChecks=CheckExist.length;
            if(_LengthChecks==0)
            {  
         


         //between Launch And PreLuanch

         if(check_Status=="1")
         { 
            Schedule.find({Boat_Id:Boat_id,IsActive:true,User_Id:Owner_id,Check_Status:check_Status,Check_Month:LaunchPreMonth}).then(Checkresult=>
                {
                    console.log(Checkresult.length,'length')
                    var _LengthCheck=Checkresult.length;
                if(_LengthCheck==0)
                {            
                

             console.log('pre and launchhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh') 
            PreLaunchAndLaunchBookingDays.findOne({Boat_Id:Boat_id}).then(bookingDays=>
                
                {
                   
                   var b_days=bookingDays.Booking_Days;
                   var WeekdaysAllowed=bookingDays.No_Of_WeekDays;
                   var WeekEndsAllowed=bookingDays.No_Of_WeekEndDays;
                   console.log(b_days)
                   console.log(Total_Count)
           
             if(Total_Count<=b_days)
             {

                if(WeekDay_Count<=WeekdaysAllowed && WeekEnd_Count<=WeekEndsAllowed )
                 {
                 
            console.log('hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii')
             
            
              Schedule.find({Boat_Id:Boat_id,IsActive:true,$or:[{start_NoTime:Start_final_withoutTime},{end_NoTime:End_final_withoutTime}]}).then(result=>
                  {
                    
                      console.log(result.length,'length')
                      var _Length=result.length;
                     if(_Length==0)
                     {
                         Schedule.findOne({Boat_Id:Boat_id,start:{$gte:start_Date},end:{$lte:End_final_withoutTime},IsActive:true}).then(result2=>
                             {
                                 if(result2==null)
                             {
                         console.log('hi1')
                         Schedule.findOne({Boat_Id:Boat_id,start:{$lte:start_Date},end:{$gte:End_final_withoutTime},IsActive:true}).then(results=>
                             {
                             if(results==null)
                             {
                                console.log('hi2')
                                 Schedule.findOne({Boat_Id:Boat_id,IsActive:true,$or:[{end:{$gte:Start_final_withoutTime,$lte:End_final_withoutTime}},{start:{$gte:Start_final_withoutTime,$lte:End_final_withoutTime}}]}).then(results=>
                                     {
                    
                                     if(results==null)
                                     {
                                        console.log('hi3')    
                                  
//Add 
console.log('Admin')
let Add_Schedule = new AddStandByBooking({ 
                                        
Boat_Id:mongoose.Types.ObjectId(req.body.Boat_Id),
Booking_ID:globalbookingid,
Boat_Name:req.body.Boat_Name,
calendarId:mongoose.Types.ObjectId(req.body.calendarId),
title:req.body.title,
body:req.body.body,
start:req.body.start,
end:req.body.end,
start_NoTime:Start_final_withoutTime,
end_NoTime:End_final_withoutTime,
goingDuration:req.body.goingDuration,
comingDuration:req.body.comingDuration,
isAllDay:req.body.isAllDay,
category:req.body.category,
dueDateClass:req.body.dueDateClass,
location:req.body.location,
attendees:req.body.attendees,
recurrenceRule:req.body.recurrenceRule,
isPending:req.body.isPending,
isFocused:req.body.isFocused,
Is_StandByBooking:req.body.Is_StandByBooking,
isVisible:req.body.isVisible,
isReadOnly:req.body.isReadOnly,
isPrivate:req.body.isPrivate,
color:req.body.color,
bgColor:req.body.bgColor,
dragBgColor:req.body.dragBgColor,
borderColor:req.body.borderColor,
customStyle:req.body.customStyle,
raw:req.body.raw,
state:req.body.state,
Check_Status:req.body.Check_Status, 
commends:req.body.commends,
Check_Month:LaunchPreMonth,
User_RoleType:req.body.User_RoleType,
TotalDay_Count:Total_Count,
WeekDay_Count:WeekDay_Count,
WeekEnd_Count:WeekEnd_Count,
User_Id:mongoose.Types.ObjectId(req.body.User_Id),
Admin_Id:mongoose.Types.ObjectId(req.body.Admin_Id),
Status:Module_status,
specialDayCheck:req.body.specialDayCheck,
IsActive: req.body.IsActive,
Current_Time:moment(Date.now()),
Updated_time: moment(Date.now())

});

Add_Schedule.save()
.then(response => {

 //mail
 var transporter = nodemailer.createTransport({

    service: 'Gmail',
   
    auth: {                  
        user:"noreply.smartboatbooking@gmail.com",
        pass:"Smart@123!!!"
       
        
    }
    
});

var mailOptions = {
   
    from:"noreply.smartboatbooking@gmail.com",
    to: OwnerDetails.Email,
    subject: 'Standby Booking Request',
    html:"<div  style=\"border: 3px solid #dcdde0;border-bottom:0;font-weight: 100;font-family: roboto;width:650px;text-align:center;margin:0 auto;\"><div><img style=\"margin:10px 0 5px;padding: 24px;max-width: 40%;float: left;\" src=\"http://65.2.28.16/api/uploads/logo.png\" alt=\"logo\"></div><div><h1 style=\"width: 100%;font-weight: normal;padding:45px 0;margin-bottom: 20px;color: #7b7b7b;font-size: 20px;letter-spacing: 0.5px;\"><b>Phone No: 02 9997 5344</b></h1></div><hr><div><h2 style=\"color:#5564c6;font-size:25px;font-weight: 500; margin: 15px 0;padding: 0; color:00125c;\"> Successfully Booked.</h2><h2 style=\"color:#000;font-size:18px;font-weight: 500; margin: 15px 0;padding: 10px;text-align: left;margin-left: 46px;\">Dear " +' '+OwnerDetails.First_Name +' '+" the request for a standby Booking on Boat "+boatDetails.Boat_Name +"on " +' ' +moment().toLocaleString()+" has received by Smart Boating.It is pending review based on availability.You will be contacted with the outcome of the decision shortly." +".\n\n.</h2></div><table cellpadding=\"4\" cellspacing=\"0\" align=\"center\" style=\"color: #111;border: px solid #DDD;border: px solid #dcdde0;border-top:0;border-bottom: 0px;\" width=\"650\"><td width=\"150\">&nbsp;</td><td width=\"400\" align=\"center\" style=\"padding-top:10px;padding-bottom:30px;border: 1px solid gray;\"><h2  style=\"color: #FFF;background: #00125c;text-decoration: none;padding: 10px 15px;display: inline-block;width: 92%;    margin: 0px 0px 0px 0px;\">Booking Details</h2><p>Boat Name:"+boatDetails.Boat_Name +'\n'+' '+"BookingDate:"+moment().toLocaleString() +"</p><hr><p><br> BookingLink:\"http://65.2.28.16/boat-bookings\"</p></td><td width=\"150\">&nbsp;</td></table><div width=\"550\" align=\"left\" style=\"font-size: 20px;padding-bottom:5px;line-height: 24px;\"><h2 style=\"color:#000;font-size:18px;font-weight: 500; margin: 15px 0;padding: 0;margin-left: 60px;\">Please contact us at admin@smartboating.com.au or 02 9997 5344 if you have any questions<br></h2><h2 style=\"color:#000;font-size:18px;font-weight: 500; margin: 15px 0;padding: 0;margin: -14px 0px 0px 60px;\"></h2><h2 style=\"color:#000;font-size:18px;font-weight: 500; margin: 15px 0;padding: 0;margin: 0px 0px 0px 60px;\">Thanks</h2><img style=\"max-width: 40%;float: left;margin-left: 60px;\" src=\"http://65.2.28.16/api/uploads/logo.png\" alt=\"logo/\"><br><br><h2 style=\"color:#000;font-size:18px;font-weight: 500; margin: 15px 0;padding: 0;margin-left: 60px;\">ATTENTION - This message and any attached files may contain information that is confidential, legally privileged or proprietary. It is intended only for use by the intended recipient. If you are not the intended recipient or the person responsible for delivering the message to the intended recipient, be advised that you have received this message in error. Any dissemination, copying, use or re-transmission of this message or attachment, or the disclosure of any information therein, is strictly forbidden.<br> </h2></div><div  align=\"center\" style=\"padding-top: 15px;padding-bottom: 15px;background-color:#00125c;color: #fff;width:650px;\">©&nbsp;Copyright 2021 - <a style=\"color: #0398d5;\" >smart boating.com.</a></div></div></div>" 
                       
    
    
};

transporter.sendMail(mailOptions, function (error, info) {
   
});           

var mailOptionsAdmin = {
   
    from:"noreply.smartboatbooking@gmail.com",
     to: "admin@smartboating.com.au",
     subject: 'Standby Booking Request',
     html:"<div  style=\"border: 3px solid #dcdde0;border-bottom:0;font-weight: 100;font-family: roboto;width:650px;text-align:center;margin:0 auto;\"><div><img style=\"margin:10px 0 5px;padding: 24px;max-width: 40%;float: left;\" src=\"http://65.2.28.16/api/uploads/logo.png\" alt=\"logo\"></div><div><h1 style=\"width: 100%;font-weight: normal;padding:45px 0;margin-bottom: 20px;color: #7b7b7b;font-size: 20px;letter-spacing: 0.5px;\"><b>Phone No: 02 9997 5344</b></h1></div><hr><div><h2 style=\"color:#5564c6;font-size:25px;font-weight: 500; margin: 15px 0;padding: 0; color:00125c;\"> Successfully Booked.</h2><h2 style=\"color:#000;font-size:18px;font-weight: 500; margin: 15px 0;padding: 10px;text-align: left;margin-left: 46px;\">Dear Adminsistrator the Owner " +' '+OwnerDetails.First_Name +' '+" on Boat "+boatDetails.Boat_Name +" has requested a standby booking on " +' ' +moment().toLocaleString() +".\n\n.</h2></div><table cellpadding=\"4\" cellspacing=\"0\" align=\"center\" style=\"color: #111;border: px solid #DDD;border: px solid #dcdde0;border-top:0;border-bottom: 0px;\" width=\"650\"><td width=\"150\">&nbsp;</td><td width=\"400\" align=\"center\" style=\"padding-top:10px;padding-bottom:30px;border: 1px solid gray;\"><h2  style=\"color: #FFF;background: #00125c;text-decoration: none;padding: 10px 15px;display: inline-block;width: 92%;    margin: 0px 0px 0px 0px;\">Booking Details</h2><p>Boat Name:"+boatDetails.Boat_Name +'\n'+' '+"BookingDate:"+moment().toLocaleString() +"</p><hr><p><br> BookingLink:\"http://65.2.28.16/boat-bookings\"</p></td><td width=\"150\">&nbsp;</td></table><div width=\"550\" align=\"left\" style=\"font-size: 20px;padding-bottom:5px;line-height: 24px;\"><h2 style=\"color:#000;font-size:18px;font-weight: 500; margin: 15px 0;padding: 0;margin-left: 60px;\">Please contact us at admin@smartboating.com.au or 02 9997 5344 if you have any questions<br></h2><h2 style=\"color:#000;font-size:18px;font-weight: 500; margin: 15px 0;padding: 0;margin: -14px 0px 0px 60px;\"></h2><h2 style=\"color:#000;font-size:18px;font-weight: 500; margin: 15px 0;padding: 0;margin: 0px 0px 0px 60px;\">Thanks</h2><img style=\"max-width: 40%;float: left;margin-left: 60px;\" src=\"http://65.2.28.16/api/uploads/logo.png\" alt=\"logo/\"><br><br><h2 style=\"color:#000;font-size:18px;font-weight: 500; margin: 15px 0;padding: 0;margin-left: 60px;\">ATTENTION - This message and any attached files may contain information that is confidential, legally privileged or proprietary. It is intended only for use by the intended recipient. If you are not the intended recipient or the person responsible for delivering the message to the intended recipient, be advised that you have received this message in error. Any dissemination, copying, use or re-transmission of this message or attachment, or the disclosure of any information therein, is strictly forbidden.<br> </h2></div><div  align=\"center\" style=\"padding-top: 15px;padding-bottom: 15px;background-color:#00125c;color: #fff;width:650px;\">©&nbsp;Copyright 2021 - <a style=\"color: #0398d5;\" >smart boating.com.</a></div></div></div>" 
};

transporter.sendMail(mailOptionsAdmin, function (error, info) {
  
   
}); 
//mail
res.json({
            
    status:true,
    message: 'The booking has been successfully created'
})


})



}
else
{
res.json({

status:true,
message: 'An existing booking already exists for this date. A new booking cannot be created'
})

}



})
//Add
}
else
{
res.json({

status:true,
message: 'An existing booking already exists for this date. A new booking cannot be created'
})

}   }) 
                     }
                     else
                     {
                         res.json({

                             status:true,
                             message: 'An existing booking already exists for this date. A new booking cannot be created'
                         })
                     }
                 })
                     }
                     else
                     {
                         res.json({

                             status:true,
                             message: 'An existing booking already exists for this date. A new booking cannot be created'
                         })
                     }
})

             }
             else
             {
                res.json({

                    status:true,
                    message: 'Only'  +WeekdaysAllowed +' WeekDays and' +WeekEndsAllowed  +'WeekendDays are allowed Between launch Date And Pre-Launch Date'
                })
             }

         }
         else
         {
            res.json({

                status:true,
                message: 'Allowed Booking Days Exceeds max count Between launch Date And Pre-Launch Date'
            })
         }
        })
    }
    else
    {
        res.json({

            status:true,
            message: 'Your allowed Booking days for this month during pre-launch and launch-date is over. Please try next month or please try booking after launch date.'
        })
    }
})

            
         }

         //between Launch And PreLaunch


         //After Launch before current date

         if(check_Status=="2")
         {
            Schedule.find({Boat_Id:Boat_id,IsActive:true,$or:[{start_NoTime:Start_final_withoutTime},{end_NoTime:End_final_withoutTime}]}).then(result=>
                {
                                       
                    console.log(result.length,'length')
                    var _Length=result.length;
                   if(_Length==0)
                    {
                        Schedule.findOne({Boat_Id:Boat_id,start:{$gte:start_Date},end:{$lte:End_final_withoutTime},IsActive:true}).then(result2=>
                            {
                                if(result2==null)
                            {
                               
                            Schedule.findOne({Boat_Id:Boat_id,start:{$lte:start_Date},end:{$gte:End_final_withoutTime},IsActive:true}).then(results=>
                                {
                                if(results==null)
                                {

                               Schedule.findOne({Boat_Id:Boat_id,IsActive:true,$or:[{end:{$gte:Start_final_withoutTime,$lte:End_final_withoutTime}},{start:{$gte:Start_final_withoutTime,$lte:End_final_withoutTime}}]}).then(results=>
                                        {
                                        if(results==null)
                                        {
                                    
                           

                        Boats.findById({_id:mongoose.Types.ObjectId(Boat_id)}).then(response=>
                            {  
                                var SummerWeekdays=response.Summer_WeekDays;
                                var SummerWeekendDays=response.Summer_WeekEndDays;
                                var  WinterWeekDays=response.Winter_WeekDays;
                                var WinterweekendDays=response.Winter_WeekEndDays;

                                //SummerSeason_SDate:{$lte:Start_final_withoutTime},SummerSeason_EDate:{$gte:End_final_withoutTime},
                                
                                Boats.findOne({_id:Boat_id,IsActive:true}).then(async(Boatresults)=>
                                    {
                                    console.log(Boatresults)
                                       
                                    let stopExecution = {stop:false}
                                    let isAvailableDay =  await checkIfIncludedInSeason(Boat_id,Owner_id,Boatresults.SummerSeason_SDate,Boatresults.SummerSeason_EDate,start_Date,end_Date).catch((error)=>{
                                        console.log(error)
                                        stopExecution = error
                                    })
            
            
                                    if(stopExecution.stop){
                                        return res.json({status:true,message:stopExecution.error})
                                    }
            
                                    if(isAvailableDay && isAvailableDay.status)//check Date Between Summer Dates
                                    {


                                                                      
                                    consecutive.findOne({Boat_Id:mongoose.Types.ObjectId(Boat_id)})
                                    .then(element=> 
                                        
                                        {
                                            if(element!=null)
                                            {

                                            

                                            if(element.Summer_ConsecutiveDays>=Total_Count)//consecutive count
                                            {

                                         
if(PendingSummerWeekdays>=WeekDay_Count && PendingSummerWeekEnddays>=WeekEnd_Count)//count of weekday and week end
{

// for updating Summer days
    


//Add Summer Section

let Add_Schedule = new AddStandByBooking({ 
                         
                      
                    
Boat_Id:mongoose.Types.ObjectId(req.body.Boat_Id),
Booking_ID:globalbookingid,
Boat_Name:req.body.Boat_Name,
calendarId:mongoose.Types.ObjectId(req.body.calendarId),
title:req.body.title,
body:req.body.body,
start:req.body.start,
end:req.body.end,
start_NoTime:Start_final,
end_NoTime:End_final,
goingDuration:req.body.goingDuration,
comingDuration:req.body.comingDuration,
isAllDay:req.body.isAllDay,
category:req.body.category,
dueDateClass:req.body.dueDateClass,
location:req.body.location,
attendees:req.body.attendees,
recurrenceRule:req.body.recurrenceRule,
isPending:req.body.isPending,
isFocused:req.body.isFocused,
isVisible:req.body.isVisible,
isReadOnly:req.body.isReadOnly,
isPrivate:req.body.isPrivate,
Is_StandByBooking:req.body.Is_StandByBooking,
Check_Status:req.body.Check_Status,
commends:req.body.commends,
color:req.body.color,
bgColor:req.body.bgColor,
dragBgColor:req.body.dragBgColor,
borderColor:req.body.borderColor,
customStyle:req.body.customStyle,
raw:req.body.raw,
state:req.body.state, 
User_RoleType:req.body.User_RoleType,
TotalDay_Count:Total_Count,
WeekDay_Count:WeekDay_Count,
WeekEnd_Count:WeekEnd_Count,
User_Id:mongoose.Types.ObjectId(req.body.User_Id),
Admin_Id:mongoose.Types.ObjectId(req.body.Admin_Id),
Status:Module_status,
specialDayCheck:req.body.specialDayCheck,
IsActive: req.body.IsActive,
Current_Time:moment(Date.now()),
Updated_time: moment(Date.now())

});

Add_Schedule.save()
.then(response => {

     //mail
 var transporter = nodemailer.createTransport({

    service: 'Gmail',
   
    auth: {                  
        user:"noreply.smartboatbooking@gmail.com",
        pass:"Smart@123!!!"
       
        
    }
    
});

var mailOptions = {
   
    from:"noreply.smartboatbooking@gmail.com",
    to: OwnerDetails.Email,
    subject: 'Standby Booking Request',
    html:"<div  style=\"border: 3px solid #dcdde0;border-bottom:0;font-weight: 100;font-family: roboto;width:650px;text-align:center;margin:0 auto;\"><div><img style=\"margin:10px 0 5px;padding: 24px;max-width: 40%;float: left;\" src=\"http://65.2.28.16/api/uploads/logo.png\" alt=\"logo\"></div><div><h1 style=\"width: 100%;font-weight: normal;padding:45px 0;margin-bottom: 20px;color: #7b7b7b;font-size: 20px;letter-spacing: 0.5px;\"><b>Phone No: 02 9997 5344</b></h1></div><hr><div><h2 style=\"color:#5564c6;font-size:25px;font-weight: 500; margin: 15px 0;padding: 0; color:00125c;\"> Successfully Booked.</h2><h2 style=\"color:#000;font-size:18px;font-weight: 500; margin: 15px 0;padding: 10px;text-align: left;margin-left: 46px;\">Dear " +' '+OwnerDetails.First_Name +' '+" the request for a standby Booking on Boat "+boatDetails.Boat_Name +"on " +' ' +moment().toLocaleString()+" has received by Smart Boating.It is pending review based on availability.You will be contacted with the outcome of the decision shortly." +".\n\n.</h2></div><table cellpadding=\"4\" cellspacing=\"0\" align=\"center\" style=\"color: #111;border: px solid #DDD;border: px solid #dcdde0;border-top:0;border-bottom: 0px;\" width=\"650\"><td width=\"150\">&nbsp;</td><td width=\"400\" align=\"center\" style=\"padding-top:10px;padding-bottom:30px;border: 1px solid gray;\"><h2  style=\"color: #FFF;background: #00125c;text-decoration: none;padding: 10px 15px;display: inline-block;width: 92%;    margin: 0px 0px 0px 0px;\">Booking Details</h2><p>Boat Name:"+boatDetails.Boat_Name +'\n'+' '+"BookingDate:"+moment().toLocaleString() +"</p><hr><p><br> BookingLink:\"http://65.2.28.16/boat-bookings\"</p></td><td width=\"150\">&nbsp;</td></table><div width=\"550\" align=\"left\" style=\"font-size: 20px;padding-bottom:5px;line-height: 24px;\"><h2 style=\"color:#000;font-size:18px;font-weight: 500; margin: 15px 0;padding: 0;margin-left: 60px;\">Please contact us at admin@smartboating.com.au or 02 9997 5344 if you have any questions<br></h2><h2 style=\"color:#000;font-size:18px;font-weight: 500; margin: 15px 0;padding: 0;margin: -14px 0px 0px 60px;\"></h2><h2 style=\"color:#000;font-size:18px;font-weight: 500; margin: 15px 0;padding: 0;margin: 0px 0px 0px 60px;\">Thanks</h2><img style=\"max-width: 40%;float: left;margin-left: 60px;\" src=\"http://65.2.28.16/api/uploads/logo.png\" alt=\"logo/\"><br><br><h2 style=\"color:#000;font-size:18px;font-weight: 500; margin: 15px 0;padding: 0;margin-left: 60px;\">ATTENTION - This message and any attached files may contain information that is confidential, legally privileged or proprietary. It is intended only for use by the intended recipient. If you are not the intended recipient or the person responsible for delivering the message to the intended recipient, be advised that you have received this message in error. Any dissemination, copying, use or re-transmission of this message or attachment, or the disclosure of any information therein, is strictly forbidden.<br> </h2></div><div  align=\"center\" style=\"padding-top: 15px;padding-bottom: 15px;background-color:#00125c;color: #fff;width:650px;\">©&nbsp;Copyright 2021 - <a style=\"color: #0398d5;\" >smart boating.com.</a></div></div></div>" 
                       
    
    
};

transporter.sendMail(mailOptions, function (error, info) {
   
});           

var mailOptionsAdmin = {
   
    from:"noreply.smartboatbooking@gmail.com",
     to: "admin@smartboating.com.au",
     subject: 'Standby Booking Request',
     html:"<div  style=\"border: 3px solid #dcdde0;border-bottom:0;font-weight: 100;font-family: roboto;width:650px;text-align:center;margin:0 auto;\"><div><img style=\"margin:10px 0 5px;padding: 24px;max-width: 40%;float: left;\" src=\"http://65.2.28.16/api/uploads/logo.png\" alt=\"logo\"></div><div><h1 style=\"width: 100%;font-weight: normal;padding:45px 0;margin-bottom: 20px;color: #7b7b7b;font-size: 20px;letter-spacing: 0.5px;\"><b>Phone No: 02 9997 5344</b></h1></div><hr><div><h2 style=\"color:#5564c6;font-size:25px;font-weight: 500; margin: 15px 0;padding: 0; color:00125c;\"> Successfully Booked.</h2><h2 style=\"color:#000;font-size:18px;font-weight: 500; margin: 15px 0;padding: 10px;text-align: left;margin-left: 46px;\">Dear Adminsistrator the Owner " +' '+OwnerDetails.First_Name +' '+" on Boat "+boatDetails.Boat_Name +" has requested a standby booking on " +' ' +moment().toLocaleString() +".\n\n.</h2></div><table cellpadding=\"4\" cellspacing=\"0\" align=\"center\" style=\"color: #111;border: px solid #DDD;border: px solid #dcdde0;border-top:0;border-bottom: 0px;\" width=\"650\"><td width=\"150\">&nbsp;</td><td width=\"400\" align=\"center\" style=\"padding-top:10px;padding-bottom:30px;border: 1px solid gray;\"><h2  style=\"color: #FFF;background: #00125c;text-decoration: none;padding: 10px 15px;display: inline-block;width: 92%;    margin: 0px 0px 0px 0px;\">Booking Details</h2><p>Boat Name:"+boatDetails.Boat_Name +'\n'+' '+"BookingDate:"+moment().toLocaleString() +"</p><hr><p><br> BookingLink:\"http://65.2.28.16/boat-bookings\"</p></td><td width=\"150\">&nbsp;</td></table><div width=\"550\" align=\"left\" style=\"font-size: 20px;padding-bottom:5px;line-height: 24px;\"><h2 style=\"color:#000;font-size:18px;font-weight: 500; margin: 15px 0;padding: 0;margin-left: 60px;\">Please contact us at admin@smartboating.com.au or 02 9997 5344 if you have any questions<br></h2><h2 style=\"color:#000;font-size:18px;font-weight: 500; margin: 15px 0;padding: 0;margin: -14px 0px 0px 60px;\"></h2><h2 style=\"color:#000;font-size:18px;font-weight: 500; margin: 15px 0;padding: 0;margin: 0px 0px 0px 60px;\">Thanks</h2><img style=\"max-width: 40%;float: left;margin-left: 60px;\" src=\"http://65.2.28.16/api/uploads/logo.png\" alt=\"logo/\"><br><br><h2 style=\"color:#000;font-size:18px;font-weight: 500; margin: 15px 0;padding: 0;margin-left: 60px;\">ATTENTION - This message and any attached files may contain information that is confidential, legally privileged or proprietary. It is intended only for use by the intended recipient. If you are not the intended recipient or the person responsible for delivering the message to the intended recipient, be advised that you have received this message in error. Any dissemination, copying, use or re-transmission of this message or attachment, or the disclosure of any information therein, is strictly forbidden.<br> </h2></div><div  align=\"center\" style=\"padding-top: 15px;padding-bottom: 15px;background-color:#00125c;color: #fff;width:650px;\">©&nbsp;Copyright 2021 - <a style=\"color: #0398d5;\" >smart boating.com.</a></div></div></div>" 
};

transporter.sendMail(mailOptionsAdmin, function (error, info) {

   
    
}); 
//mail
res.json({

status:true,
message: 'The booking has been successfully created'
})
})
.catch(error => {
res.json({
message: error
})
})                              }//weekday,weekend
                            else
                                {

                                 res.json({
                                status:false,
                                 message: 'Booking Days Exceeds limit'
                                          })


                                 }
                        }
                        else
                        {

                            res.json({
                                status:false,
                                message: 'You Cannot Book This Much Number Of Days in One Booking'
                            })


                        }
                    }
                    else
                    {
                        res.json({
                            status:false,
                            message: 'Consecutive days for this boat is Empty'
                        })

                    }
                        })
                    
                            }
                        

                
                                else
                                {
                                    //WinterSeason_SDate:{$lte:Start_final_withoutTime},WinterSeason_EDate:{$gte:End_final_withoutTime}
                                    Boats.findOne({_id:Boat_id,IsActive:true}).then(async(BoatresultsWinter)=>
                                        {
                                       console.log(BoatresultsWinter);

                                    //list all winter start and end date of  owne  based on owner duration  duration which include all year

                      let stopExecution = {stop:false}
                      let isAvailableDay =  await checkIfIncludedInSeason(Boat_id,Owner_id,BoatresultsWinter.WinterSeason_SDate,BoatresultsWinter.WinterSeason_EDate,start_Date,end_Date).catch((error)=>{
                        console.log(error)
                        stopExecution = error
                    })

                    if(stopExecution.stop){
                        return res.json({status:true,message:stopExecution.error})
                    }
                              

                  
                                    if(isAvailableDay && isAvailableDay.status)//check Date Between winter Dates
                                    {
                                    
                                
                                    consecutive.findOne({Boat_Id:mongoose.Types.ObjectId(Boat_id)})
                                    .then(element=> 
                                        
                                        {
                                            if(element!=null)
                                            {

                                    if(element.Winter_ConsecutiveDays>=Total_Count)
                                    {
                                 
                                        if(PendingWinterWeekdays>=WeekDay_Count && PendingWinterWeekenddays>=WeekEnd_Count )//count of weekday and week end
                                        {
                                        
                                             // for updating Summer days
                                            
//Add Winter Section

let Add_Schedule = new AddStandByBooking({ 
                         
                      
                    
Boat_Id:mongoose.Types.ObjectId(req.body.Boat_Id),
Booking_ID:globalbookingid,
Boat_Name:req.body.Boat_Name,
calendarId:mongoose.Types.ObjectId(req.body.calendarId),
title:req.body.title,
body:req.body.body,
start:req.body.start,
end:req.body.end,
start_NoTime:Start_final,
end_NoTime:End_final,
goingDuration:req.body.goingDuration,
comingDuration:req.body.comingDuration,
isAllDay:req.body.isAllDay,
category:req.body.category,
dueDateClass:req.body.dueDateClass,
location:req.body.location,
attendees:req.body.attendees,
recurrenceRule:req.body.recurrenceRule,
isPending:req.body.isPending,
isFocused:req.body.isFocused,
Is_StandByBooking:req.body.Is_StandByBooking,
Check_Status:req.body.Check_Status,
commends:req.body.commends,
isVisible:req.body.isVisible,
isReadOnly:req.body.isReadOnly,
isPrivate:req.body.isPrivate,
color:req.body.color,
bgColor:req.body.bgColor,
dragBgColor:req.body.dragBgColor,
borderColor:req.body.borderColor,
customStyle:req.body.customStyle,
raw:req.body.raw,
state:req.body.state, 
User_RoleType:req.body.User_RoleType,
TotalDay_Count:Total_Count,
WeekDay_Count:WeekDay_Count,
WeekEnd_Count:WeekEnd_Count,
User_Id:mongoose.Types.ObjectId(req.body.User_Id),
Admin_Id:mongoose.Types.ObjectId(req.body.Admin_Id),
Status:Module_status,
specialDayCheck:req.body.specialDayCheck,
IsActive: req.body.IsActive,
Current_Time:moment(Date.now()),
Updated_time: moment(Date.now())

});

Add_Schedule.save()
.then(response => {

 //mail
 var transporter = nodemailer.createTransport({

    service: 'Gmail',
   
    auth: {                  
        user:"noreply.smartboatbooking@gmail.com",
        pass:"Smart@123!!!"
       
        
    }
    
});

var mailOptions = {
   
    from:"noreply.smartboatbooking@gmail.com",
    to: OwnerDetails.Email,
    subject: 'Standby Booking Request',
    html:"<div  style=\"border: 3px solid #dcdde0;border-bottom:0;font-weight: 100;font-family: roboto;width:650px;text-align:center;margin:0 auto;\"><div><img style=\"margin:10px 0 5px;padding: 24px;max-width: 40%;float: left;\" src=\"http://65.2.28.16/api/uploads/logo.png\" alt=\"logo\"></div><div><h1 style=\"width: 100%;font-weight: normal;padding:45px 0;margin-bottom: 20px;color: #7b7b7b;font-size: 20px;letter-spacing: 0.5px;\"><b>Phone No: 02 9997 5344</b></h1></div><hr><div><h2 style=\"color:#5564c6;font-size:25px;font-weight: 500; margin: 15px 0;padding: 0; color:00125c;\"> Successfully Booked.</h2><h2 style=\"color:#000;font-size:18px;font-weight: 500; margin: 15px 0;padding: 10px;text-align: left;margin-left: 46px;\">Dear " +' '+OwnerDetails.First_Name +' '+" the request for a standby Booking on Boat "+boatDetails.Boat_Name +"on " +' ' +moment().toLocaleString()+" has received by Smart Boating.It is pending review based on availability.You will be contacted with the outcome of the decision shortly." +".\n\n.</h2></div><table cellpadding=\"4\" cellspacing=\"0\" align=\"center\" style=\"color: #111;border: px solid #DDD;border: px solid #dcdde0;border-top:0;border-bottom: 0px;\" width=\"650\"><td width=\"150\">&nbsp;</td><td width=\"400\" align=\"center\" style=\"padding-top:10px;padding-bottom:30px;border: 1px solid gray;\"><h2  style=\"color: #FFF;background: #00125c;text-decoration: none;padding: 10px 15px;display: inline-block;width: 92%;    margin: 0px 0px 0px 0px;\">Booking Details</h2><p>Boat Name:"+boatDetails.Boat_Name +'\n'+' '+"BookingDate:"+moment().toLocaleString() +"</p><hr><p><br> BookingLink:\"http://65.2.28.16/boat-bookings\"</p></td><td width=\"150\">&nbsp;</td></table><div width=\"550\" align=\"left\" style=\"font-size: 20px;padding-bottom:5px;line-height: 24px;\"><h2 style=\"color:#000;font-size:18px;font-weight: 500; margin: 15px 0;padding: 0;margin-left: 60px;\">Please contact us at admin@smartboating.com.au or 02 9997 5344 if you have any questions<br></h2><h2 style=\"color:#000;font-size:18px;font-weight: 500; margin: 15px 0;padding: 0;margin: -14px 0px 0px 60px;\"></h2><h2 style=\"color:#000;font-size:18px;font-weight: 500; margin: 15px 0;padding: 0;margin: 0px 0px 0px 60px;\">Thanks</h2><img style=\"max-width: 40%;float: left;margin-left: 60px;\" src=\"http://65.2.28.16/api/uploads/logo.png\" alt=\"logo/\"><br><br><h2 style=\"color:#000;font-size:18px;font-weight: 500; margin: 15px 0;padding: 0;margin-left: 60px;\">ATTENTION - This message and any attached files may contain information that is confidential, legally privileged or proprietary. It is intended only for use by the intended recipient. If you are not the intended recipient or the person responsible for delivering the message to the intended recipient, be advised that you have received this message in error. Any dissemination, copying, use or re-transmission of this message or attachment, or the disclosure of any information therein, is strictly forbidden.<br> </h2></div><div  align=\"center\" style=\"padding-top: 15px;padding-bottom: 15px;background-color:#00125c;color: #fff;width:650px;\">©&nbsp;Copyright 2021 - <a style=\"color: #0398d5;\" >smart boating.com.</a></div></div></div>" 
                       
    
    
};

transporter.sendMail(mailOptions, function (error, info) {
   
});           

var mailOptionsAdmin = {
   
    from:"noreply.smartboatbooking@gmail.com",
     to: "admin@smartboating.com.au",
     subject: 'Standby Booking Request',
     html:"<div  style=\"border: 3px solid #dcdde0;border-bottom:0;font-weight: 100;font-family: roboto;width:650px;text-align:center;margin:0 auto;\"><div><img style=\"margin:10px 0 5px;padding: 24px;max-width: 40%;float: left;\" src=\"http://65.2.28.16/api/uploads/logo.png\" alt=\"logo\"></div><div><h1 style=\"width: 100%;font-weight: normal;padding:45px 0;margin-bottom: 20px;color: #7b7b7b;font-size: 20px;letter-spacing: 0.5px;\"><b>Phone No: 02 9997 5344</b></h1></div><hr><div><h2 style=\"color:#5564c6;font-size:25px;font-weight: 500; margin: 15px 0;padding: 0; color:00125c;\"> Successfully Booked.</h2><h2 style=\"color:#000;font-size:18px;font-weight: 500; margin: 15px 0;padding: 10px;text-align: left;margin-left: 46px;\">Dear Adminsistrator the Owner " +' '+OwnerDetails.First_Name +' '+" on Boat "+boatDetails.Boat_Name +" has requested a standby booking on " +' ' +moment().toLocaleString() +".\n\n.</h2></div><table cellpadding=\"4\" cellspacing=\"0\" align=\"center\" style=\"color: #111;border: px solid #DDD;border: px solid #dcdde0;border-top:0;border-bottom: 0px;\" width=\"650\"><td width=\"150\">&nbsp;</td><td width=\"400\" align=\"center\" style=\"padding-top:10px;padding-bottom:30px;border: 1px solid gray;\"><h2  style=\"color: #FFF;background: #00125c;text-decoration: none;padding: 10px 15px;display: inline-block;width: 92%;    margin: 0px 0px 0px 0px;\">Booking Details</h2><p>Boat Name:"+boatDetails.Boat_Name +'\n'+' '+"BookingDate:"+moment().toLocaleString() +"</p><hr><p><br> BookingLink:\"http://65.2.28.16/boat-bookings\"</p></td><td width=\"150\">&nbsp;</td></table><div width=\"550\" align=\"left\" style=\"font-size: 20px;padding-bottom:5px;line-height: 24px;\"><h2 style=\"color:#000;font-size:18px;font-weight: 500; margin: 15px 0;padding: 0;margin-left: 60px;\">Please contact us at admin@smartboating.com.au or 02 9997 5344 if you have any questions<br></h2><h2 style=\"color:#000;font-size:18px;font-weight: 500; margin: 15px 0;padding: 0;margin: -14px 0px 0px 60px;\"></h2><h2 style=\"color:#000;font-size:18px;font-weight: 500; margin: 15px 0;padding: 0;margin: 0px 0px 0px 60px;\">Thanks</h2><img style=\"max-width: 40%;float: left;margin-left: 60px;\" src=\"http://65.2.28.16/api/uploads/logo.png\" alt=\"logo/\"><br><br><h2 style=\"color:#000;font-size:18px;font-weight: 500; margin: 15px 0;padding: 0;margin-left: 60px;\">ATTENTION - This message and any attached files may contain information that is confidential, legally privileged or proprietary. It is intended only for use by the intended recipient. If you are not the intended recipient or the person responsible for delivering the message to the intended recipient, be advised that you have received this message in error. Any dissemination, copying, use or re-transmission of this message or attachment, or the disclosure of any information therein, is strictly forbidden.<br> </h2></div><div  align=\"center\" style=\"padding-top: 15px;padding-bottom: 15px;background-color:#00125c;color: #fff;width:650px;\">©&nbsp;Copyright 2021 - <a style=\"color: #0398d5;\" >smart boating.com.</a></div></div></div>" 
};

transporter.sendMail(mailOptionsAdmin, function (error, info) {

   
    
}); 
//mail

res.json({

status:true,
message: 'The booking has been successfully created'
})
})
.catch(error => {
res.json({
message: error
})
})

                                        }//weekday weekend count
                                        else{

                                            res.json({
                                                status:false,
                                                 message: 'Booking Days Exceeds limit'
                                                    })
    
    
                                                 
                                        }
//Add Winter Section
}
                                  
else
{

res.json({
status:false,
message: 'You Cannot Book This Much Number Of Days in One Booking'
})

}
                                            }
                                            else
                                            {
                                              res.json({
                                                    status:false,
                                                    message: 'Consecutive days for this boat is Empty'
                                                })
                                            }
})                                     }
                              else
                              {
                                res.json({
                                    status:false,
                                    message: 'These Dates Are not Allowed for Booking'
                                })
                              }
                            })
                            }//else


                                
                            });
                        })
                    }
                    else
                    {
                        res.json({
                            status:false,
                            message: 'An existing booking already exists for this date. A new booking cannot be created'
                        })
                    }
                                      
                        })
                        }
                        else
                        {

                            res.json({
                                status:false,
                                message: 'An existing booking already exists for this date. A new booking cannot be created'
                            })

                        }

                    })
                }
                else
                {
                    res.json({
                        status:false,
                        message: 'An existing booking already exists for this date. A new booking cannot be created'
                    })

                }
        
             
                });//else inside function owner


            }
            else
            {
                res.json({
                    status:false,
                    message: 'An existing booking already exists for this date. A new booking cannot be created'
                })
            }

            });


         }
         


        //between Launch And PreLuanch
        if(check_Status=="3")
        {
          
                        if(dif>=0)//for Previous Date
                        {  
                           
                           if(User_role=='Admin')//for Admin
                           {
                             Schedule.find({Boat_Id:Boat_id,IsActive:true,$or:[{start_NoTime:Start_final_withoutTime},{end_NoTime:End_final_withoutTime}]}).then(result=>
                                 {
                                   
                                     console.log(result.length,'length')
                                     var _Length=result.length;
                                    if(_Length==0)
                                    {
                                        Schedule.findOne({Boat_Id:Boat_id,start:{$gte:start_Date},end:{$lte:End_final_withoutTime},IsActive:true}).then(result2=>
                                            {
                                                if(result2==null)
                                            {
                                        
                                        Schedule.findOne({Boat_Id:Boat_id,start:{$lte:start_Date},end:{$gte:End_final_withoutTime},IsActive:true}).then(results=>
                                            {
                                            if(results==null)
                                            {
                                                Schedule.findOne({Boat_Id:Boat_id,IsActive:true,$or:[{end:{$gte:Start_final_withoutTime,$lte:End_final_withoutTime}},{start:{$gte:Start_final_withoutTime,$lte:End_final_withoutTime}}]}).then(results=>
                                                    {
                                                    if(results==null)
                                                    {
                                                    
                                                 
//Add 
console.log('Admin')
let Add_Schedule = new AddStandByBooking({ 
                                     
                    
                                
    Boat_Id:mongoose.Types.ObjectId(req.body.Boat_Id),
    Booking_ID:globalbookingid,
    Boat_Name:req.body.Boat_Name,
    calendarId:mongoose.Types.ObjectId(req.body.calendarId),
    title:req.body.title,
    body:req.body.body,
    start:req.body.start,
     end:req.body.end,
     start_NoTime:Start_final_withoutTime,
     end_NoTime:End_final_withoutTime,
     goingDuration:req.body.goingDuration,
     comingDuration:req.body.comingDuration,
     isAllDay:req.body.isAllDay,
     category:req.body.category,
     dueDateClass:req.body.dueDateClass,
     location:req.body.location,
     attendees:req.body.attendees,
     recurrenceRule:req.body.recurrenceRule,
     isPending:req.body.isPending,
     isFocused:req.body.isFocused,
     isVisible:req.body.isVisible,
     isReadOnly:req.body.isReadOnly,
     isPrivate:req.body.isPrivate,
     color:req.body.color,
     bgColor:req.body.bgColor,
     Is_StandByBooking:req.body.Is_StandByBooking,
     Check_Status:req.body.Check_Status,
     commends:req.body.commends,
     dragBgColor:req.body.dragBgColor,
     borderColor:req.body.borderColor,
     customStyle:req.body.customStyle,
     raw:req.body.raw,
     state:req.body.state, 
     User_RoleType:req.body.User_RoleType,
     TotalDay_Count:Total_Count,
WeekDay_Count:WeekDay_Count,
WeekEnd_Count:WeekEnd_Count,
     User_Id:mongoose.Types.ObjectId(req.body.User_Id),
     Admin_Id:mongoose.Types.ObjectId(req.body.Admin_Id),
     Status:Module_status,
     IsActive: req.body.IsActive,
     Current_Time:moment(Date.now()),
     Updated_time: moment(Date.now())

});

Add_Schedule.save()
 .then(response => {

     //mail
 var transporter = nodemailer.createTransport({

    service: 'Gmail',
   
    auth: {                  
        user:"noreply.smartboatbooking@gmail.com",
        pass:"Smart@123!!!"
       
        
    }
    
});
          

var mailOptionsAdmin = {
   
    from:"noreply.smartboatbooking@gmail.com",
     to: "admin@smartboating.com.au",
     subject: 'Standby Booking Request',
     html:"<div  style=\"border: 3px solid #dcdde0;border-bottom:0;font-weight: 100;font-family: roboto;width:650px;text-align:center;margin:0 auto;\"><div><img style=\"margin:10px 0 5px;padding: 24px;max-width: 40%;float: left;\" src=\"http://65.2.28.16/api/uploads/logo.png\" alt=\"logo\"></div><div><h1 style=\"width: 100%;font-weight: normal;padding:45px 0;margin-bottom: 20px;color: #7b7b7b;font-size: 20px;letter-spacing: 0.5px;\"><b>Phone No: 02 9997 5344</b></h1></div><hr><div><h2 style=\"color:#5564c6;font-size:25px;font-weight: 500; margin: 15px 0;padding: 0; color:00125c;\"> Successfully Booked.</h2><h2 style=\"color:#000;font-size:18px;font-weight: 500; margin: 15px 0;padding: 10px;text-align: left;margin-left: 46px;\">Dear Adminsistrator the Owner " +' '+OwnerDetails.First_Name +' '+" on Boat "+boatDetails.Boat_Name +" has requested a standby booking on " +' ' +moment().toLocaleString() +".\n\n.</h2></div><table cellpadding=\"4\" cellspacing=\"0\" align=\"center\" style=\"color: #111;border: px solid #DDD;border: px solid #dcdde0;border-top:0;border-bottom: 0px;\" width=\"650\"><td width=\"150\">&nbsp;</td><td width=\"400\" align=\"center\" style=\"padding-top:10px;padding-bottom:30px;border: 1px solid gray;\"><h2  style=\"color: #FFF;background: #00125c;text-decoration: none;padding: 10px 15px;display: inline-block;width: 92%;    margin: 0px 0px 0px 0px;\">Booking Details</h2><p>Boat Name:"+boatDetails.Boat_Name +'\n'+' '+"BookingDate:"+moment().toLocaleString() +"</p><hr><p><br> BookingLink:\"http://65.2.28.16/boat-bookings\"</p></td><td width=\"150\">&nbsp;</td></table><div width=\"550\" align=\"left\" style=\"font-size: 20px;padding-bottom:5px;line-height: 24px;\"><h2 style=\"color:#000;font-size:18px;font-weight: 500; margin: 15px 0;padding: 0;margin-left: 60px;\">Please contact us at admin@smartboating.com.au or 02 9997 5344 if you have any questions<br></h2><h2 style=\"color:#000;font-size:18px;font-weight: 500; margin: 15px 0;padding: 0;margin: -14px 0px 0px 60px;\"></h2><h2 style=\"color:#000;font-size:18px;font-weight: 500; margin: 15px 0;padding: 0;margin: 0px 0px 0px 60px;\">Thanks</h2><img style=\"max-width: 40%;float: left;margin-left: 60px;\" src=\"http://65.2.28.16/api/uploads/logo.png\" alt=\"logo/\"><br><br><h2 style=\"color:#000;font-size:18px;font-weight: 500; margin: 15px 0;padding: 0;margin-left: 60px;\">ATTENTION - This message and any attached files may contain information that is confidential, legally privileged or proprietary. It is intended only for use by the intended recipient. If you are not the intended recipient or the person responsible for delivering the message to the intended recipient, be advised that you have received this message in error. Any dissemination, copying, use or re-transmission of this message or attachment, or the disclosure of any information therein, is strictly forbidden.<br> </h2></div><div  align=\"center\" style=\"padding-top: 15px;padding-bottom: 15px;background-color:#00125c;color: #fff;width:650px;\">©&nbsp;Copyright 2021 - <a style=\"color: #0398d5;\" >smart boating.com.</a></div></div></div>" 
};

transporter.sendMail(mailOptionsAdmin, function (error, info) {

   
    
}); 
//mail
     res.json({
         
         status:true,
         message: 'The booking has been successfully created'
     })
 })
 .catch(error => {
     res.json({
         message: error
     })
 })
      
}
else
{
    res.json({
            
        status:true,
        message: 'An existing booking already exists for this date. A new booking cannot be created'
    })

}



})
//Add
}
else
{
    res.json({
            
        status:true,
        message: 'An existing booking already exists for this date. A new booking cannot be created'
    })

}   }) 
                                    }
                                    else
                                    {
                                        res.json({
            
                                            status:true,
                                            message: 'An existing booking already exists for this date. A new booking cannot be created'
                                        })
                                    }
                                })
                                    }
                                    else
                                    {
                                        res.json({
            
                                            status:true,
                                            message: 'An existing booking already exists for this date. A new booking cannot be created'
                                        })
                                    }
 })
}

                        else//For Owner
                        {

                   
                           
                          Schedule.find({Boat_Id:Boat_id,IsActive:true,$or:[{start_NoTime:Start_final_withoutTime},{end_NoTime:End_final_withoutTime}]}).then(result=>
                            {
                                                   
                                console.log(result.length,'length')
                                var _Length=result.length;
                               if(_Length==0)
                                {
                                    Schedule.findOne({Boat_Id:Boat_id,start:{$gte:start_Date},end:{$lte:End_final_withoutTime},IsActive:true}).then(result2=>
                                        {
                                            if(result2==null)
                                        {
                                           
                                        Schedule.findOne({Boat_Id:Boat_id,start:{$lte:start_Date},end:{$gte:End_final_withoutTime},IsActive:true}).then(results=>
                                            {
                                            if(results==null)
                                            {

                                           Schedule.findOne({Boat_Id:Boat_id,IsActive:true,$or:[{end:{$gte:Start_final_withoutTime,$lte:End_final_withoutTime}},{start:{$gte:Start_final_withoutTime,$lte:End_final_withoutTime}}]}).then(results=>
                                                    {
                                                    if(results==null)
                                                    {
                                                
                                       

                                    Boats.findById({_id:mongoose.Types.ObjectId(Boat_id)}).then(response=>
                                        {  
                                            var SummerWeekdays=response.Summer_WeekDays;
                                            var SummerWeekendDays=response.Summer_WeekEndDays;
                                            var  WinterWeekDays=response.Winter_WeekDays;
                                            var WinterweekendDays=response.Winter_WeekEndDays;

                                            //SummerSeason_SDate:{$lte:Start_final_withoutTime},SummerSeason_EDate:{$gte:End_final_withoutTime},
                                            
                                            Boats.findOne({_id:Boat_id,IsActive:true}).then(async(Boatresults)=>
                                                {
                                                console.log(Boatresults)
                                                   
                                                let stopExecution = {stop:false}
                                                let isAvailableDay =  await checkIfIncludedInSeason(Boat_id,Owner_id,Boatresults.SummerSeason_SDate,Boatresults.SummerSeason_EDate,start_Date,end_Date).catch((error)=>{
                                                    console.log(error)
                                                    stopExecution = error
                                                })
                        
                        
                                                if(stopExecution.stop){
                                                    return res.json({status:true,message:stopExecution.error})
                                                }
                        
                                                if(isAvailableDay && isAvailableDay.status)//check Date Between Summer Dates
                                                {
        

                                                                                  
                                                consecutive.findOne({Boat_Id:mongoose.Types.ObjectId(Boat_id)})
                                                .then(element=> 
                                                    
                                                    {
                                                        if(element!=null)
                                                        {

                                                        
            
                                                        if(element.Summer_ConsecutiveDays>=Total_Count)//consecutive count
                                                        {
            
                                                     
if(PendingSummerWeekdays>=WeekDay_Count && PendingSummerWeekEnddays>=WeekEnd_Count)//count of weekday and week end
{

     
                    

//Add Summer Section

let Add_Schedule = new AddStandByBooking({ 
                                     
                                  
                                
       Boat_Id:mongoose.Types.ObjectId(req.body.Boat_Id),
       Booking_ID:globalbookingid,
       Boat_Name:req.body.Boat_Name,
       calendarId:mongoose.Types.ObjectId(req.body.calendarId),
       title:req.body.title,
       body:req.body.body,
       start:req.body.start,
        end:req.body.end,
        start_NoTime:Start_final,
        end_NoTime:End_final,
        goingDuration:req.body.goingDuration,
        comingDuration:req.body.comingDuration,
        isAllDay:req.body.isAllDay,
        category:req.body.category,
        dueDateClass:req.body.dueDateClass,
        location:req.body.location,
        attendees:req.body.attendees,
        recurrenceRule:req.body.recurrenceRule,
        Is_StandByBooking:req.body.Is_StandByBooking,
        Check_Status:req.body.Check_Status,
        commends:req.body.commends,
        isPending:req.body.isPending,
        isFocused:req.body.isFocused,
        isVisible:req.body.isVisible,
        isReadOnly:req.body.isReadOnly,
        isPrivate:req.body.isPrivate,
        color:req.body.color,
        bgColor:req.body.bgColor,
        dragBgColor:req.body.dragBgColor,
        borderColor:req.body.borderColor,
        customStyle:req.body.customStyle,
        raw:req.body.raw,
        state:req.body.state, 
        User_RoleType:req.body.User_RoleType,
        TotalDay_Count:Total_Count,
WeekDay_Count:WeekDay_Count,
WeekEnd_Count:WeekEnd_Count,
        User_Id:mongoose.Types.ObjectId(req.body.User_Id),
        Admin_Id:mongoose.Types.ObjectId(req.body.Admin_Id),
        Status:Module_status,
        specialDayCheck:req.body.specialDayCheck,
        IsActive: req.body.IsActive,
        Current_Time:moment(Date.now()),
        Updated_time: moment(Date.now())

});
 
Add_Schedule.save()
    .then(response => {

         //mail
 var transporter = nodemailer.createTransport({

    service: 'Gmail',
   
    auth: {                  
        user:"noreply.smartboatbooking@gmail.com",
        pass:"Smart@123!!!"
       
        
    }
    
});

var mailOptions = {
   
    from:"noreply.smartboatbooking@gmail.com",
    to: OwnerDetails.Email,
    subject: 'Standby Booking Request',
    html:"<div  style=\"border: 3px solid #dcdde0;border-bottom:0;font-weight: 100;font-family: roboto;width:650px;text-align:center;margin:0 auto;\"><div><img style=\"margin:10px 0 5px;padding: 24px;max-width: 40%;float: left;\" src=\"http://65.2.28.16/api/uploads/logo.png\" alt=\"logo\"></div><div><h1 style=\"width: 100%;font-weight: normal;padding:45px 0;margin-bottom: 20px;color: #7b7b7b;font-size: 20px;letter-spacing: 0.5px;\"><b>Phone No: 02 9997 5344</b></h1></div><hr><div><h2 style=\"color:#5564c6;font-size:25px;font-weight: 500; margin: 15px 0;padding: 0; color:00125c;\"> Successfully Booked.</h2><h2 style=\"color:#000;font-size:18px;font-weight: 500; margin: 15px 0;padding: 10px;text-align: left;margin-left: 46px;\">Dear " +' '+OwnerDetails.First_Name +' '+" the request for a standby Booking on Boat "+boatDetails.Boat_Name +"on " +' ' +moment().toLocaleString()+" has received by Smart Boating.It is pending review based on availability.You will be contacted with the outcome of the decision shortly." +".\n\n.</h2></div><table cellpadding=\"4\" cellspacing=\"0\" align=\"center\" style=\"color: #111;border: px solid #DDD;border: px solid #dcdde0;border-top:0;border-bottom: 0px;\" width=\"650\"><td width=\"150\">&nbsp;</td><td width=\"400\" align=\"center\" style=\"padding-top:10px;padding-bottom:30px;border: 1px solid gray;\"><h2  style=\"color: #FFF;background: #00125c;text-decoration: none;padding: 10px 15px;display: inline-block;width: 92%;    margin: 0px 0px 0px 0px;\">Booking Details</h2><p>Boat Name:"+boatDetails.Boat_Name +'\n'+' '+"BookingDate:"+moment().toLocaleString() +"</p><hr><p><br> BookingLink:\"http://65.2.28.16/boat-bookings\"</p></td><td width=\"150\">&nbsp;</td></table><div width=\"550\" align=\"left\" style=\"font-size: 20px;padding-bottom:5px;line-height: 24px;\"><h2 style=\"color:#000;font-size:18px;font-weight: 500; margin: 15px 0;padding: 0;margin-left: 60px;\">Please contact us at admin@smartboating.com.au or 02 9997 5344 if you have any questions<br></h2><h2 style=\"color:#000;font-size:18px;font-weight: 500; margin: 15px 0;padding: 0;margin: -14px 0px 0px 60px;\"></h2><h2 style=\"color:#000;font-size:18px;font-weight: 500; margin: 15px 0;padding: 0;margin: 0px 0px 0px 60px;\">Thanks</h2><img style=\"max-width: 40%;float: left;margin-left: 60px;\" src=\"http://65.2.28.16/api/uploads/logo.png\" alt=\"logo/\"><br><br><h2 style=\"color:#000;font-size:18px;font-weight: 500; margin: 15px 0;padding: 0;margin-left: 60px;\">ATTENTION - This message and any attached files may contain information that is confidential, legally privileged or proprietary. It is intended only for use by the intended recipient. If you are not the intended recipient or the person responsible for delivering the message to the intended recipient, be advised that you have received this message in error. Any dissemination, copying, use or re-transmission of this message or attachment, or the disclosure of any information therein, is strictly forbidden.<br> </h2></div><div  align=\"center\" style=\"padding-top: 15px;padding-bottom: 15px;background-color:#00125c;color: #fff;width:650px;\">©&nbsp;Copyright 2021 - <a style=\"color: #0398d5;\" >smart boating.com.</a></div></div></div>" 
                       
    
    
};

transporter.sendMail(mailOptions, function (error, info) {
   
});           

var mailOptionsAdmin = {
   
    from:"noreply.smartboatbooking@gmail.com",
     to: "admin@smartboating.com.au",
     subject: 'Standby Booking Request',
     html:"<div  style=\"border: 3px solid #dcdde0;border-bottom:0;font-weight: 100;font-family: roboto;width:650px;text-align:center;margin-left: 28%;\"><div><img style=\"margin:10px 0 5px;padding: 24px;max-width: 40%;float: left;\" src=\"http://65.2.28.16/api/uploads/logo.png\" alt=\"logo\"></div><div><h1 style=\"width: 100%;font-weight: normal;padding:45px 0;margin-bottom: 20px;color: #7b7b7b;font-size: 20px;letter-spacing: 0.5px;\"><b>Phone No: 02 9997 5344</b></h1></div><hr><div><h2 style=\"color:#5564c6;font-size:25px;font-weight: 500; margin: 15px 0;padding: 0; color:00125c;\"> Successfully Booked.</h2><h2 style=\"color:#000;font-size:18px;font-weight: 500; margin: 15px 0;padding: 10px;text-align: left;margin-left: 46px;\">Dear Adminsistrator the Owner " +' '+OwnerDetails.First_Name +' '+" on Boat "+boatDetails.Boat_Name +" has requested a standby booking on " +' ' +moment().toLocaleString() +".\n\n.</h2></div><table cellpadding=\"4\" cellspacing=\"0\" align=\"center\" style=\"color: #111;border: px solid #DDD;border: px solid #dcdde0;border-top:0;border-bottom: 0px;\" width=\"650\"><td width=\"150\">&nbsp;</td><td width=\"400\" align=\"center\" style=\"padding-top:10px;padding-bottom:30px;border: 1px solid gray;\"><h2  style=\"color: #FFF;background: #00125c;text-decoration: none;padding: 10px 15px;display: inline-block;width: 92%;    margin: 0px 0px 0px 0px;\">Booking Details</h2><p>Boat Name:"+boatDetails.Boat_Name +'\n'+' '+"BookingDate:"+moment().toLocaleString() +"</p><hr><p><br> BookingLink:\"http://65.2.28.16/boat-bookings\"</p></td><td width=\"150\">&nbsp;</td></table><div width=\"550\" align=\"left\" style=\"font-size: 20px;padding-bottom:5px;line-height: 24px;\"><h2 style=\"color:#000;font-size:18px;font-weight: 500; margin: 15px 0;padding: 0;margin-left: 60px;\">Please contact us at admin@smartboating.com.au or 02 9997 5344 if you have any questions<br></h2><h2 style=\"color:#000;font-size:18px;font-weight: 500; margin: 15px 0;padding: 0;margin: -14px 0px 0px 60px;\"></h2><h2 style=\"color:#000;font-size:18px;font-weight: 500; margin: 15px 0;padding: 0;margin: 0px 0px 0px 60px;\">Thanks</h2><img style=\"max-width: 40%;float: left;margin-left: 60px;\" src=\"http://65.2.28.16/api/uploads/logo.png\" alt=\"logo/\"><br><br><h2 style=\"color:#000;font-size:18px;font-weight: 500; margin: 15px 0;padding: 0;margin-left: 60px;\">ATTENTION - This message and any attached files may contain information that is confidential, legally privileged or proprietary. It is intended only for use by the intended recipient. If you are not the intended recipient or the person responsible for delivering the message to the intended recipient, be advised that you have received this message in error. Any dissemination, copying, use or re-transmission of this message or attachment, or the disclosure of any information therein, is strictly forbidden.<br> </h2></div><div  align=\"center\" style=\"padding-top: 15px;padding-bottom: 15px;background-color:#00125c;color: #fff;width:650px;\">©&nbsp;Copyright 2021 - <a style=\"color: #0398d5;\" >smart boating.com.</a></div></div></div>" 
};

transporter.sendMail(mailOptionsAdmin, function (error, info) {

   
    
}); 
//mail
        res.json({
            
            status:true,
            message: 'The booking has been successfully created'
        })
    })
    .catch(error => {
        res.json({
            message: error
        })
    })                              }//weekday,weekend
                                        else
                                            {
 
                                             res.json({
                                            status:false,
                                             message: 'Booking Days Exceeds limit'
                                                      })


                                             }
                                    }
                                    else
                                    {

                                        res.json({
                                            status:false,
                                            message: 'You Cannot Book This Much Number Of Days in One Booking'
                                        })


                                    }
                                }
                                else
                                {
                                    res.json({
                                        status:false,
                                        message: 'Consecutive days for this boat is Empty'
                                    })

                                }
                                    })
                                
                                        }
                                    

                            
                                            else
                                            {
                                                //WinterSeason_SDate:{$lte:Start_final_withoutTime},WinterSeason_EDate:{$gte:End_final_withoutTime}

                                                Boats.findOne({_id:Boat_id,IsActive:true}).then(async(BoatresultsWinter)=>
                                                    {
                                                   console.log(BoatresultsWinter);

                                             //list all winter start and end date of  owne  based on owner duration  duration which include all year

                      let stopExecution = {stop:false}
                      let isAvailableDay =  await checkIfIncludedInSeason(Boat_id,Owner_id,BoatresultsWinter.WinterSeason_SDate,BoatresultsWinter.WinterSeason_EDate,start_Date,end_Date).catch((error)=>{
                        console.log(error)
                        stopExecution = error
                    })

                    if(stopExecution.stop){
                        return res.json({status:true,message:stopExecution.error})
                    }
                              

                  
                                    if(isAvailableDay && isAvailableDay.status)//check Date Between winter Dates
                                    {
                                                   
                                                
                                            
                                                consecutive.findOne({Boat_Id:mongoose.Types.ObjectId(Boat_id)})
                                                .then(element=> 
                                                    
                                                    {
                                                        if(element!=null)
                                                        {

                                                if(element.Winter_ConsecutiveDays>=Total_Count)
                                                {
                                             
                                                    if(PendingWinterWeekdays>=WeekDay_Count && PendingWinterWeekenddays>=WeekEnd_Count)//count of weekday and week end
                                                    {
                                                    
                                                 
//Add Winter Section

let Add_Schedule = new AddStandByBooking({ 
                                     
                                  
                                
    Boat_Id:mongoose.Types.ObjectId(req.body.Boat_Id),
    Booking_ID:globalbookingid,
    Boat_Name:req.body.Boat_Name,
       calendarId:mongoose.Types.ObjectId(req.body.calendarId),
       title:req.body.title,
       body:req.body.body,
       start:req.body.start,
        end:req.body.end,
        start_NoTime:Start_final,
        end_NoTime:End_final,
        goingDuration:req.body.goingDuration,
        comingDuration:req.body.comingDuration,
        isAllDay:req.body.isAllDay,
        category:req.body.category,
        dueDateClass:req.body.dueDateClass,
        location:req.body.location,
        attendees:req.body.attendees,
        recurrenceRule:req.body.recurrenceRule,
        isPending:req.body.isPending,
        isFocused:req.body.isFocused,
        isVisible:req.body.isVisible,
        isReadOnly:req.body.isReadOnly,
        isPrivate:req.body.isPrivate,
        Is_StandByBooking:req.body.Is_StandByBooking,
        Check_Status:req.body.Check_Status,
        commends:req.body.commends,
        color:req.body.color,
        bgColor:req.body.bgColor,
        dragBgColor:req.body.dragBgColor,
        borderColor:req.body.borderColor,
        customStyle:req.body.customStyle,
        raw:req.body.raw,
        state:req.body.state, 
        User_RoleType:req.body.User_RoleType,
        TotalDay_Count:Total_Count,
WeekDay_Count:WeekDay_Count,
WeekEnd_Count:WeekEnd_Count,
        User_Id:mongoose.Types.ObjectId(req.body.User_Id),
        Admin_Id:mongoose.Types.ObjectId(req.body.Admin_Id),
        Status:Module_status,
        specialDayCheck:req.body.specialDayCheck,
        IsActive: req.body.IsActive,
        Current_Time:moment(Date.now()),
        Updated_time: moment(Date.now())

});
 
Add_Schedule.save()
    .then(response => {

         //mail
 var transporter = nodemailer.createTransport({

    service: 'Gmail',
   
    auth: {                  
        user:"noreply.smartboatbooking@gmail.com",
        pass:"Smart@123!!!"
       
        
    }
    
});

var mailOptions = {
   
    from:"noreply.smartboatbooking@gmail.com",
    to: OwnerDetails.Email,
    subject: 'Standby Booking Request',
    html:"<div  style=\"border: 3px solid #dcdde0;border-bottom:0;font-weight: 100;font-family: roboto;width:650px;text-align:center;margin:0 auto;\"><div><img style=\"margin:10px 0 5px;padding: 24px;max-width: 40%;float: left;\" src=\"http://65.2.28.16/api/uploads/logo.png\" alt=\"logo\"></div><div><h1 style=\"width: 100%;font-weight: normal;padding:45px 0;margin-bottom: 20px;color: #7b7b7b;font-size: 20px;letter-spacing: 0.5px;\"><b>Phone No: 02 9997 5344</b></h1></div><hr><div><h2 style=\"color:#5564c6;font-size:25px;font-weight: 500; margin: 15px 0;padding: 0; color:00125c;\"> Successfully Booked.</h2><h2 style=\"color:#000;font-size:18px;font-weight: 500; margin: 15px 0;padding: 10px;text-align: left;margin-left: 46px;\">Dear " +' '+OwnerDetails.First_Name +' '+" the request for a standby Booking on Boat "+boatDetails.Boat_Name +"on " +' ' +moment().toLocaleString()+" has received by Smart Boating.It is pending review based on availability.You will be contacted with the outcome of the decision shortly." +".\n\n.</h2></div><table cellpadding=\"4\" cellspacing=\"0\" align=\"center\" style=\"color: #111;border: px solid #DDD;border: px solid #dcdde0;border-top:0;border-bottom: 0px;\" width=\"650\"><td width=\"150\">&nbsp;</td><td width=\"400\" align=\"center\" style=\"padding-top:10px;padding-bottom:30px;border: 1px solid gray;\"><h2  style=\"color: #FFF;background: #00125c;text-decoration: none;padding: 10px 15px;display: inline-block;width: 92%;    margin: 0px 0px 0px 0px;\">Booking Details</h2><p>Boat Name:"+boatDetails.Boat_Name +'\n'+' '+"BookingDate:"+moment().toLocaleString() +"</p><hr><p><br> BookingLink:\"http://65.2.28.16/boat-bookings\"</p></td><td width=\"150\">&nbsp;</td></table><div width=\"550\" align=\"left\" style=\"font-size: 20px;padding-bottom:5px;line-height: 24px;\"><h2 style=\"color:#000;font-size:18px;font-weight: 500; margin: 15px 0;padding: 0;margin-left: 60px;\">Please contact us at admin@smartboating.com.au or 02 9997 5344 if you have any questions<br></h2><h2 style=\"color:#000;font-size:18px;font-weight: 500; margin: 15px 0;padding: 0;margin: -14px 0px 0px 60px;\"></h2><h2 style=\"color:#000;font-size:18px;font-weight: 500; margin: 15px 0;padding: 0;margin: 0px 0px 0px 60px;\">Thanks</h2><img style=\"max-width: 40%;float: left;margin-left: 60px;\" src=\"http://65.2.28.16/api/uploads/logo.png\" alt=\"logo/\"><br><br><h2 style=\"color:#000;font-size:18px;font-weight: 500; margin: 15px 0;padding: 0;margin-left: 60px;\">ATTENTION - This message and any attached files may contain information that is confidential, legally privileged or proprietary. It is intended only for use by the intended recipient. If you are not the intended recipient or the person responsible for delivering the message to the intended recipient, be advised that you have received this message in error. Any dissemination, copying, use or re-transmission of this message or attachment, or the disclosure of any information therein, is strictly forbidden.<br> </h2></div><div  align=\"center\" style=\"padding-top: 15px;padding-bottom: 15px;background-color:#00125c;color: #fff;width:650px;\">©&nbsp;Copyright 2021 - <a style=\"color: #0398d5;\" >smart boating.com.</a></div></div></div>" 
                       
    
    
};

transporter.sendMail(mailOptions, function (error, info) {
   
});           

var mailOptionsAdmin = {
   
    from:"noreply.smartboatbooking@gmail.com",
     to: "admin@smartboating.com.au",
     subject: 'Standby Booking Request',
     html:"<div  style=\"border: 3px solid #dcdde0;border-bottom:0;font-weight: 100;font-family: roboto;width:650px;text-align:center;margin:0 auto;\"><div><img style=\"margin:10px 0 5px;padding: 24px;max-width: 40%;float: left;\" src=\"http://65.2.28.16/api/uploads/logo.png\" alt=\"logo\"></div><div><h1 style=\"width: 100%;font-weight: normal;padding:45px 0;margin-bottom: 20px;color: #7b7b7b;font-size: 20px;letter-spacing: 0.5px;\"><b>Phone No: 02 9997 5344</b></h1></div><hr><div><h2 style=\"color:#5564c6;font-size:25px;font-weight: 500; margin: 15px 0;padding: 0; color:00125c;\"> Successfully Booked.</h2><h2 style=\"color:#000;font-size:18px;font-weight: 500; margin: 15px 0;padding: 10px;text-align: left;margin-left: 46px;\">Dear Adminsistrator the Owner " +' '+OwnerDetails.First_Name +' '+" on Boat "+boatDetails.Boat_Name +" has requested a standby booking on " +' ' +moment().toLocaleString() +".\n\n.</h2></div><table cellpadding=\"4\" cellspacing=\"0\" align=\"center\" style=\"color: #111;border: px solid #DDD;border: px solid #dcdde0;border-top:0;border-bottom: 0px;\" width=\"650\"><td width=\"150\">&nbsp;</td><td width=\"400\" align=\"center\" style=\"padding-top:10px;padding-bottom:30px;border: 1px solid gray;\"><h2  style=\"color: #FFF;background: #00125c;text-decoration: none;padding: 10px 15px;display: inline-block;width: 92%;    margin: 0px 0px 0px 0px;\">Booking Details</h2><p>Boat Name:"+boatDetails.Boat_Name +'\n'+' '+"BookingDate:"+moment().toLocaleString() +"</p><hr><p><br> BookingLink:\"http://65.2.28.16/boat-bookings\"</p></td><td width=\"150\">&nbsp;</td></table><div width=\"550\" align=\"left\" style=\"font-size: 20px;padding-bottom:5px;line-height: 24px;\"><h2 style=\"color:#000;font-size:18px;font-weight: 500; margin: 15px 0;padding: 0;margin-left: 60px;\">Please contact us at admin@smartboating.com.au or 02 9997 5344 if you have any questions<br></h2><h2 style=\"color:#000;font-size:18px;font-weight: 500; margin: 15px 0;padding: 0;margin: -14px 0px 0px 60px;\"></h2><h2 style=\"color:#000;font-size:18px;font-weight: 500; margin: 15px 0;padding: 0;margin: 0px 0px 0px 60px;\">Thanks</h2><img style=\"max-width: 40%;float: left;margin-left: 60px;\" src=\"http://65.2.28.16/api/uploads/logo.png\" alt=\"logo/\"><br><br><h2 style=\"color:#000;font-size:18px;font-weight: 500; margin: 15px 0;padding: 0;margin-left: 60px;\">ATTENTION - This message and any attached files may contain information that is confidential, legally privileged or proprietary. It is intended only for use by the intended recipient. If you are not the intended recipient or the person responsible for delivering the message to the intended recipient, be advised that you have received this message in error. Any dissemination, copying, use or re-transmission of this message or attachment, or the disclosure of any information therein, is strictly forbidden.<br> </h2></div><div  align=\"center\" style=\"padding-top: 15px;padding-bottom: 15px;background-color:#00125c;color: #fff;width:650px;\">©&nbsp;Copyright 2021 - <a style=\"color: #0398d5;\" >smart boating.com.</a></div></div></div>" 
};

transporter.sendMail(mailOptionsAdmin, function (error, info) {

   
    
}); 
//mail
        res.json({
            
            status:true,
            message: 'The booking has been successfully created'
        })
    })
    .catch(error => {
        res.json({
            message: error
        })
    })

                                                    }//weekday weekend count
                                                    else{

                                                        res.json({
                                                            status:false,
                                                             message: 'Booking Days Exceeds limit'
                                                                })
                
                
                                                             
                                                    }
//Add Winter Section
}
                                              
else
{

    res.json({
        status:false,
        message: 'You Cannot Book This Much Number Of Days in One Booking'
    })

}
                                                        }
                                                        else
                                                        {
                                                          res.json({
                                                                status:false,
                                                                message: 'Consecutive days for this boat is Empty'
                                                            })
                                                        }
})                                     }
                                          else
                                          {
                                            res.json({
                                                status:false,
                                                message: 'These Dates Are not Allowed for Booking'
                                            })
                                          }
                                        })
                                        }//else


                                            
                                        });
                                    })
                                }
                                else
                                {
                                    res.json({
                                        status:false,
                                        message: 'An existing booking already exists for this date. A new booking cannot be created'
                                    })
                                }
                                                  
                                    })
                                    }
                                    else
                                    {

                                        res.json({
                                            status:false,
                                            message: 'An existing booking already exists for this date. A new booking cannot be created'
                                        })

                                    }

                                })
                            }
                            else
                            {
                                res.json({
                                    status:false,
                                    message: 'An existing booking already exists for this date. A new booking cannot be created'
                                })

                            }
                    
                         
                            });//else inside function owner


                        }
                        else
                        {
                            res.json({
                                status:false,
                                message: 'An existing booking already exists for this date. A new booking cannot be created'
                            })
                        }

                        });
                        }

                        }
                    
                    
                        else {
                            res.json({
                                status:false,
                                message: 'You Cannot Select Previous Date'
                            })
                        } 
                        
                    }

              if(check_Status="4" && User_role=="Maintenance" )
              {
                Schedule.find({Boat_Id:Boat_id,IsActive:true,$or:[{start_NoTime:Start_final_withoutTime},{end_NoTime:End_final_withoutTime}]}).then(result=>
                    {
                      
                        console.log(result.length,'length')
                        var _Length=result.length;
                       if(_Length==0)
                       {
                           Schedule.findOne({Boat_Id:Boat_id,start:{$gte:start_Date},end:{$lte:End_final_withoutTime},IsActive:true}).then(result2=>
                               {
                                   if(result2==null)
                               {
                           
                           Schedule.findOne({Boat_Id:Boat_id,start:{$lte:start_Date},end:{$gte:End_final_withoutTime},IsActive:true}).then(results=>
                               {
                               if(results==null)
                               {
                                   Schedule.findOne({Boat_Id:Boat_id,IsActive:true,$or:[{end:{$gte:Start_final_withoutTime,$lte:End_final_withoutTime}},{start:{$gte:Start_final_withoutTime,$lte:End_final_withoutTime}}]}).then(results=>
                                       {
                                       if(results==null)
                                       {
                                       
                                    
//Add 
console.log('Admin')
let Add_Schedule = new AddStandByBooking({ 
                        
       
                   
Boat_Id:mongoose.Types.ObjectId(req.body.Boat_Id),
Booking_ID:globalbookingid,
Boat_Name:req.body.Boat_Name,
calendarId:mongoose.Types.ObjectId(req.body.calendarId),
title:req.body.title,
body:req.body.body,
start:req.body.start,
end:req.body.end,
start_NoTime:Start_final_withoutTime,
end_NoTime:Start_final_withoutTime,
goingDuration:req.body.goingDuration,
comingDuration:req.body.comingDuration,
isAllDay:req.body.isAllDay,
category:req.body.category,
dueDateClass:req.body.dueDateClass,
location:req.body.location,
attendees:req.body.attendees,
recurrenceRule:req.body.recurrenceRule,
isPending:req.body.isPending,
isFocused:req.body.isFocused,
isVisible:req.body.isVisible,
isReadOnly:req.body.isReadOnly,
isPrivate:req.body.isPrivate,
color:req.body.color,
Is_StandByBooking:req.body.Is_StandByBooking,
Check_Status:req.body.Check_Status,
commends:req.body.commends,
bgColor:req.body.bgColor,
dragBgColor:req.body.dragBgColor,
borderColor:req.body.borderColor,
customStyle:req.body.customStyle,
raw:req.body.raw,
state:req.body.state, 
User_RoleType:req.body.User_RoleType,
TotalDay_Count:Total_Count,
WeekDay_Count:WeekDay_Count,
WeekEnd_Count:WeekEnd_Count,
User_Id:mongoose.Types.ObjectId(req.body.User_Id),
Admin_Id:mongoose.Types.ObjectId(req.body.Admin_Id),
Status:Module_status,
specialDayCheck:req.body.specialDayCheck,
IsActive: req.body.IsActive,
Current_Time:moment(Date.now()),
Updated_time: moment(Date.now())

});

Add_Schedule.save()
.then(response => {
res.json({

status:true,
message: 'The booking has been successfully created'
})
})
.catch(error => {
res.json({
message: error
})
})

}
else
{
res.json({

status:true,
message: 'An existing booking already exists for this date. A new booking cannot be created'
})

}



})
//Add
}
else
{
res.json({

status:true,
message: 'An existing booking already exists for this date. A new booking cannot be created'
})

}   }) 
                       }
                       else
                       {
                           res.json({

                               status:true,
                               message: 'An existing booking already exists for this date. A new booking cannot be created'
                           })
                       }
                   })
                       }
                       else
                       {
                           res.json({

                               status:true,
                               message: 'An existing booking already exists for this date. A new booking cannot be created'
                           })
                       }
})

              }

            }

            else
            {
    
                res.json({
                    status:false,
                    message: 'You Have Already Booked'
                })
    
            }
        })

            
        }
        else
        {

            res.json({
                status:false,
                message: 'Boat Selected is not Active'
            })

        }
   
    });
});
    };



        const ViewStandByBooking = (req, res, next) => { 

            mongoose.model('Tb_AddStandByBooking').aggregate(
            [
            {
            "$lookup":{
            "from":"tb_addowners",
            "localField": "User_Id",
            "foreignField": "_id",
            "as": "OwnerDetails"
            }
           },
            {
                "$lookup": {
                    "from": "tb_boatmasters",
                    "localField": "Boat_Id",
                    "foreignField": "_id",
                    "as": "BoatDetails"
                }
            },
            
                
                {$sort: {"start": -1}},
            
            {
            $project:{
                calendarId:1,start:1,end:1,start_NoTime:1,end_NoTime:1,category:1,dueDateClass:1,User_RoleType:1,Current_Time:1,Updated_time:1,Is_StandByBooking:1,IsActive:1,Booking_ID:1,BookingStatus:1,
            "OwnerDetails.Profile_Image":1,
            "OwnerDetails.First_Name":1,
            "OwnerDetails.Mobile":1,
            "OwnerDetails.Parking_Ability":1,
            "OwnerDetails.Sailing_Ability":1,
            "OwnerDetails.Last_Name":1,
            "OwnerDetails.Family_Name":1,
            "OwnerDetails.Emergency_Contact_Mobile":1,
            "OwnerDetails.Email":1,
            "OwnerDetails.Emergency_Contact_Name":1,
            "OwnerDetails.Home_Address":1,
            "OwnerDetails.Housekeeping":1,
            "BoatDetails._id":1, 
            "BoatDetails.Location_Name":1,
            "BoatDetails.Boattype_Name":1,
            "BoatDetails.Location_Id":1,
            "BoatDetails.Boattype_id":1,
            "BoatDetails.Boat_Name": 1,
            "BoatDetails.Boat_Number": 1,
            "BoatDetails.Boat_Facility":1,
            "BoatDetails.Boat_Description":1,
            "BoatDetails. Owners_Allowed": 1,
            "BoatDetails.Launch_Date": 1,
            "BoatDetails.PreLaunch_Date":1,
            "BoatDetails.Boat_Image": 1,
            "BoatDetails.Boat_HandBook":1,
            "BoatDetails.Boat_Status":1,
            "BoatDetails.Total_Days":1,
            "BoatDetails.IsActive":1,
            "BoatDetails.Summer_WeekDays":1,
            "BoatDetails. Summer_WeekEndDays":1,
            "BoatDetails.Winter_WeekDays":1,
            "BoatDetails.Winter_WeekEndDays":1,
            
            
                  
            }
            }
            ]
            ).exec(function(err, response){
                      
            if (err)
            {
                res.json({
                    status:false,
                    message: err
                })
            }
            else
            {
                
        
        
                res.json({
                    status:true,
                    response
                })
            
            }
        
             })
        }      

        

module.exports = {AddStandByBookings,ViewStandByBooking}
 
    