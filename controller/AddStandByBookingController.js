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
const moment  = require('moment-timezone');
const momentTimezone = require('moment-timezone');
const async = require('async');
const consecutive = require('../models/ConsecutiveDaysModel');
const PreLaunchAndLaunchBookingDays = require('../models/BookingDaysForLaunchPreLaunchModels')
const OwnerBooking_Days=require('../models/OwnerBookingDates');
const Duration = require("../models/OwnershipDuration");
const NewOwners = require('../models/AddOwnerModel');
const nodemailer = require('nodemailer')
const { checkIfIncludedInSeason,checkPrelaunchLaunchConsecutiveDays } = require('./ScheduleController')
const {getNormalDate, getDaysBetweenDates,getBookingIsFromWhichSeasonBasedOnStartDate,getCurrentTimeFormatted,getNumberOfWeekDaysAndWeekendsFromDates } = require('../util/dateHelper');
const transporter = require('../email/transporter');
const getEmailTemplate = require('../email/emailTemplate');

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
    console.log(req.body.Special_Day,"-----Specilaaa");
   var check_Status=req.body.Check_Status;
   const globalbookingid=await GetNextBookingID();
    
    var Total_Count=Number(req.body.TotalDay_Count);
    var WeekDay_Count=Number(req.body.WeekDay_Count);
    var WeekEnd_Count= Number(req.body.WeekEnd_Count);
    var User_role=req.body.User_RoleType;
    var Boat_id=req.body.Boat_Id;
    var Owner_id=req.body.User_Id;
    var start_Date=req.body.start;
   
    var end_Date=req.body.end;
var TodaysDate= moment();
 var CurrentDate=moment(TodaysDate).format('DD-MM-YYYY');
 

    /* Check Onwr duration */
    if(User_role == "Owner"){

        let getOwnerStatus = await NewOwners.findOne({_id:mongoose.Types.ObjectId(Owner_id)},{Status:1}).catch((error)=> console.log(error));
        if((getOwnerStatus.Status == 2)||(getOwnerStatus.Status == 0))
        return res.json({
           status: false,
           message: 'Permission Denied'
       }) 

        let ownerdurationCheck = await Duration.findOne({Boat_Id: Boat_id,Owner_Id:Owner_id,IsActive:true}).catch((error) => console.log(error));
        if(!ownerdurationCheck || ownerdurationCheck==null){

            return res.json({
                status:false,
                message: 'Please set Ownership duration'
             });

        }else{

            let userEnddate = momentTimezone(end_Date).tz(process.env.TIME_ZONE).format();
            let AusUserenddate = moment(userEnddate);
             AusUserenddate.startOf('day');

             let userStartDate = momentTimezone(start_Date).tz(process.env.TIME_ZONE).format();
             let AususerStartDate = moment(userStartDate);
             AususerStartDate.startOf('day');

             console.log(AusUserenddate,'AusUserenddate');
             console.log(AususerStartDate,'AususerStartDate');
             console.log(AusUserenddate,'AusUserenddate');
             console.log( ownerdurationCheck.From_Date,' ownerdurationCheckFrom_DateuserStartDate');
             console.log( ownerdurationCheck.To_Date,'  ownerdurationCheckTo_Date');


             if(AususerStartDate < ownerdurationCheck.From_Date || AusUserenddate > ownerdurationCheck.To_Date){

                return res.json({
                    status: false,
                    message: 'These dates are not available..'
                });

             }


          
        }
       
    /* check boat is suspended */
    let suspendcheck = await manageBoat.findOne({Boat_Id: Boat_id,Owner_Id:Owner_id}).catch((error) => console.log(error));
    
    if(suspendcheck.Block == false)
    return res.json({
     status:false,
     message: 'Suspended'
    })
    
      
       }
    



//var start_Date_NoTime=new Date(start_Date);
//console.log(start_Date_NoTime.toString(),'hi');
var Start_final=moment(start_Date);
var Start_final_withoutTime=Start_final.startOf('day');

// var end_Date_NoTime=new Date(end_Date);
var End_final=moment(end_Date);
var End_final_withoutTime=End_final.startOf('day');

var dif=Start_final.diff(moment(),'days')



    const dayBeforeIncomingStartDate = new Date(new Date(new Date(start_Date).setDate(new Date(start_Date).getDate() -1)).setUTCHours(00,00,00,00));
    const dayAfterIncomingEndDate = new Date(new Date(new Date(end_Date).setDate(new Date(end_Date).getDate() +1)).setUTCHours(00,00,00,00));

      //stand by booking before and after

      const standByBookingBeforeStandByBooking = await AddStandByBooking.findOne({Boat_Id:Boat_id,User_Id:Owner_id,IsActive:true,showThisBookingInCalendar:true,$and:[{start_NoTime:{$lte:dayBeforeIncomingStartDate}},{end_NoTime:{$gte:dayBeforeIncomingStartDate}}]}).catch((error)=> console.log(error))
      const standByBookingAfterStandByBooking = await AddStandByBooking.findOne({Boat_Id:Boat_id,User_Id:Owner_id,IsActive:true,showThisBookingInCalendar:true,$and:[{start_NoTime:{$lte:dayAfterIncomingEndDate}},{end_NoTime:{$gte:dayAfterIncomingEndDate}}]}).catch((error)=> console.log(error))

      const boatData = await Boats.findOne({_id:Boat_id,IsActive:true},{SummerSeason_SDate:1,SummerSeason_EDate:1,Launch_Date:1}).catch((error)=> console.log(error));
       
      if(!boatData) return res.json({status:false,message:"Invalid boat."});
      
      const launchDate =  new Date(boatData.Launch_Date).getTime();
      
      let tempObj = {
        status: true
    }

      let isBookingBeforeLaunchDate = await checkPrelaunchLaunchConsecutiveDays(boatData.Launch_Date,start_Date,end_Date,Boat_id,Owner_id).catch(error =>{
        console.log(error);
        tempObj.status = false;
        tempObj.message = error.message;
        
      });

      if(tempObj.status == false){
        return res.json({status:false,message:tempObj.message});
    }

  
     
      if(isBookingBeforeLaunchDate.isBookingBeforeLaunchDate == false){


     // check consecutive days in normal booking and if the booking exceeds consecutive day throw an error

      
      const consecutiveDays = await consecutive.findOne({Boat_Id:Boat_id,IsActive:true}).catch((error)=> console.log(error))
      
      if(!consecutiveDays) return res.json({status:false,message:"Set consecutive days."});

     
      
      let  incomingTotalDays = moment(new Date(end_Date)).diff(moment(new Date(start_Date)),"days") + 1;
      
      
      const bookingBeforeStandByBooking = await Schedule.findOne({Boat_Id:Boat_id,User_Id:Owner_id,IsActive:true,$and:[{start_NoTime:{$lte:dayBeforeIncomingStartDate}},{end_NoTime:{$gte:dayBeforeIncomingStartDate}}]}).catch((error)=> console.log(error))
      const bookingAfterStandByBooking = await Schedule.findOne({Boat_Id:Boat_id,User_Id:Owner_id,IsActive:true,$and:[{start_NoTime:{$lte:dayAfterIncomingEndDate}},{end_NoTime:{$gte:dayAfterIncomingEndDate}}]}).catch((error)=> console.log(error))
      
      if(bookingBeforeStandByBooking){
          incomingTotalDays +=  moment(new Date(bookingBeforeStandByBooking.end_NoTime)).diff(moment(new Date(bookingBeforeStandByBooking.start_NoTime)),"days") + 1
        }
        
        if(bookingAfterStandByBooking){
            incomingTotalDays +=  moment(new Date(bookingAfterStandByBooking.end_NoTime)).diff(moment(new Date(bookingAfterStandByBooking.start_NoTime)),"days") + 1
        }
        
        if(standByBookingBeforeStandByBooking){
            incomingTotalDays +=  moment(new Date(standByBookingBeforeStandByBooking.end_NoTime)).diff(moment(new Date(standByBookingBeforeStandByBooking.start_NoTime)),"days") + 1
        } 
        
        if(standByBookingAfterStandByBooking){
            incomingTotalDays +=  moment(new Date(standByBookingAfterStandByBooking.end_NoTime)).diff(moment(new Date(standByBookingAfterStandByBooking.start_NoTime)),"days") + 1
        }
        
        console.log(incomingTotalDays,"incomingTotalDays one")
        
        //decide booking is from summer or winter
        
        let {isIncludedInSummer} = getBookingIsFromWhichSeasonBasedOnStartDate(boatData.SummerSeason_SDate,boatData.SummerSeason_EDate,req.body.start) || {} ;
        
        if(isIncludedInSummer){
         
           
             if(incomingTotalDays > consecutiveDays.Summer_ConsecutiveDays) return res.json({status:false,message:"The booking exceeds the maximum booking duration. Please try to create a booking with fewer days."});
         }else{
            
           if(incomingTotalDays > consecutiveDays.Winter_ConsecutiveDays) return res.json({status:false,message:"The booking exceeds the maximum booking duration. Please try to create a booking with fewer days."});
         }


    }

    
    


    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    //check if this booking already exist or any of these days already booked in standby booking in this boat

    //create query to check if these days are booked or not

    const checkIfAlreadyBookedQuery = []

    /* commnetd becasue allIncomingBookingDays were not defined 18-10-21*/

    /*allIncomingBookingDays.map((date)=> checkIfAlreadyBookedQuery.push({$and:[{start_NoTime:{$lte:new Date(date)}},{end_NoTime:{$gte:new Date(date)}}]}));

    const existingBooking = await AddStandByBooking.findOne({Boat_Id:Boat_id,$or:checkIfAlreadyBookedQuery,BookingStatus:{$ne:"Rejected"},isOrginalBookingCanceled:false}).catch((error)=> console.log(error))
 const existingBooking = await AddStandByBooking.findOne({Boat_Id:Boat_id,$or:checkIfAlreadyBookedQuery,BookingStatus:{$ne:"Rejected"},isOrginalBookingCanceled:false}).catch((error)=> console.log(error))*/

 /* commnetd becasue allIncomingBookingDays were not defined 18-10-21*/

 

    const existingBooking = await AddStandByBooking.findOne({Boat_Id:Boat_id,isOrginalBookingCanceled:false}).catch((error)=> console.log(error));


    if(existingBooking){

        console.log( moment(existingBooking.start_NoTime).format("X"),"existingBooking.start_NoTime");
        console.log(moment(existingBooking.end_NoTime).format("X"),"existingBooking.end_NoTime");
        console.log(moment(Start_final_withoutTime).format("X"),"Start_final_withoutTime.end_NoTime");
        console.log(moment(End_final_withoutTime).format("X"),"End_final_withoutTime");


         if((moment(Start_final_withoutTime).format("X")>=moment(existingBooking.start_NoTime).format("X"))&&(moment(Start_final_withoutTime).format("X")<=moment(existingBooking.end_NoTime).format("X"))||(moment(End_final_withoutTime).format("X")>=moment(existingBooking.start_NoTime).format("X"))&&(moment(End_final_withoutTime).format("X")<=moment(existingBooking.end_NoTime).format("X"))){

            return res.json({
                status:false,
                message: 'An existing booking already exists for this date. A new booking cannot be created.'
            })

         }
     
   
    }


    ////////////////////////////////////////////////////////////////////////////////////////////////////

    //merge syamd by bookings

    //if stand by booking found before incoming booking then delete previous booking from db and create a new one change start date to previous one


    console.log("before merge")

    if(standByBookingBeforeStandByBooking){

        console.log("standByBookingBeforeStandByBooking found")

    req.body.TotalDay_Count = parseInt(req.body.TotalDay_Count) + parseInt(standByBookingBeforeStandByBooking.TotalDay_Count);
    req.body.WeekDay_Count = parseInt(req.body.WeekDay_Count) + parseInt(standByBookingBeforeStandByBooking.WeekDay_Count);
    req.body.WeekEnd_Count = parseInt(req.body.WeekEnd_Count) + parseInt(standByBookingBeforeStandByBooking.WeekEnd_Count);
    req.body.start = standByBookingBeforeStandByBooking.start
    
    Total_Count = req.body.TotalDay_Count;
    WeekDay_Count = req.body.WeekDay_Count;
    WeekEnd_Count = req.body.WeekEnd_Count;
    start_Date = req.body.start;
    Start_final = moment(start_Date);
    Start_final_withoutTime = Start_final.startOf('day');

    console.log(standByBookingBeforeStandByBooking,"standByBookingBeforeStandByBooking")
        
    await AddStandByBooking.deleteOne({_id:standByBookingBeforeStandByBooking._id}).catch((error)=> console.log(error))
    }

    if(standByBookingAfterStandByBooking){

        console.log("standByBookingAfterStandByBooking found")

    req.body.TotalDay_Count = parseInt(req.body.TotalDay_Count) + parseInt(standByBookingAfterStandByBooking.TotalDay_Count);
    req.body.WeekDay_Count = parseInt(req.body.WeekDay_Count) + parseInt(standByBookingAfterStandByBooking.WeekDay_Count);
    req.body.WeekEnd_Count = parseInt(req.body.WeekEnd_Count) + parseInt(standByBookingAfterStandByBooking.WeekEnd_Count);
    req.body.end = standByBookingAfterStandByBooking.end

    Total_Count = req.body.TotalDay_Count;
    WeekDay_Count = req.body.WeekDay_Count;
    WeekEnd_Count = req.body.WeekEnd_Count;
    end_Date = req.body.end; 
    End_final = moment(end_Date);
    End_final_withoutTime = End_final.startOf('day'); 

    console.log(standByBookingAfterStandByBooking,"standByBookingAfterStandByBooking")

    await AddStandByBooking.deleteOne({_id:standByBookingAfterStandByBooking._id}).catch((error)=> console.log(error))
    }

    

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

     if(req.body.specialDayCheck == 1){
        const obj = req.body.Special_Day;
         var SpecialDayid = obj[0]._id;
     }
     else{
        var SpecialDayid=0;
        
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
            specialDayId: SpecialDayid,
            IsActive: req.body.IsActive,
            Current_Time:moment(Date.now()),
            Updated_time: moment(Date.now()),
            isOrginalBookingCanceled:false
            
            });
            
            Add_Schedule.save()
            .then(response => {
            
             //mail
                       const emailState =  'Successfully Booked.';
                       const emailContent = `Dear ${OwnerDetails.First_Name},<p> The request for a standby Booking on ${boatDetails.Boat_Name} at  ${getCurrentTimeFormatted()} has received by Smart Boating.It is pending review based on availability.You will be contacted with the outcome of the decision shortly</p>`;
                       const emailContentAdmin = `Dear Adminsistrator,<p> The Owner ${OwnerDetails.First_Name} has requested a standby booking on ${boatDetails.Boat_Name}  at  ${getCurrentTimeFormatted()}`;
                       const emailDetailName = 'Booking Details'
                       const emailDetails = [
                         { key: 'Boat Name', value: boatDetails.Boat_Name },
                         { key: 'Booking Date',value: getNormalDate(req.body.start)+" - "+ getNormalDate(req.body.end)},
                       ];
                       const emailNameAndLink = {
                         name:'Booking Link',
                         link:`${process.env.CLIENT_URL}/boat-bookings`
                       }
            
                       
            
            var mailOptions = {
               
                from:"noreply.smartboatbooking@gmail.com",
                to: OwnerDetails.Email,
                subject: 'Standby Booking Request',
                html: getEmailTemplate(emailState,emailContent,emailDetailName,emailDetails,emailNameAndLink)
                                   
                
                
            };
            
            
            transporter.sendMail(mailOptions, function (error, info) {});           
            
            var mailOptionsAdmin = {
               
                from:"noreply.smartboatbooking@gmail.com",
                 to: "admin@smartboating.com.au",
                 subject: 'Standby Booking Request',
                 html: getEmailTemplate(emailState,emailContentAdmin,emailDetailName,emailDetails,emailNameAndLink)
            };
            
            transporter.sendMail(mailOptionsAdmin, function (error, info) {}); 
            //mail
            res.json({
                        
                status:true,
                message: 'The booking has been successfully created'
            })
            
            
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
specialDayId: SpecialDayid,
IsActive: req.body.IsActive,
Current_Time:moment(Date.now()),
Updated_time: moment(Date.now()),
isOrginalBookingCanceled:false

});

Add_Schedule.save()
.then(response => {

     //mail
           const emailState =  'Successfully Booked.';
           const emailContent = `Dear ${OwnerDetails.First_Name},<p> The request for a standby Booking on ${boatDetails.Boat_Name} at ${getCurrentTimeFormatted()} has received by Smart Boating.It is pending review based on availability.You will be contacted with the outcome of the decision shortly</p>`;
           const emailContentAdmin = `Dear Adminsistrator,<p> The Owner ${OwnerDetails.First_Name} has requested a standby booking on  ${boatDetails.Boat_Name}  at  ${getCurrentTimeFormatted()}</p>`;
           const emailDetailName = 'Booking Details'
           const emailDetails = [
             { key: 'Boat Name', value: boatDetails.Boat_Name },
             { key: 'Booking Date',value: getNormalDate(req.body.start)+" - "+ getNormalDate(req.body.end)},
           ];
           const emailNameAndLink = {
             name:'Booking Link',
             link:`${process.env.CLIENT_URL}/boat-bookings`
           }


var mailOptions = {
   
    from:"noreply.smartboatbooking@gmail.com",
    to: OwnerDetails.Email,
    subject: 'Standby Booking Request',
    html:getEmailTemplate(emailState,emailContent,emailDetailName,emailDetails,emailNameAndLink)
                       
    
    
};

transporter.sendMail(mailOptions, function (error, info) {
   
});           


var mailOptionsAdmin = {
   
    from:"noreply.smartboatbooking@gmail.com",
     to: "admin@smartboating.com.au",
     subject: 'Standby Booking Request',
     html: getEmailTemplate(emailState,emailContentAdmin,emailDetailName,emailDetails,emailNameAndLink) 
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
Updated_time: moment(Date.now()),
isOrginalBookingCanceled:false

});

Add_Schedule.save()
.then(response => {

 //mail
           const emailState =  'Successfully Booked.';
           const emailContent = `Dear ${OwnerDetails.First_Name},<p> the request for a standby Booking on Boat ${boatDetails.Boat_Name} on ${getCurrentTimeFormatted()} has received by Smart Boating.It is pending review based on availability.You will be contacted with the outcome of the decision shortly<p>`;
           const emailContentAdmin = `Dear Adminsistrator,<p> The Owner ${OwnerDetails.First_Name} has requested a standby booking on ${boatDetails.Boat_Name}  at  ${getCurrentTimeFormatted()}</p>`;
           const emailDetailName = 'Booking Details'
           const emailDetails = [
             { key: 'Boat Name', value: boatDetails.Boat_Name },
             { key: 'Booking Date',value: getNormalDate(req.body.start)+" - "+ getNormalDate(req.body.end)},
           ];
           const emailNameAndLink = {
             name:'Booking Link',
             link:`${process.env.CLIENT_URL}/boat-bookings`
           }

var mailOptions = {
   
    from:"noreply.smartboatbooking@gmail.com",
    to: OwnerDetails.Email,
    subject: 'Standby Booking Request',
    html: getEmailTemplate(emailState,emailContent,emailDetailName,emailDetails,emailNameAndLink)
                       
    
    
};

transporter.sendMail(mailOptions, function (error, info) {
   
});           


var mailOptionsAdmin = {
   
    from:"noreply.smartboatbooking@gmail.com",
     to: "admin@smartboating.com.au",
     subject: 'Standby Booking Request',
     html: getEmailTemplate(emailState,emailContentAdmin,emailDetailName,emailDetails,emailNameAndLink)
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
     Updated_time: moment(Date.now()),
     isOrginalBookingCanceled:false

});

Add_Schedule.save()
 .then(response => {

     //mail

     const emailState =  'Successfully Booked.';
     const emailContent = `Dear ${OwnerDetails.First_Name},<p> The request for a standby Booking on  ${boatDetails.Boat_Name} at ${getCurrentTimeFormatted()} has received by Smart Boating.It is pending review based on availability.You will be contacted with the outcome of the decision shortly</p>`;
     const emailContentAdmin = `Dear Adminsistrator,<p> The Owner ${OwnerDetails.First_Name} on  ${boatDetails.Boat_Name} has requested a standby booking at  ${getCurrentTimeFormatted()}</p>`;
     const emailDetailName = 'Booking Details'
     const emailDetails = [
       { key: 'Boat Name', value: boatDetails.Boat_Name },
       { key: 'Booking Date',value: getNormalDate(req.body.start)+" - "+ getNormalDate(req.body.end)},
     ];
     const emailNameAndLink = {
       name:'Booking Link',
       link:`${process.env.CLIENT_URL}/boat-bookings`
     }

var mailOptionsAdmin = {
   
    from:"noreply.smartboatbooking@gmail.com",
     to: "admin@smartboating.com.au",
     subject: 'Standby Booking Request',
     html: getEmailTemplate(emailState,emailContentAdmin,emailDetailName,emailDetails,emailNameAndLink)
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
                                                console.log(isAvailableDay.type,"------------------TYY");
                        
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
        Updated_time: moment(Date.now()),
        isOrginalBookingCanceled:false

});
 
Add_Schedule.save()
    .then(response => {

         //mail
         const emailState =  'Successfully Booked.';
         const emailContent = `Dear ${OwnerDetails.First_Name},<p> the request for a standby Booking on Boat ${boatDetails.Boat_Name} on ${getCurrentTimeFormatted()} has received by Smart Boating.It is pending review based on availability.You will be contacted with the outcome of the decision shortly</p>`;
         const emailContentAdmin = `Dear Adminsistrator,<p> The Owner ${OwnerDetails.First_Name} on Boat ${boatDetails.Boat_Name} has requested a standby booking at  ${getCurrentTimeFormatted()}<p>`;
         const emailDetailName = 'Booking Details'
         const emailDetails = [
           { key: 'Boat Name', value: boatDetails.Boat_Name },
           { key: 'Booking Date',value: getNormalDate(req.body.start)+" - "+ getNormalDate(req.body.end)},
         ];
         const emailNameAndLink = {
           name:'Booking Link',
           link:`${process.env.CLIENT_URL}/boat-bookings`
         }


var mailOptions = {
   
    from:"noreply.smartboatbooking@gmail.com",
    to: OwnerDetails.Email,
    subject: 'Standby Booking Request',
    html:getEmailTemplate(emailState,emailContent,emailDetailName,emailDetails,emailNameAndLink)
                       
    
    
};

transporter.sendMail(mailOptions, function (error, info) {
   
});           

var mailOptionsAdmin = {
   
    from:"noreply.smartboatbooking@gmail.com",
     to: "admin@smartboating.com.au",
     subject: 'Standby Booking Request',
     html: getEmailTemplate(emailState,emailContentAdmin,emailDetailName,emailDetails,emailNameAndLink)
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
        Updated_time: moment(Date.now()),
        isOrginalBookingCanceled:false

});
 
Add_Schedule.save()
    .then(response => {

         //mail
         const emailState =  'Successfully Booked.';
         const emailContent = `Dear ${OwnerDetails.First_Name},<p>The request for a standby Booking on Boat ${boatDetails.Boat_Name} on ${getCurrentTimeFormatted()} has received by Smart Boating.It is pending review based on availability.You will be contacted with the outcome of the decision shortly<p>`;
         const emailContentAdmin = `Dear Adminsistrator,<p> The Owner ${OwnerDetails.First_Name} on Boat ${boatDetails.Boat_Name} has requested a standby booking at  ${getCurrentTimeFormatted()}</p>`;
         const emailDetailName = 'Booking Details'
         const emailDetails = [
           { key: 'Boat Name', value: boatDetails.Boat_Name },
           { key: 'Booking Date',value: getNormalDate(req.body.start)+" - "+ getNormalDate(req.body.end)},
         ];
         const emailNameAndLink = {
           name:'Booking Link',
           link:`${process.env.CLIENT_URL}/boat-bookings`
         }

var mailOptions = {
   
    from:"noreply.smartboatbooking@gmail.com",
    to: OwnerDetails.Email,
    subject: 'Standby Booking Request',
    html:getEmailTemplate(emailState,emailContent,emailDetailName,emailDetails,emailNameAndLink)
                       
    
    
};

transporter.sendMail(mailOptions, function (error, info) {
   
});           

var mailOptionsAdmin = {
   
    from:"noreply.smartboatbooking@gmail.com",
     to: "admin@smartboating.com.au",
     subject: 'Standby Booking Request',
     html:getEmailTemplate(emailState,emailContentAdmin,emailDetailName,emailDetails,emailNameAndLink)
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
specialDayId: SpecialDayid,
IsActive: req.body.IsActive,
Current_Time:moment(Date.now()),
Updated_time: moment(Date.now()),
isOrginalBookingCanceled:false

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
            {
                "$match": { IsActive:true, showThisBookingInCalendar:true
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
 
    