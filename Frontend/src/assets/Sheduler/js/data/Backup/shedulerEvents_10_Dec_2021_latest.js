// import environment for schedule event Done By Alagesan	on 06.07.2021
//import { environment } from '../../environments/environment';

// Add Base URL for schedule event  Done By Alagesan	on 06.07.2021
//EnvironmentURL:string = environment.url;
/*
// DO NOT CHANGE THE URL - SIBI
*/


//var public_URL = "https://bookings.smartboating.com.au/api/Schedule/";

//var public_Day_URL = "https://bookings.smartboating.com.au/api/Days/";

//var public_StandByBooking = "https://bookings.smartboating.com.au/api/StandByBooking/";


 // const public_URL = "https://test.smartboating.com.au/api/Schedule/";

 // const public_Day_URL = "https://test.smartboating.com.au/api/Days/";

 // const public_StandByBooking = "https://test.smartboating.com.au/api/StandByBooking/";


  const public_URL = "http://65.2.28.16/api/Schedule/";

  const public_Day_URL = "http://65.2.28.16/api/Days/";

  const public_StandByBooking = "http://65.2.28.16/api/StandByBooking/";


//obj.timeZone ....this the change

const timeszon_Set = "Australia/Sydney";

//messages.....
//var frideAfterHourBooking = "This is an after hour booking please call the Smart Boating Team Office on 02 9997 5344 to confirm the booking.";
const frideAfterHourBooking = "As this late booking request may not be seen before you arrive – you MUST call to confirm this reservation - Bayview Office 02 9997 5344 or Bayview Dock Phone 0434 538 877 or Clontarf Dock Phone 0416 023 581.";
const standbyBookingMessage = "You are trying to make a Standy By Day Booking!";
const You_are_booking_Special_day = "You are booking Special day.";
const before_Launch_date_message = "You are trying to make a booking before Launch date.";
const Bookings_are_closed_message = "Bookings are closed";
const contact_Admin_Message = "Bookings are not open for this date on this boat. Please contact admin@smartboating.com.au or 02 9997 5344 if you have any questions.";
const Empty_Boat_message = "Empty_Boat......";
const Owner_details_empty_or_Boat_Empty_Message = "Owner details empty or Boat Empty";
const Multiple_special_day_booking_Message = "Multiple special day booking could not allowed";
const before_pre_launch_date_message = "You are trying to book this boat before its pre-launch date. Please select a date after the pre-launch date";
const Standby_bookings_can_not_be_edited = "Standby bookings can not be edited";
const Permission_not_allowed_maintenance_message = "Permission not allowed for maintenance";
const select_boat_name_message = "Please select boat name";
const Booking_Type_is_not_available_Message = "Booking Type is not available for selection in Resource";
const Permission_not_allowed_Message = "Permission not allowed";
const Not_allowed_this_booking_message = "Not allowed this booking";

const previousDayMessage = "you are select previous day. current date "+timeszon_Set+ " is ";


var public_shedulDataId = 0;
var public_shedulData_color = "non";
var public_Global_unavilable = false;
var public_IsLOAIncluded = null;
var public_currentId_sheduler = null;
var Public_multipleDiloagBox_permission = false;
var Public_section_status = 0;
var public_global_transfer_datas;


function getFormattedDate_WithOut_Zero_Time(dateVal) {
  
   return  moment(dateVal).tz(timeszon_Set).format("DD-MM-YYYY");
    
}

function generateNames() {
    var names = [];
    var i = 0;
    var length = chance.integer({min: 1, max: 10});

    for (; i < length; i += 1) {
        names.push("sibi_name_"+ i);
    }

    return names;
}

 function getFormattedDate(dateVal) {
     
    var newDate = new Date(dateVal);

    var sMonth = padValue(newDate.getMonth() + 1);
    var sDay = padValue(newDate.getDate());
    var sYear = newDate.getFullYear();
    var sHour = newDate.getHours();
    var sMinute = padValue(newDate.getMinutes());
    var sAMPM = "AM";

    var iHourCheck = parseInt(sHour);

    if (iHourCheck > 12) {
        sAMPM = "PM";
        sHour = iHourCheck - 12;
    }
    else if (iHourCheck === 0) {
        sHour = "12";
    }

    sHour = padValue(sHour);

    return sDay + "-" + sMonth + "-" + sYear + " " + sHour + ":" + sMinute + " " + sAMPM;
}

function padValue(value) {
    return (value < 10) ? "0" + value : value;
}

function generateRandomSchedule(val){

   
      
    var pageIdentiFication = sessionStorage.getItem("pageIdentiFiction");
    if(pageIdentiFication == "AdminBooking"){

        var schedule = new ScheduleInfo();

        if(val.User_RoleType == "Admin")
        {
        
            if(val.Is_StandByBooking == true){

                schedule.id = val._id;//chance.guid();
                //schedule.calendarId = calendar.id;
                schedule.title = val.title +" "+ getFormattedDate(val.start)+ " to " + getFormattedDate(val.end);
                schedule.body = "";//val.body; 
                schedule.isReadOnly = val.isReadOnly;
            
                schedule.isAllday = val.isAllday;
                schedule.category = val.category;
            
                schedule.start = val.start;
                schedule.end = val.end; 

               // schedule.start = val.start_NoTime;
               // schedule.end = val.end_NoTime;   
            
                schedule.isAllday  = val.isAllday;
                schedule.isFocused = val.isFocused;
                schedule.isPending = val.isPending;
                schedule.isVisible = val.isVisible;
            
                schedule.dueDateClass = val.dueDateClass;  
                
                schedule.isPrivate = val.isPrivate;
                
                schedule.location = val.location;
                //var attendees_arry = generateNames();
            
                schedule.attendees = val.attendees; 
                schedule.recurrenceRule = val.recurrenceRule;
                schedule.state = val.state;
                schedule.color = "#ffffff";
                schedule.bgColor = "#bf9191";
                schedule.dragBgColor = "#bf9191";
                schedule.borderColor = "#bf9191";
    
                schedule.Boat_Id = val.Boat_Id;
                schedule.Boat_Name = val.Boat_Name;
    
                schedule.Owner_Id = val.User_Id;  
    
                ScheduleList.push(schedule);

            }

            else{
            
            schedule.id = val._id;//chance.guid();
            //schedule.calendarId = calendar.id;
            schedule.title = val.title +" "+ getFormattedDate(val.start)+ " to " + getFormattedDate(val.end);
            schedule.body = "";//val.body; 
            schedule.isReadOnly = val.isReadOnly;
        
            schedule.isAllday = val.isAllday;
            schedule.category = val.category;
        
            schedule.start = val.start;
            schedule.end = val.end; 
            
            //schedule.start = val.start_NoTime;
            //schedule.end = val.end_NoTime;
        
            schedule.isAllday  = val.isAllday;
            schedule.isFocused = val.isFocused;
            schedule.isPending = val.isPending;
            schedule.isVisible = val.isVisible;
        
            schedule.dueDateClass = val.dueDateClass;  
            
            schedule.isPrivate = val.isPrivate;
            
            schedule.location = val.location;
            //var attendees_arry = generateNames();
        
            schedule.attendees = val.attendees; 
            schedule.recurrenceRule = val.recurrenceRule;
            schedule.state = val.state;
            schedule.color = "#ffffff";
            schedule.bgColor = "#047b0f";
            schedule.dragBgColor = "#047b0f";
            schedule.borderColor = "#047b0f";

            schedule.Boat_Id = val.Boat_Id;
            schedule.Boat_Name = val.Boat_Name;

            schedule.Owner_Id = val.User_Id;  

            ScheduleList.push(schedule);

            }


        }
        else if(val.User_RoleType == "Owner")
        {
            
            if(val.isBookingPending){

                schedule.id = val._id;//chance.guid();
            //schedule.calendarId = calendar.id;
            schedule.title = val.title +" "+ getFormattedDate(val.start)+ " to " + getFormattedDate(val.end);;
            schedule.body = "";//val.body; 
            schedule.isReadOnly = val.isReadOnly;
        
            schedule.isAllday = val.isAllday;
            schedule.category = val.category;
        
            schedule.start = val.start;
            schedule.end = val.end;   
            
            //schedule.start = val.start_NoTime;
            //schedule.end = val.end_NoTime;
        
            schedule.isAllday  = val.isAllday;
            schedule.isFocused = val.isFocused;
            schedule.isPending = val.isPending;
            schedule.isVisible = val.isVisible;
        
            schedule.dueDateClass = val.dueDateClass;  
            
            schedule.isPrivate = val.isPrivate;
            
            schedule.location = val.location;
            //var attendees_arry = generateNames();
        
            schedule.attendees = val.attendees; 
            schedule.recurrenceRule = val.recurrenceRule;
            schedule.state = val.state;
            schedule.color = "#ffffff";
            schedule.bgColor = "#e5f4d5";
            schedule.dragBgColor = "#e5f4d5";
            schedule.borderColor = "#e5f4d5";

            schedule.Boat_Id = val.Boat_Id;
            schedule.Boat_Name = val.Boat_Name;

            schedule.Owner_Id = val.User_Id;  

            ScheduleList.push(schedule);

            }
            else if(val.isAStandByBooking && val.BookingStatus === "Rejected"){
               
            }
            else{

                schedule.id = val._id;//chance.guid();
            //schedule.calendarId = calendar.id;
            schedule.title = val.title +" "+ getFormattedDate(val.start)+ " to " + getFormattedDate(val.end);;
            schedule.body = "";//val.body; 
            schedule.isReadOnly = val.isReadOnly;
        
            schedule.isAllday = val.isAllday;
            schedule.category = val.category;
        
            schedule.start = val.start;
            schedule.end = val.end; 
            
            //schedule.start = val.start_NoTime;
            //schedule.end = val.end_NoTime;   
        
            schedule.isAllday  = val.isAllday;
            schedule.isFocused = val.isFocused;
            schedule.isPending = val.isPending;
            schedule.isVisible = val.isVisible;
        
            schedule.dueDateClass = val.dueDateClass;  
            
            schedule.isPrivate = val.isPrivate;
            
            schedule.location = val.location;
            //var attendees_arry = generateNames();
        
            schedule.attendees = val.attendees; 
            schedule.recurrenceRule = val.recurrenceRule;
            schedule.state = val.state;
            schedule.color = "#ffffff";
            schedule.bgColor = "#D50000";
            schedule.dragBgColor = "#D50000";
            schedule.borderColor = "#D50000";

            schedule.Boat_Id = val.Boat_Id;
            schedule.Boat_Name = val.Boat_Name;

            schedule.Owner_Id = val.User_Id;  

            ScheduleList.push(schedule);

            }
        
            

        }
        else if(val.User_RoleType == "Maintenance")
        {
            

            schedule.id = val._id;//chance.guid();
           
            schedule.title = val.title +" "+ getFormattedDate(val.start)+ " to " + getFormattedDate(val.end);;
            schedule.body = "";//val.body; 
            schedule.isReadOnly = val.isReadOnly;
        
            schedule.isAllday = val.isAllday;
            schedule.category = val.category;
        
            schedule.start = val.start;
            schedule.end = val.end;
            
            //schedule.start = val.start_NoTime;
            //schedule.end = val.end_NoTime;
            
        
            schedule.isAllday  = val.isAllday;
            schedule.isFocused = val.isFocused;
            schedule.isPending = val.isPending;
            schedule.isVisible = val.isVisible;
        
            schedule.dueDateClass = val.dueDateClass;  
            
            schedule.isPrivate = val.isPrivate;
            
            schedule.location = val.location;
            //var attendees_arry = generateNames();
        
            schedule.attendees = val.attendees; 
            schedule.recurrenceRule = val.recurrenceRule;
            schedule.state = val.state;
            schedule.color = "#ffffff";
            schedule.bgColor = "#2c46f8";
            schedule.dragBgColor = "#2c46f8";
            schedule.borderColor = "#2c46f8";

            schedule.Boat_Id = val.Boat_Id;
            schedule.Boat_Name = val.Boat_Name;

            schedule.Owner_Id = val.User_Id;  

            ScheduleList.push(schedule);
        }

        

    }
    else if(pageIdentiFication == "book-for-owner"){

        var schedule = new ScheduleInfo();
        if(val.User_RoleType == "Owner")
        {
            if(val.isThisAOwnerCanceledStandByBooking ){

                schedule.id = val._id;//chance.guid();
                //schedule.calendarId = calendar.id;
                schedule.title = val.title +" "+ getFormattedDate(val.start)+ " to " + getFormattedDate(val.end);
                schedule.body = "";//val.body; 
                schedule.isReadOnly = val.isReadOnly;
            
                schedule.isAllday = val.isAllday;
                schedule.category = val.category;
            
                schedule.start = val.start;
                schedule.end = val.end; 
               
               //schedule.start = val.start_NoTime;
               //schedule.end = val.end_NoTime;
            
                schedule.isAllday  = val.isAllday;
                schedule.isFocused = val.isFocused;
                schedule.isPending = val.isPending;
                schedule.isVisible = val.isVisible;
            
                schedule.dueDateClass = val.dueDateClass;  
                
                schedule.isPrivate = val.isPrivate;
                
                schedule.location = val.location;
                //var attendees_arry = generateNames();
            
                schedule.attendees = val.attendees; 
                schedule.recurrenceRule = val.recurrenceRule;
                schedule.state = val.state;
                schedule.color = "#ffffff";
                schedule.bgColor = "#D50000";
                schedule.dragBgColor = "#D50000";
                schedule.borderColor = "#D50000";

                schedule.Boat_Id = val.Boat_Id;
                schedule.Boat_Name = val.Boat_Name;

                schedule.Owner_Id = val.User_Id; 
                schedule.isThisAOwnerCanceledStandByBooking = val.isThisAOwnerCanceledStandByBooking;          

                ScheduleList.push(schedule);

              }
            else if(val.isBookingCancelled){

                schedule.id = val._id;//chance.guid();           
                schedule.title = val.title +" "+ getFormattedDate(val.start)+ " to " + getFormattedDate(val.end);
                schedule.body = "";//val.body; 
                schedule.isReadOnly = val.isReadOnly;
            
                schedule.isAllday = val.isAllday;
                schedule.category = val.category;
            
                 schedule.start = val.start;
                schedule.end = val.end; 
                
                //schedule.start = val.start_NoTime;
                //schedule.end = val.end_NoTime;   
            
                schedule.isAllday  = val.isAllday;
                schedule.isFocused = val.isFocused;
                schedule.isPending = val.isPending;
                schedule.isVisible = val.isVisible;
            
                schedule.dueDateClass = val.dueDateClass;  
                
                schedule.isPrivate = val.isPrivate;
                
                schedule.location = val.location;
                //var attendees_arry = generateNames();
            
                schedule.attendees = val.attendees; 
                schedule.recurrenceRule = val.recurrenceRule;
                schedule.state = val.state;
                schedule.color = "#ffffff";
                schedule.bgColor = "#D50000";
                schedule.dragBgColor = "#D50000";
                schedule.borderColor = "#D50000";

                schedule.Boat_Id = val.Boat_Id;
                schedule.Boat_Name = val.Boat_Name;

                schedule.Owner_Id = val.User_Id;           

                ScheduleList.push(schedule);

            }
            else if(val.isBookingPending)
            {
                schedule.id = val._id;//chance.guid();           
                schedule.title = val.title +" "+ getFormattedDate(val.start)+ " to " + getFormattedDate(val.end);
                schedule.body = "";//val.body; 
                schedule.isReadOnly = val.isReadOnly;
            
                schedule.isAllday = val.isAllday;
                schedule.category = val.category;
            
                schedule.start = val.start;
                schedule.end = val.end; 

                //schedule.start = val.start_NoTime;
                //schedule.end = val.end_NoTime;   
            
                schedule.isAllday  = val.isAllday;
                schedule.isFocused = val.isFocused;
                schedule.isPending = val.isPending;
                schedule.isVisible = val.isVisible;
            
                schedule.dueDateClass = val.dueDateClass;  
                
                schedule.isPrivate = val.isPrivate;
                
                schedule.location = val.location;
                //var attendees_arry = generateNames();
            
                schedule.attendees = val.attendees; 
                schedule.recurrenceRule = val.recurrenceRule;
                schedule.state = val.state;
                schedule.color = "#ffffff";
                schedule.bgColor = "#e5f4d5";
                schedule.dragBgColor = "#e5f4d5";
                schedule.borderColor = "#e5f4d5";

                schedule.Boat_Id = val.Boat_Id;
                schedule.Boat_Name = val.Boat_Name;

                schedule.Owner_Id = val.User_Id;           

                ScheduleList.push(schedule);

            }
            else if(val.isAStandByBooking && !val.BookingStatus){

                schedule.id = val._id;//chance.guid();
                //schedule.calendarId = calendar.id;
                schedule.title = val.title +" "+ getFormattedDate(val.start)+ " to " + getFormattedDate(val.end);
                schedule.body = "";//val.body; 
                schedule.isReadOnly = val.isReadOnly;
            
                schedule.isAllday = val.isAllday;
                schedule.category = val.category;
            
                schedule.start = val.start;
                schedule.end = val.end; 
                
                //schedule.start = val.start_NoTime;
                //schedule.end = val.end_NoTime;
            
                schedule.isAllday  = val.isAllday;
                schedule.isFocused = val.isFocused;
                schedule.isPending = val.isPending;
                schedule.isVisible = val.isVisible;
            
                schedule.dueDateClass = val.dueDateClass;  
                
                schedule.isPrivate = val.isPrivate;
                
                schedule.location = val.location;
                //var attendees_arry = generateNames();
            
                schedule.attendees = val.attendees; 
                schedule.recurrenceRule = val.recurrenceRule;
                schedule.state = val.state;
                schedule.color = "#ffffff";
                schedule.bgColor = "#e5f4d5";
                schedule.dragBgColor = "#e5f4d5";
                schedule.borderColor = "#e5f4d5";

                schedule.Boat_Id = val.Boat_Id;
                schedule.Boat_Name = val.Boat_Name;

                schedule.isAStandByBooking = val.isAStandByBooking;

                schedule.Owner_Id = val.User_Id;           

                ScheduleList.push(schedule);
                
            }
            else if(val.isAStandByBooking && val.BookingStatus === "Rejected"){

                schedule.id = val._id;//chance.guid();
                //schedule.calendarId = calendar.id;
                schedule.title = val.title +" "+ getFormattedDate(val.start)+ " to " + getFormattedDate(val.end);
                schedule.body = "";//val.body; 
                schedule.isReadOnly = val.isReadOnly;
            
                schedule.isAllday = val.isAllday;
                schedule.category = val.category;
            
                schedule.start = val.start;
                schedule.end = val.end;    
            
                schedule.isAllday  = val.isAllday;
                schedule.isFocused = val.isFocused;
                schedule.isPending = val.isPending;
                schedule.isVisible = val.isVisible;
            
                schedule.dueDateClass = val.dueDateClass;  
                
                schedule.isPrivate = val.isPrivate;
                
                schedule.location = val.location;
                //var attendees_arry = generateNames();
            
                schedule.attendees = val.attendees; 
                schedule.recurrenceRule = val.recurrenceRule;
                schedule.state = val.state;
                schedule.color = "#ffffff";
                schedule.bgColor = "#DE858E";
                schedule.dragBgColor = "#DE858E";
                schedule.borderColor = "#DE858E";

                schedule.Boat_Id = val.Boat_Id;
                schedule.Boat_Name = val.Boat_Name;

                schedule.isAStandByBooking = val.isAStandByBooking;

                schedule.Owner_Id = val.User_Id;           

                ScheduleList.push(schedule);

            }
            else{
                
            schedule.id = val._id;//chance.guid();           
            schedule.title = val.title +" "+ getFormattedDate(val.start)+ " to " + getFormattedDate(val.end);
            schedule.body = "";//val.body; 
            schedule.isReadOnly = val.isReadOnly;
        
            schedule.isAllday = val.isAllday;
            schedule.category = val.category;
        
            schedule.start = val.start;
            schedule.end = val.end;
            
            //schedule.start = val.start_NoTime;
            //schedule.end = val.end_NoTime;
        
            schedule.isAllday  = val.isAllday;
            schedule.isFocused = val.isFocused;
            schedule.isPending = val.isPending;
            schedule.isVisible = val.isVisible;
        
            schedule.dueDateClass = val.dueDateClass;  
            
            schedule.isPrivate = val.isPrivate;
            
            schedule.location = val.location;
            //var attendees_arry = generateNames();
        
            schedule.attendees = val.attendees; 
            schedule.recurrenceRule = val.recurrenceRule;
            schedule.state = val.state;
            schedule.color = "#ffffff";
            schedule.bgColor = "#047b0f";
            schedule.dragBgColor = "#047b0f";
            schedule.borderColor = "#047b0f";

            schedule.Boat_Id = val.Boat_Id;
            schedule.Boat_Name = val.Boat_Name;

            schedule.Owner_Id = val.User_Id;           

            ScheduleList.push(schedule);

            }

        }
        else if(val.User_RoleType == "Admin")
        {
        
            schedule.id = val._id;//chance.guid();
            //schedule.calendarId = calendar.id;
            schedule.title = val.title +" "+ getFormattedDate(val.start)+ " to " + getFormattedDate(val.end);
            schedule.body = "";//val.body; 
            schedule.isReadOnly = val.isReadOnly;
        
            schedule.isAllday = val.isAllday;
            schedule.category = val.category;
        
            schedule.start = val.start;
            schedule.end = val.end;  
            
            //schedule.start = val.start_NoTime;
            //schedule.end = val.end_NoTime;
        
            schedule.isAllday  = val.isAllday;
            schedule.isFocused = val.isFocused;
            schedule.isPending = val.isPending;
            schedule.isVisible = val.isVisible;
        
            schedule.dueDateClass = val.dueDateClass;  
            
            schedule.isPrivate = val.isPrivate;
            
            schedule.location = val.location;
            //var attendees_arry = generateNames();
        
            schedule.attendees = val.attendees; 
            schedule.recurrenceRule = val.recurrenceRule;
            schedule.state = val.state;
            schedule.color = "#ffffff";
            schedule.bgColor = "#D50000";
            schedule.dragBgColor = "#D50000";
            schedule.borderColor = "#D50000";

            schedule.Boat_Id = val.Boat_Id;
            schedule.Boat_Name = val.Boat_Name;

            schedule.Owner_Id = val.User_Id;  

            ScheduleList.push(schedule);

        }
        else if(val.User_RoleType == "Maintenance")
        {

            
            schedule.id = val._id;//chance.guid();
            //schedule.calendarId = calendar.id;
            schedule.title = val.title +" "+ getFormattedDate(val.start)+ " to " + getFormattedDate(val.end);
            schedule.body = "";//val.body; 
            schedule.isReadOnly = val.isReadOnly;
        
            schedule.isAllday = val.isAllday;
            schedule.category = val.category;
        
            schedule.start = val.start;
            schedule.end = val.end; 
            
            //schedule.start = val.start_NoTime;
            //schedule.end = val.end_NoTime;
        
            schedule.isAllday  = val.isAllday;
            schedule.isFocused = val.isFocused;
            schedule.isPending = val.isPending;
            schedule.isVisible = val.isVisible;
        
            schedule.dueDateClass = val.dueDateClass;  
            
            schedule.isPrivate = val.isPrivate;
            
            schedule.location = val.location;
            //var attendees_arry = generateNames();
        
            schedule.attendees = val.attendees; 
            schedule.recurrenceRule = val.recurrenceRule;
            schedule.state = val.state;
            schedule.color = "#ffffff";
            schedule.bgColor = "#2c46f8";
            schedule.dragBgColor = "#2c46f8";
            schedule.borderColor = "#2c46f8";

            schedule.Boat_Id = val.Boat_Id;
            schedule.Boat_Name = val.Boat_Name;

            schedule.Owner_Id = val.User_Id;  

            ScheduleList.push(schedule);
        }

    }
    else if(pageIdentiFication == "boat-maintenance"){
        var schedule = new ScheduleInfo();
        if(val.User_RoleType == "Admin")
        {

            if(val.Is_StandByBooking == true){

                schedule.id = val._id;//chance.guid();
            //schedule.calendarId = calendar.id;
            schedule.title = val.title +" "+ getFormattedDate(val.start)+ " to " + getFormattedDate(val.end);
            schedule.body = "";//val.body; 
            schedule.isReadOnly = val.isReadOnly;
        
            schedule.isAllday = val.isAllday;
            schedule.category = val.category;
        
            schedule.start = val.start;
            schedule.end = val.end;   
            
            //schedule.start = val.start_NoTime;
            //schedule.end = val.end_NoTime;
        
            schedule.isAllday  = val.isAllday;
            schedule.isFocused = val.isFocused;
            schedule.isPending = val.isPending;
            schedule.isVisible = val.isVisible;
        
            schedule.dueDateClass = val.dueDateClass;  
            
            schedule.isPrivate = val.isPrivate;
            
            schedule.location = val.location;
            //var attendees_arry = generateNames();
        
            schedule.attendees = val.attendees; 
            schedule.recurrenceRule = val.recurrenceRule;
            schedule.state = val.state;
            schedule.color = "#ffffff";
            schedule.bgColor = "#bf9191";
            schedule.dragBgColor = "#bf9191";
            schedule.borderColor = "#bf9191";

            schedule.Boat_Id = val.Boat_Id;
            schedule.Boat_Name = val.Boat_Name;

            schedule.Owner_Id = val.User_Id;  

            ScheduleList.push(schedule);

            }
            else{

                schedule.id = val._id;//chance.guid();
            //schedule.calendarId = calendar.id;
            schedule.title = val.title +" "+ getFormattedDate(val.start)+ " to " + getFormattedDate(val.end);
            schedule.body = "";//val.body; 
            schedule.isReadOnly = val.isReadOnly;
        
            schedule.isAllday = val.isAllday;
            schedule.category = val.category;
        
            schedule.start = val.start;
            schedule.end = val.end; 
           
           //schedule.start = val.start_NoTime;
           //schedule.end = val.end_NoTime;
        
            schedule.isAllday  = val.isAllday;
            schedule.isFocused = val.isFocused;
            schedule.isPending = val.isPending;
            schedule.isVisible = val.isVisible;
        
            schedule.dueDateClass = val.dueDateClass;  
            
            schedule.isPrivate = val.isPrivate;
            
            schedule.location = val.location;
            //var attendees_arry = generateNames();
        
            schedule.attendees = val.attendees; 
            schedule.recurrenceRule = val.recurrenceRule;
            schedule.state = val.state;
            schedule.color = "#ffffff";
            schedule.bgColor = "#047b0f";
            schedule.dragBgColor = "#047b0f";
            schedule.borderColor = "#047b0f";

            schedule.Boat_Id = val.Boat_Id;
            schedule.Boat_Name = val.Boat_Name;

            schedule.Owner_Id = val.User_Id;  

            ScheduleList.push(schedule);

            }

            

        }
        else if(val.User_RoleType == "Owner")
        {
        
            schedule.id = val._id;//chance.guid();
            //schedule.calendarId = calendar.id;
            schedule.title = val.title +" "+ getFormattedDate(val.start)+ " to " + getFormattedDate(val.end);
            schedule.body = "";//val.body; 
            schedule.isReadOnly = val.isReadOnly;
        
            schedule.isAllday = val.isAllday;
            schedule.category = val.category;
        
            schedule.start = val.start;
            schedule.end = val.end; 
           
           //schedule.start = val.start_NoTime;
           //schedule.end = val.end_NoTime;
        
            schedule.isAllday  = val.isAllday;
            schedule.isFocused = val.isFocused;
            schedule.isPending = val.isPending;
            schedule.isVisible = val.isVisible;
        
            schedule.dueDateClass = val.dueDateClass;  
            
            schedule.isPrivate = val.isPrivate;
            
            schedule.location = val.location;
            //var attendees_arry = generateNames();
        
            schedule.attendees = val.attendees; 
            schedule.recurrenceRule = val.recurrenceRule;
            schedule.state = val.state;
            schedule.color = "#ffffff";
            schedule.bgColor = "#D50000";
            schedule.dragBgColor = "#D50000";
            schedule.borderColor = "#D50000";

            schedule.Boat_Id = val.Boat_Id;
            schedule.Boat_Name = val.Boat_Name;

            schedule.Owner_Id = val.User_Id;  

            ScheduleList.push(schedule);

        }
        else if(val.User_RoleType == "Maintenance")
        {

            schedule.id = val._id;//chance.guid();
            //schedule.calendarId = calendar.id;
            schedule.title = val.title +" "+ getFormattedDate(val.start)+ " to " + getFormattedDate(val.end);
            schedule.body = "";//val.body; 
            schedule.isReadOnly = val.isReadOnly;
        
            schedule.isAllday = val.isAllday;
            schedule.category = val.category;
        
            schedule.start = val.start;
            schedule.end = val.end;   
            
            //schedule.start = val.start_NoTime;
            //schedule.end = val.end_NoTime;
        
            schedule.isAllday  = val.isAllday;
            schedule.isFocused = val.isFocused;
            schedule.isPending = val.isPending;
            schedule.isVisible = val.isVisible;
        
            schedule.dueDateClass = val.dueDateClass;  
            
            schedule.isPrivate = val.isPrivate;
            
            schedule.location = val.location;
            //var attendees_arry = generateNames();
        
            schedule.attendees = val.attendees; 
            schedule.recurrenceRule = val.recurrenceRule;
            schedule.state = val.state;
            schedule.color = "#ffffff";
            schedule.bgColor = "#2c46f8";
            schedule.dragBgColor = "#2c46f8";
            schedule.borderColor = "#2c46f8";

            schedule.Boat_Id = val.Boat_Id;
            schedule.Boat_Name = val.Boat_Name;

            schedule.Owner_Id = val.User_Id;  

            ScheduleList.push(schedule);
        }

    }
    else if(pageIdentiFication == "view-boat"){

        var boatdats = JSON.parse(sessionStorage.getItem("boatData"));
        if (typeof boatdats !== "undefined" && boatdats != null) {

            if(val.Boat_Id == boatdats._id){

                var schedule = new ScheduleInfo();
                if(val.User_RoleType == "Owner")
                {
        
                    schedule.id = val._id;//chance.guid();
                    //schedule.calendarId = calendar.id;
                    schedule.title = val.title +" "+ getFormattedDate(val.start)+ " to " + getFormattedDate(val.end);
                    schedule.body = "";//val.body; 
                    schedule.isReadOnly = val.isReadOnly;
                
                    schedule.isAllday = val.isAllday;
                    schedule.category = val.category;
                
                    schedule.start = val.start;
                    schedule.end = val.end; 

                    //schedule.start = val.start_NoTime;
                    //schedule.end = val.end_NoTime;   
                
                    schedule.isAllday  = val.isAllday;
                    schedule.isFocused = val.isFocused;
                    schedule.isPending = val.isPending;
                    schedule.isVisible = val.isVisible;
                
                    schedule.dueDateClass = val.dueDateClass;  
                    
                    schedule.isPrivate = val.isPrivate;
                    
                    schedule.location = val.location;
                    //var attendees_arry = generateNames();
                
                    schedule.attendees = val.attendees; 
                    schedule.recurrenceRule = val.recurrenceRule;
                    schedule.state = val.state;
                    schedule.color = "#fff";
                    schedule.bgColor = "#D50000";
                    schedule.dragBgColor = "#D50000";
                    schedule.borderColor = "#D50000";
        
                    schedule.Boat_Id = val.Boat_Id;
                    schedule.Boat_Name = val.Boat_Name;
        
                    schedule.Owner_Id = val.User_Id;           
        
                    ScheduleList.push(schedule);
        
                }
                else if(val.User_RoleType == "Admin")
                {

                    console.log(val);
                    if( val.Is_StandByBooking && val.BookingStatus === "Rejected"){
                        schedule.id = val._id;//chance.guid();
                        //schedule.calendarId = calendar.id;
                        schedule.title = val.title +" "+ getFormattedDate(val.start)+ " to " + getFormattedDate(val.end);
                        schedule.body = "";//val.body; 
                        schedule.isReadOnly = val.isReadOnly;
                    
                        schedule.isAllday = val.isAllday;
                        schedule.category = val.category;
                    
                        schedule.start = val.start;
                        schedule.end = val.end;  
                        
                        //schedule.start = val.start_NoTime;
                        //schedule.end = val.end_NoTime;
                    
                        schedule.isAllday  = val.isAllday;
                        schedule.isFocused = val.isFocused;
                        schedule.isPending = val.isPending;
                        schedule.isVisible = val.isVisible;
                    
                        schedule.dueDateClass = val.dueDateClass;  
                        
                        schedule.isPrivate = val.isPrivate;
                        
                        schedule.location = val.location;
                        //var attendees_arry = generateNames();
                    
                        schedule.attendees = val.attendees; 
                        schedule.recurrenceRule = val.recurrenceRule;
                        schedule.state = val.state;
                        schedule.color = "#fff";
                        schedule.bgColor = "#bf9191";
                        schedule.dragBgColor = "#bf9191";
                        schedule.borderColor = "#bf9191";
            
                        schedule.Boat_Id = val.Boat_Id;
                        schedule.Boat_Name = val.Boat_Name;
            
                        schedule.Owner_Id = val.User_Id;  
            
                        ScheduleList.push(schedule);
                    } else {
                        schedule.id = val._id;//chance.guid();
                        //schedule.calendarId = calendar.id;
                        schedule.title = val.title +" "+ getFormattedDate(val.start)+ " to " + getFormattedDate(val.end);
                        schedule.body = "";//val.body; 
                        schedule.isReadOnly = val.isReadOnly;
                    
                        schedule.isAllday = val.isAllday;
                        schedule.category = val.category;
                    
                        schedule.start = val.start;
                        schedule.end = val.end;  
                        
                        //schedule.start = val.start_NoTime;
                        //schedule.end = val.end_NoTime;
                    
                        schedule.isAllday  = val.isAllday;
                        schedule.isFocused = val.isFocused;
                        schedule.isPending = val.isPending;
                        schedule.isVisible = val.isVisible;
                    
                        schedule.dueDateClass = val.dueDateClass;  
                        
                        schedule.isPrivate = val.isPrivate;
                        
                        schedule.location = val.location;
                        //var attendees_arry = generateNames();
                    
                        schedule.attendees = val.attendees; 
                        schedule.recurrenceRule = val.recurrenceRule;
                        schedule.state = val.state;
                        schedule.color = "#fff";
                        schedule.bgColor = "#047b0f";
                        schedule.dragBgColor = "#047b0f";
                        schedule.borderColor = "#047b0f";
            
                        schedule.Boat_Id = val.Boat_Id;
                        schedule.Boat_Name = val.Boat_Name;
            
                        schedule.Owner_Id = val.User_Id;  
            
                        ScheduleList.push(schedule);
                    }
                
        
                }
                else if(val.User_RoleType == "Maintenance")
                {
        
                    schedule.id = val._id;//chance.guid();
                    //schedule.calendarId = calendar.id;
                    schedule.title = val.title +" "+ getFormattedDate(val.start)+ " to " + getFormattedDate(val.end);
                    schedule.body = "";//val.body; 
                    schedule.isReadOnly = val.isReadOnly;
                
                    schedule.isAllday = val.isAllday;
                    schedule.category = val.category;
                
                    schedule.start = val.start;
                    schedule.end = val.end;

                    //schedule.start = val.start_NoTime;
                    //schedule.end = val.end_NoTime;   
                
                    schedule.isAllday  = val.isAllday;
                    schedule.isFocused = val.isFocused;
                    schedule.isPending = val.isPending;
                    schedule.isVisible = val.isVisible;
                
                    schedule.dueDateClass = val.dueDateClass;  
                    
                    schedule.isPrivate = val.isPrivate;
                    
                    schedule.location = val.location;
                    //var attendees_arry = generateNames();
                
                    schedule.attendees = val.attendees; 
                    schedule.recurrenceRule = val.recurrenceRule;
                    schedule.state = val.state;
                    schedule.color = "#fff";
                    schedule.bgColor = "#2c46f8";
                    schedule.dragBgColor = "#2c46f8";
                    schedule.borderColor = "#2c46f8";
        
                    schedule.Boat_Id = val.Boat_Id;
                    schedule.Boat_Name = val.Boat_Name;
        
                    schedule.Owner_Id = val.User_Id;  
        
                    ScheduleList.push(schedule);
                }

            }
            
        }
        else{
           
            CommenMessage(Empty_Boat_message);
        }

       

    }
    else if(pageIdentiFication == "owner-dashboard-Reservation"){

      
        var owner_drp_Id = JSON.parse(sessionStorage.getItem("Ownerlogin"));
        var owner_boats_OwnerLog = JSON.parse(sessionStorage.getItem("Owner_pg_boatListed"));

        if((typeof owner_drp_Id !== "undefined" && owner_drp_Id != null) && 
           (typeof owner_boats_OwnerLog !== "undefined" && owner_boats_OwnerLog != null))
        {

            
            var conditionChek = null;

            try{

              conditionChek = owner_boats_OwnerLog.find(x => x._id == val.Boat_Id);
          

            }
            catch{

            }


            if(typeof conditionChek !== "undefined" && conditionChek != null)
            {
                var schedule = new ScheduleInfo();
                if(val.User_RoleType == "Owner")
                {

                   
                    
                    
                    if(owner_drp_Id._id == val.User_Id)
                    {
                        

                      if(val.isThisAOwnerCanceledStandByBooking ){

                        schedule.id = val._id;//chance.guid();
                        //schedule.calendarId = calendar.id;
                        schedule.title = val.title +" "+ getFormattedDate(val.start)+ " to " + getFormattedDate(val.end);
                        schedule.body = "";//val.body; 
                        schedule.isReadOnly = val.isReadOnly;
                    
                        schedule.isAllday = val.isAllday;
                        schedule.category = val.category;
                    
                        schedule.start = val.start;
                        schedule.end = val.end;

                        //schedule.start = val.start_NoTime;
                        //schedule.end = val.end_NoTime;    
                    
                        schedule.isAllday  = val.isAllday;
                        schedule.isFocused = val.isFocused;
                        schedule.isPending = val.isPending;
                        schedule.isVisible = val.isVisible;
                    
                        schedule.dueDateClass = val.dueDateClass;  
                        
                        schedule.isPrivate = val.isPrivate;
                        
                        schedule.location = val.location;
                        //var attendees_arry = generateNames();
                    
                        schedule.attendees = val.attendees; 
                        schedule.recurrenceRule = val.recurrenceRule;
                        schedule.state = val.state;
                        schedule.color = "#ffffff";
                        schedule.bgColor = "#D50000";
                        schedule.dragBgColor = "#D50000";
                        schedule.borderColor = "#D50000";
    
                        schedule.Boat_Id = val.Boat_Id;
                        schedule.Boat_Name = val.Boat_Name;
    
                        schedule.Owner_Id = val.User_Id; 
                        schedule.isThisAOwnerCanceledStandByBooking = val.isThisAOwnerCanceledStandByBooking;          
    
                        ScheduleList.push(schedule);

                      }
                      else if(val.isBookingCancelled)
                        {

                        schedule.id = val._id;//chance.guid();
                        //schedule.calendarId = calendar.id;
                        schedule.title = val.title +" "+ getFormattedDate(val.start)+ " to " + getFormattedDate(val.end);
                        schedule.body = "";//val.body; 
                        schedule.isReadOnly = val.isReadOnly;
                    
                        schedule.isAllday = val.isAllday;
                        schedule.category = val.category;
                    
                        schedule.start = val.start;
                        schedule.end = val.end;

                        //schedule.start = val.start_NoTime;
                        //schedule.end = val.end_NoTime;    
                    
                        schedule.isAllday  = val.isAllday;
                        schedule.isFocused = val.isFocused;
                        schedule.isPending = val.isPending;
                        schedule.isVisible = val.isVisible;
                    
                        schedule.dueDateClass = val.dueDateClass;  
                        
                        schedule.isPrivate = val.isPrivate;
                        
                        schedule.location = val.location;
                        //var attendees_arry = generateNames();
                    
                        schedule.attendees = val.attendees; 
                        schedule.recurrenceRule = val.recurrenceRule;
                        schedule.state = val.state;
                        schedule.color = "#ffffff";
                        schedule.bgColor = "#D50000";
                        schedule.dragBgColor = "#D50000";
                        schedule.borderColor = "#D50000";
    
                        schedule.Boat_Id = val.Boat_Id;
                        schedule.Boat_Name = val.Boat_Name;
    
                        schedule.Owner_Id = val.User_Id;           
    
                        ScheduleList.push(schedule);
                      }
                      else if(val.isBookingPending){
                         

                        schedule.id = val._id;//chance.guid();
                        //schedule.calendarId = calendar.id;
                        schedule.title = val.title +" "+ getFormattedDate(val.start)+ " to " + getFormattedDate(val.end);
                        schedule.body = "";//val.body; 
                        schedule.isReadOnly = val.isReadOnly;
                    
                        schedule.isAllday = val.isAllday;
                        schedule.category = val.category;
                    
                        schedule.start = val.start;
                        schedule.end = val.end; 

                       //schedule.start = val.start_NoTime;
                       //schedule.end = val.end_NoTime;   
                    
                        schedule.isAllday  = val.isAllday;
                        schedule.isFocused = val.isFocused;
                        schedule.isPending = val.isPending;
                        schedule.isVisible = val.isVisible;
                    
                        schedule.dueDateClass = val.dueDateClass;  
                        
                        schedule.isPrivate = val.isPrivate;
                        
                        schedule.location = val.location;
                        //var attendees_arry = generateNames();
                    
                        schedule.attendees = val.attendees; 
                        schedule.recurrenceRule = val.recurrenceRule;
                        schedule.state = val.state;
                        schedule.color = "#ffffff";
                        schedule.bgColor = "#e5f4d5";
                        schedule.dragBgColor = "#e5f4d5";
                        schedule.borderColor = "#e5f4d5";
    
                        schedule.Boat_Id = val.Boat_Id;
                        schedule.Boat_Name = val.Boat_Name;
    
                        schedule.Owner_Id = val.User_Id;           
    
                        ScheduleList.push(schedule);

                      }
                      else if(val.isAStandByBooking && !val.BookingStatus){

                        schedule.id = val._id;//chance.guid();
                        //schedule.calendarId = calendar.id;
                        schedule.title = val.title +" "+ getFormattedDate(val.start)+ " to " + getFormattedDate(val.end);
                        schedule.body = "";//val.body; 
                        schedule.isReadOnly = val.isReadOnly;
                    
                        schedule.isAllday = val.isAllday;
                        schedule.category = val.category;
                    
                        schedule.start = val.start;
                        schedule.end = val.end; 

                        //schedule.start = val.start_NoTime;
                        //schedule.end = val.end_NoTime;   
                    
                        schedule.isAllday  = val.isAllday;
                        schedule.isFocused = val.isFocused;
                        schedule.isPending = val.isPending;
                        schedule.isVisible = val.isVisible;
                    
                        schedule.dueDateClass = val.dueDateClass;  
                        
                        schedule.isPrivate = val.isPrivate;
                        
                        schedule.location = val.location;
                        //var attendees_arry = generateNames();
                    
                        schedule.attendees = val.attendees; 
                        schedule.recurrenceRule = val.recurrenceRule;
                        schedule.state = val.state;
                        schedule.color = "#ffffff";
                        schedule.bgColor = "#e5f4d5";
                        schedule.dragBgColor = "#e5f4d5";
                        schedule.borderColor = "#e5f4d5";
    
                        schedule.Boat_Id = val.Boat_Id;
                        schedule.Boat_Name = val.Boat_Name;

                        schedule.isAStandByBooking = val.isAStandByBooking;
    
                        schedule.Owner_Id = val.User_Id;           
    
                        ScheduleList.push(schedule);
                        
                      }
                      else if(val.isAStandByBooking && val.BookingStatus === "Rejected"){

                        schedule.id = val._id;//chance.guid();
                        //schedule.calendarId = calendar.id;
                        schedule.title = val.title +" "+ getFormattedDate(val.start)+ " to " + getFormattedDate(val.end);
                        schedule.body = "";//val.body; 
                        schedule.isReadOnly = val.isReadOnly;
                    
                        schedule.isAllday = val.isAllday;
                        schedule.category = val.category;
                    
                        schedule.start = val.start;
                        schedule.end = val.end;

                        //schedule.start = val.start_NoTime;
                        //schedule.end = val.end_NoTime;    
                    
                        schedule.isAllday  = val.isAllday;
                        schedule.isFocused = val.isFocused;
                        schedule.isPending = val.isPending;
                        schedule.isVisible = val.isVisible;
                    
                        schedule.dueDateClass = val.dueDateClass;  
                        
                        schedule.isPrivate = val.isPrivate;
                        
                        schedule.location = val.location;
                        //var attendees_arry = generateNames();
                    
                        schedule.attendees = val.attendees; 
                        schedule.recurrenceRule = val.recurrenceRule;
                        schedule.state = val.state;
                        schedule.color = "#ffffff";
                        schedule.bgColor = "#DE858E";
                        schedule.dragBgColor = "#DE858E";
                        schedule.borderColor = "#DE858E";
    
                        schedule.Boat_Id = val.Boat_Id;
                        schedule.Boat_Name = val.Boat_Name;

                        schedule.isAStandByBooking = val.isAStandByBooking;
    
                        schedule.Owner_Id = val.User_Id;           
    
                        ScheduleList.push(schedule);

                      }
                      else{

                        schedule.id = val._id;//chance.guid();
                        //schedule.calendarId = calendar.id;
                        schedule.title = val.title +" "+ getFormattedDate(val.start)+ " to " + getFormattedDate(val.end);
                        schedule.body = "";//val.body; 
                        schedule.isReadOnly = val.isReadOnly;
                    
                        schedule.isAllday = val.isAllday;
                        schedule.category = val.category;
                    
                        schedule.start = val.start;
                        schedule.end = val.end; 

                        //schedule.start = val.start_NoTime;
                        //schedule.end = val.end_NoTime;   
                    
                        schedule.isAllday  = val.isAllday;
                        schedule.isFocused = val.isFocused;
                        schedule.isPending = val.isPending;
                        schedule.isVisible = val.isVisible;
                    
                        schedule.dueDateClass = val.dueDateClass;  
                        
                        schedule.isPrivate = val.isPrivate;
                        
                        schedule.location = val.location;
                        //var attendees_arry = generateNames();
                    
                        schedule.attendees = val.attendees; 
                        schedule.recurrenceRule = val.recurrenceRule;
                        schedule.state = val.state;
                        schedule.color = "#ffffff";
                        schedule.bgColor = "#047b0f";
                        schedule.dragBgColor = "#047b0f";
                        schedule.borderColor = "#047b0f";
    
                        schedule.Boat_Id = val.Boat_Id;
                        schedule.Boat_Name = val.Boat_Name;
    
                        schedule.Owner_Id = val.User_Id;           
    
                        ScheduleList.push(schedule);

                      }

                    }
                    else
                    {
                        
                        if(!val.isBookingPending)
                        {
                           
                            var pendingBookingUserId = val.pendingBookingUserId;
                            
                           if(owner_drp_Id._id != pendingBookingUserId)
                           {
                              if(!val.isThisAOwnerCanceledStandByBooking)
                              {

                            schedule.id = val._id;
                        
                            schedule.title = "";
                            schedule.body = "";
                            schedule.isReadOnly = val.isReadOnly;
                        
                            schedule.isAllday = val.isAllday;
                            schedule.category = val.category;
                        
                            schedule.start = val.start;
                            schedule.end = val.end;
                           
                           //schedule.start = val.start_NoTime;
                           //schedule.end = val.end_NoTime;
                        
                            schedule.isAllday  = val.isAllday;
                            schedule.isFocused = val.isFocused;
                            schedule.isPending = val.isPending;
                            schedule.isVisible = val.isVisible;
                        
                            schedule.dueDateClass = val.dueDateClass;  
                            
                            schedule.isPrivate = val.isPrivate;
                            
                            schedule.location = val.location;
                                               
                            schedule.attendees = val.attendees; 
                            schedule.recurrenceRule = val.recurrenceRule;
                            schedule.state = val.state;
                            schedule.color = "#ffffff";
                            schedule.bgColor = "#D50000";
                            schedule.dragBgColor = "#D50000";
                            schedule.borderColor = "#D50000";
        
                            schedule.Boat_Id = val.Boat_Id;
                            schedule.Boat_Name = val.Boat_Name;
        
                            schedule.Owner_Id = val.User_Id;           
        
                            ScheduleList.push(schedule);
                              }

                           }
                           else{
                          

                           

                           }


                        }
                        

                        

                    }

                   

                }
                else if(val.User_RoleType == "Admin")
                {
                
                    schedule.id = val._id;//chance.guid();
                    //schedule.calendarId = calendar.id;
                    schedule.title = "";
                    schedule.body = "";//val.body; 
                    schedule.isReadOnly = val.isReadOnly;
                
                    schedule.isAllday = val.isAllday;
                    schedule.category = val.category;
                
                    schedule.start = val.start;
                    schedule.end = val.end;
                   
                   //schedule.start = val.start_NoTime;
                   //schedule.end = val.end_NoTime;
                
                    schedule.isAllday  = val.isAllday;
                    schedule.isFocused = val.isFocused;
                    schedule.isPending = val.isPending;
                    schedule.isVisible = val.isVisible;
                
                    schedule.dueDateClass = val.dueDateClass;  
                    
                    schedule.isPrivate = val.isPrivate;
                    
                    schedule.location = val.location;
                    //var attendees_arry = generateNames();
                
                    schedule.attendees = val.attendees; 
                    schedule.recurrenceRule = val.recurrenceRule;
                    schedule.state = val.state;
                    schedule.color = "#ffffff";
                    schedule.bgColor = "#D50000";
                    schedule.dragBgColor = "#D50000";
                    schedule.borderColor = "#D50000";

                    schedule.Boat_Id = val.Boat_Id;
                    schedule.Boat_Name = val.Boat_Name;

                    schedule.Owner_Id = val.User_Id;  

                    ScheduleList.push(schedule);

                }
                else if(val.User_RoleType == "Maintenance")
                {

                    schedule.id = val._id;//chance.guid();
                    //schedule.calendarId = calendar.id;
                    schedule.title = "";
                    schedule.body = "";//val.body; 
                    schedule.isReadOnly = val.isReadOnly;
                
                    schedule.isAllday = val.isAllday;
                    schedule.category = val.category;
                
                    schedule.start = val.start;
                    schedule.end = val.end;

                    //schedule.start = val.start_NoTime;
                    //schedule.end = val.end_NoTime;  
                
                    schedule.isAllday  = val.isAllday;
                    schedule.isFocused = val.isFocused;
                    schedule.isPending = val.isPending;
                    schedule.isVisible = val.isVisible;
                
                    schedule.dueDateClass = val.dueDateClass;  
                    
                    schedule.isPrivate = val.isPrivate;
                    
                    schedule.location = val.location;
                    //var attendees_arry = generateNames();
                
                    schedule.attendees = val.attendees; 
                    schedule.recurrenceRule = val.recurrenceRule;
                    schedule.state = val.state;
                    schedule.color = "#ffffff";
                    schedule.bgColor = "#2c46f8";
                    schedule.dragBgColor = "#2c46f8";
                    schedule.borderColor = "#2c46f8";

                    schedule.Boat_Id = val.Boat_Id;
                    schedule.Boat_Name = val.Boat_Name;

                    schedule.Owner_Id = val.User_Id;  

                    ScheduleList.push(schedule);
                }
            
            
            
            }
            


            

        }
        else{
            CommenMessage(Owner_details_empty_or_Boat_Empty_Message);

        }

        

    }

}

function generateSchedule_old() {   
    
    ScheduleList = [];
    var calendar = Object();
    calendar.bgColor = "#047b0f";
    calendar.borderColor = "#047b0f";
    //calendar.checked = true;
    calendar.color = "#ffffff";
    calendar.dragBgColor = "#047b0f";
   // calendar.id = "1";
   // calendar.name = "My Calendar";

    var renderStart = new Date("Sat May 08 2021 00:00:00 GMT+0530 (India Standard Time)");
var renderEnd = new Date("Sat May 10 2021 00:00:00 GMT+0530 (India Standard Time)");


    generateRandomSchedule(calendar, renderStart, renderEnd);  
    

}

function generateRandomSchedule_old(calendar, renderStart, renderEnd) {
    var schedule = new ScheduleInfo();

    schedule.id = chance.guid();
    schedule.calendarId = calendar.id;
    schedule.title = "sibi test Title";//chance.sentence({words: 3});
    schedule.body = true;//chance.bool({likelihood: 20}) ? chance.sentence({words: 10}) : '';
    schedule.isReadOnly = false;//chance.bool({likelihood: 20});

    schedule.isAllday = true;//chance.bool({likelihood: 30});
    schedule.category = 'allday';

    schedule.start = renderStart;
    schedule.end = renderEnd;    

    schedule.isAllday  = true;
    schedule.isFocused = false;
    schedule.isPending = false;
    schedule.isVisible = true;

   // schedule.category = 'allday';
    schedule.dueDateClass = 'morning';
    //schedule.category = 'time';

    schedule.isPrivate = true;//chance.bool({likelihood: 10});
    
    schedule.location = "Sibi_TestLocation";//chance.address();

    var attendees_arry = generateNames();

    schedule.attendees = attendees_arry; //chance.bool({likelihood: 70}) ? generateNames() : [];
    schedule.recurrenceRule = "sibi_recurrenceRule"; //chance.bool({likelihood: 20}) ? 'repeated events' : '';
    schedule.state = true;//chance.bool({likelihood: 20}) ? 'Free' : 'Busy';
    schedule.color = calendar.color;
    schedule.bgColor = calendar.bgColor;
    schedule.dragBgColor = calendar.dragBgColor;
    schedule.borderColor = calendar.borderColor;

    /*

    if (schedule.category === 'milestone') {
        schedule.color = schedule.bgColor;
        schedule.bgColor = 'transparent';
        schedule.dragBgColor = 'transparent';
        schedule.borderColor = 'transparent';
    }
    */
/*
    schedule.raw.memo = "raw_memo";//chance.sentence();
    schedule.raw.creator.name = "raw_creator_name";//chance.name();
    schedule.raw.creator.avatar = "raw_creator_avatar";//chance.avatar();
    schedule.raw.creator.company = "raw_creator_company";//chance.company();
    schedule.raw.creator.email = "raw_creator_email"; //chance.email();
    schedule.raw.creator.phone = "raw_creator_phone";//chance.phone();

    if (chance.bool({ likelihood: 20 })) {
        
        var travelTime = chance.minute();
        schedule.goingDuration = "13";//travelTime;
        schedule.comingDuration = "13";//travelTime;
    }
    */

    ScheduleList.push(schedule);
}

function ConvertUTCTimeToLocalTime(UTCDateString)
{
        var convertdLocalTime = new Date(UTCDateString);

        var hourOffset = convertdLocalTime.getTimezoneOffset() / 60;

        convertdLocalTime.setHours( convertdLocalTime.getHours() + hourOffset ); 

        return convertdLocalTime;
}
   
    $(document).on("click",".tui-full-calendar-weekday-schedule",function() {
      
       var currentId = $(this).attr('data-schedule-id'); 

       //public_shedulData_color = $(this).css('background-color');

    //    sessionStorage.setItem("view-Booking-id",currentId);
    //    public_shedulDataId = currentId;

    });
//data-schedule-id

$(document).on("click","[data-schedule-id]",function() {
        
     public_currentId_sheduler = $(this).attr('data-schedule-id');
     public_shedulData_color = $(this).css('background-color');

     sessionStorage.setItem("view-Booking-id",public_currentId_sheduler);
     public_shedulDataId = public_currentId_sheduler;

 });


 
    $(document).on("click",".tui-full-calendar-popup-eye",function() {

        
        var pageIdentiFication = sessionStorage.getItem("pageIdentiFiction");
        
        if(pageIdentiFication == "AdminBooking"){

            var currentId = public_currentId_sheduler;//$(this).attr('data-schedule-id');

            sessionStorage.setItem("view-Booking-id",currentId);

            window.open("/booking-details/");
            

        }
        else if(pageIdentiFication == "book-for-owner"){

            var currentId = public_currentId_sheduler;
            sessionStorage.setItem("view-Booking-id",currentId);

            window.open("/booking-details/");
           // var currentId = $(this).attr('data-schedule-id');          
            //sessionStorage.setItem("view-Booking-id",currentId);
        }
        else if(pageIdentiFication == "boat-maintenance"){

            var currentId = public_currentId_sheduler;
            sessionStorage.setItem("view-Booking-id",currentId);

            window.open("/booking-details/");
            //var currentId = $(this).attr('data-schedule-id');          
            //sessionStorage.setItem("view-Booking-id",currentId);

        }
        else if(pageIdentiFication == "owner-dashboard-Reservation"){

            
               
               if(public_shedulData_color == "rgb(4, 123, 15)") 
               {  
                  var currentId = public_currentId_sheduler;
                  sessionStorage.setItem("view-Booking-id",currentId);

                    window.open("/owner-booking-details/");
                    //var currentId = $(this).attr('data-schedule-id');          
                    //sessionStorage.setItem("view-Booking-id",currentId);
               }              
               else{

                 CommenMessage("Not Avilable");

               }

           // CommenMessage("Not Avilable");
        }

         	
         
         public_shedulDataId = currentId;
 
     });

     ////delete........sheduler......
     $(document).on("click",".tui-full-calendar-popup-delete",function() {
        $('#remove_Booking').trigger('click');
     });


    $(document).on("click","#span-confermation-cancel-booking",function() {
       
        var curntuser = "";
        var Owner_Id ="";
        var pageIdentiFication = sessionStorage.getItem("pageIdentiFiction");
        var roletype = null;
        if(pageIdentiFication == "AdminBooking"){

            roletype = "Admin";
            curntuser = sessionStorage.getItem("UserId");
            Owner_Id = curntuser;

        }
        else if(pageIdentiFication == "book-for-owner"){

            roletype = "Owner";
            curntuser = sessionStorage.getItem("UserId");
           var Owner_select = JSON.parse(sessionStorage.getItem("Owner_SelectOwner"));
           Owner_Id = Owner_select._id;


        }
        else if(pageIdentiFication == "boat-maintenance"){

            roletype = "Maintenance";
            curntuser = sessionStorage.getItem("UserId");
            Owner_Id = curntuser;

        }
        else if(pageIdentiFication == "owner-dashboard-Reservation"){

            roletype = "Owner";
            var tmpdt = curntuser = JSON.parse(sessionStorage.getItem("Ownerlogin"));
            curntuser = tmpdt._id;
            Owner_Id = curntuser;
        }
        //


        if(roletype != null){

        var obj = Object();
        obj._id = public_shedulDataId;
        obj.User_RoleType = roletype;
        obj.curntuser = curntuser;
        obj.Owner_Id = Owner_Id;
       
        console.log(obj);

        $.ajax({
            url: public_URL+"DeleteSchedule",
            type: 'POST',
            dataType: 'json', 
            data: obj,
            success: function(datas) {
                sessionStorage.setItem("datatrrigerd_ownerlogin",1);
                roletype = null;
                //
                if(datas.status == true)
                {
                    CommenMessage_save(datas.message);
                    //location.reload();    
                }
                else if(datas.status == false)
                {
                    CommenMessage(datas.message);                     
                }

            
    
            },
            error: function (error) {          
                    
            }
        });

        }



      

        

    });

    //$("#sheduler-calender-timer1").val( "09:00" );

    $(document).on("click",".tui-full-calendar-weekday-grid-line",function() {

        
        var text_val = $(this).children('.tui-full-calendar-weekday-grid-header').children('span').children('.tui-full-calendar-weekday-grid-date').text();

        var Month_Year = $(".render-range").text();
        var dataAtty = Month_Year.split('.');

        var d = new Date();
        var sMonth = padValue(d.getMonth() + 1);
        var sDay = padValue(d.getDate());
        var sYear = d.getFullYear();  
        var sHour = d.getHours();
        var sMinute = padValue(d.getMinutes());

        var currentDate = sDay+"-"+sMonth+"-"+sYear;
        var selectedDate = text_val+"-"+dataAtty[1]+"-"+dataAtty[0];
        
        var obj = Object();
        obj.currentDate = currentDate;
        obj.selectedDate = selectedDate;
        obj.Hour_Minitu = sHour+":"+sMinute;
        obj.Hour = sHour;
        obj.minitu = sMinute;
        sessionStorage.setItem("currentDateFormat",JSON.stringify(obj));
        
        if(currentDate == selectedDate)
        {
            
            
            $("#sheduler-calender-timer1").val( "10:15" );
        }
        else{

            $("#sheduler-calender-timer1").val( "09:00" );

        }


       

    });

    $(document).on("mousedown",".tui-full-calendar-weekday-grid-line",function(event) {

        
        var text_val = $(this).children('.tui-full-calendar-weekday-grid-header').children('span').children('.tui-full-calendar-weekday-grid-date').text();

       



        var Month_Year = $(".render-range").text();
        var dataAtty = Month_Year.split('.');

        var d = new Date();
        var sMonth = padValue(d.getMonth() + 1);
        var sDay = padValue(d.getDate());
        var sYear = d.getFullYear();  
        var sHour = d.getHours();
        var sMinute = padValue(d.getMinutes());

        var currentDate = sDay+"-"+sMonth+"-"+sYear;
        var selectedDate = text_val+"-"+dataAtty[1]+"-"+dataAtty[0];
        
        var obj = Object();
        obj.currentDate = currentDate;
        obj.selectedDate = selectedDate;
        obj.Hour_Minitu = sHour+":"+sMinute;
        obj.Hour = sHour;
        obj.minitu = sMinute;
        sessionStorage.setItem("currentDateFormat",JSON.stringify(obj));
        
        

    });


    //tui-full-calendar-month-more-schedule tui-full-calendar-month-more-allday tui-full-calendar-weekday-schedule-title
//public_shedulDataId

    //delete.....End

    function getAllDates(startDate, stopDate) {
                
        var dateArray =[];
        var currentDate = startDate;
        while (currentDate <= stopDate) {
            dateArray.push(currentDate);
            var ddd = new Date(currentDate);
            var currentDate = new Date(ddd.setDate(ddd.getDate() + 1)); 
        }
        return dateArray;
    }

  


     function GetUnAvailabeDaysOfBoats_Owner(obj){

        var datas = JSON.parse(sessionStorage.getItem("GetUnAvailabeDaysOfBoats_Owners"));         
            //
        if (typeof datas !== "undefined" && datas != null) 
        {
            // var temp_unAvilable = [];  
            // $.each(temp_res.UnAvailableDates, function(index, val) {                
            //     var str_tmp = new Date(val);
            //     temp_unAvilable.push(getFormattedDate_WithOut_Zero_Time(str_tmp));               
            // }); 
            
            // var aaa = temp_unAvilable;


            //AddSchedule_ApiCalling(obj);

        }
        else{

            AddSchedule_ApiCalling(obj); 

        }

     }


    function AddSchedule_ApiCalling(obj){ 

        if(obj.Check_Status ==  1){

           // (before_Launch_date_message);
            let message = before_Launch_date_message;
            let section = 3;
            let transferData = obj;

            Commen_ConformationMessage(message,section,transferData)//

        }
        else{

            calculate_NextBookingDays_MessageBase(obj);

        }
        

    }

    //special day calculations................Start.......

     function SpecialDaysCalculations(start_Date,end_date){

         var data_SpecialDays =[];
         var specialday_check = false;

         var obj_main = Object();


         var date_specialday = JSON.parse(sessionStorage.getItem("load_SpecialDays"));

            var tmp_month_f = start_Date.getMonth();
            var tmp_year_f = start_Date.getFullYear();
            var tmp_Date_f = start_Date.getDate();
            var date_f = new Date(tmp_year_f, tmp_month_f, tmp_Date_f); 
        
           do{

           
         $.each(date_specialday, function (key, val) { 

                                   
            var obj = Object();
            obj._id =val._id;
            obj.Name = val.Name;
            obj.Start_Date = new Date(val.Start_Date); 
            obj.End_Date = new Date(val.End_Date); 


            var tmp_month = obj.Start_Date.getMonth();
            var tmp_year = obj.Start_Date.getFullYear();
            var tmp_Date = obj.Start_Date.getDate();
      
            var date = new Date(tmp_year, tmp_month, tmp_Date); 

            do
            {
               
                var specialDay_Convert = getFormattedDate_WithOut_Zero_Time(date);
                var selectedDay_Convert =  getFormattedDate_WithOut_Zero_Time(date_f);
                

                if(specialDay_Convert == selectedDay_Convert){
                   
                    var obj2 = Object();
                    obj2._id =val._id;
                    obj2.Name = val.Name;
                    obj2.special_date = Jqueary_string_to_Date_Convert(specialDay_Convert);
                    data_SpecialDays.push(obj2);
                    specialday_check = true;

                }



                date.setDate(date.getDate() + 1);
                var tmp_Add_Date = new Date(date);       
             }while(tmp_Add_Date <= obj.End_Date)
                         
            //generateRandomSchedule(val);                 
         });

         date_f.setDate(date_f.getDate() + 1);
         var tmp_Add_Date_f = new Date(date_f);

        }while(tmp_Add_Date_f <= end_date)
        
        obj_main.specialday_check = specialday_check;
        obj_main.data_SpecialDays_Arry = data_SpecialDays;

        //this to start
       
        //check_SpecialDay.specialday_check
        var firstId;
        var firstLevelLoop = true;
        var chekingResults = "";

        $.each(obj_main.data_SpecialDays_Arry, function (key, val){
            
            var temp_id = val._id;

            if(firstLevelLoop == true){
                firstId = val._id;
                firstLevelLoop = false;
            }

            if(firstId == temp_id){

                chekingResults ="singleId";

            }
            else{

                chekingResults ="multipleId";

                return false;

            }


        });

        

        if(chekingResults == "singleId")
        {
            obj_main.multiple_specialDay_chek = false;
            return obj_main;
        }
        else if( chekingResults == "multipleId"){

            obj_main.multiple_specialDay_chek = true;
            return obj_main;

        }
        else{

            obj_main.multiple_specialDay_chek = false;
            return obj_main;

        }

     }

    function Jqueary_string_to_Date_Convert(dateString){   
       
        var dateArray = dateString.split("-");
        var dateObj = new Date(`${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`);
      
        return dateObj;
    
      }

      function Jqueary_string_to_Date_Convert_slash(dateString){   
       
        var dateArray = dateString.split("/");
        var dateObj = new Date(`${dateArray[2]}/${dateArray[1]}/${dateArray[0]}`);
      
        return dateObj;
    
      }

      function Jqueary_string_to_Date_Convert_slash_unavilable(dateString){   
       
        var dateArray = dateString.split("/");
        var dateObj = new Date(`${dateArray[2]}/${dateArray[0]}/${dateArray[1]}`);
      
        return dateObj;
    
      }


   //End..................................................


    function calculate_NextBookingDays(datas,tmb_Obj)
    {

      
      
        var temp_data = JSON.parse(datas);
         
        if(typeof temp_data !== "undefined" && temp_data != null)
        {
            var temp_BoatDetails = temp_data.BoatDetails[0];

            var currentDate = new Date();
            
            var Launch_Date = new Date(temp_BoatDetails.Launch_Date);
            var PreLaunch_Date = new Date(temp_BoatDetails.PreLaunch_Date);                   

            var Start_Date =  tmb_Obj.Start_Date;
            var End_Date = tmb_Obj.End_Date;

            if(PreLaunch_Date <= Start_Date && Launch_Date >=  Start_Date)
            {

               
               //(before_Launch_date_message);
               
               return 1;

            }
            else if(PreLaunch_Date <= Start_Date && Launch_Date <=  Start_Date && currentDate <= Launch_Date)
            {
               

                return 2;
            }
            else if(PreLaunch_Date <= Start_Date && Launch_Date <=  Start_Date && Launch_Date <= currentDate )
            {
                

                return 3;

               
            }
            else
            {
                CommenMessage(before_pre_launch_date_message);
                
               return 404;

            }


           
        }



    }

    function getFormattedDate_Sat_Sun_only(dateVal) {       
        var newDate = new Date(dateVal);
        var days = ['Sun','Mon','Tues','Wed','Thrus','Fri','Sat'];
        var currentDay = days[newDate.getDay()];  
        if(currentDay == 'Sun' || currentDay == 'Sat'){
            return true;
        }
        else{
            return false;
        }  
       
    }

    function getFormattedDate_Fri_only(dateVal) {       
        var newDate = new Date(dateVal);
        var days = ['Sun','Mon','Tues','Wed','Thrus','Fri','Sat'];
        var currentDay = days[newDate.getDay()];  
        if(currentDay == 'Fri'){
            return true;
        }
        else{
            return false;
        }  
       
    }

    function getFormattedDate_Friday_only(dateVal) {
        
       

        var currentDays  = new Date(momment_newDate_convert_YYYY_MM_DD(MomentConvert_currentDay_Date())); //new Date();
        //var currentDays =  //new Date();
                
        //var newDate = new Date(momment_newDate_convert_YYYY_MM_DD(dateVal));

        var days = ['Sun','Mon','Tues','Wed','Thrus','Fri','Sat'];
        var currentDay = days[currentDays.getDay()]; 
        var sHour = currentDays.getHours();


        

        if(currentDay == 'Thrus'){
           // if(currentDay == 'Fri'){

           if(sHour >= 12){
            //if(sHour >= 17){
                return true;

            }
            else{
                return false;

            }
           
        }
        else{
            return false;
        }  
       
    }

    function conver_Hours(dateVal){

        var newDate = new Date("1/1/2013 " + dateVal);        
        var sHour = newDate.getHours();
        var iHourCheck = parseInt(sHour);    
        sHour = padValue(iHourCheck);
    
        return sHour;
  
        
    }

    function conver_Minit(dateVal){

        var newDate = new Date("1/1/2013 " + dateVal);         
        var sMinute = padValue(newDate.getMinutes());
            
        return sMinute;
    

    }

    function adding_MultipleDays(date,numberOfdays){
     
       

        var newdate = date;//new Date(date);
        newdate.setDate(newdate.getDate() + numberOfdays);
        return new Date(newdate);
    }

    function Subtract_Single_day_substract(date){
             
        var newdate = new Date(date);
        newdate.setDate(newdate.getDate() - 1);
        return new Date(newdate);
    }

    function Subtract_Single_day_Addition(date){
             
        var newdate = new Date(date);
        newdate.setDate(newdate.getDate() + 1);
        return new Date(newdate);
    }

    function Time_Onley(dt){

        var hour = parseInt(dt.getHours());
        var minute = parseInt(dt.getMinutes());
        var seconds = parseInt(dt.getSeconds());
        if(hour < 10){
            hour = "0"+ hour;
        }
        if(minute < 10){
            minute = "0"+ minute;
        }
        if(seconds < 10){
            seconds = "0"+ seconds;
        }


        var time = hour + ":" + minute + ":" + seconds;
        return time;

    }

    //Zero

    function fun_weekDayCount_AddZeroDay(count){

       
        
        var newDate = new Date(momment_newDate_convert_YYYY_MM_DD(MomentConvert_currentDay_Date())); //new Date();
        var days = ['Sun','Mon','Tues','Wed','Thrus','Fri','Sat'];
        var currentDay = days[newDate.getDay()];  
        if(currentDay == 'Sun'){
            return count = count - 1;
        }
        else if(currentDay == 'Mon'){

            return count = count - 2;

        }
        else if(currentDay == 'Tues'){

            return count = count - 2;

        }
        else if(currentDay == 'Wed'){

            return count = count - 2;

        }
        else if(currentDay == 'Thrus'){

            return count = count - 2;

        }
        else if(currentDay == 'Fri'){

            return count = count - 1;

        }

        else if(currentDay == 'Sat'){

            return count = count - 1;

        }
        else{
            return false;
        }  

    }

    function fun_weekendCount_AddZeroDay(count){

       
        
        //var newDate = new Date();
        var newDate = new Date(momment_newDate_convert_YYYY_MM_DD(MomentConvert_currentDay_Date())); //new Date();

        var days = ['Sun','Mon','Tues','Wed','Thrus','Fri','Sat'];
        var currentDay = days[newDate.getDay()];  
        if(currentDay == 'Sun'){
            return count - 1;
        }
        else if(currentDay == 'Mon'){

            return count = count;

        }
        else if(currentDay == 'Tues'){

            return count = count;

        }
        else if(currentDay == 'Wed'){

            return count = count;

        }
        else if(currentDay == 'Thrus'){

            return count = count - 1;

        }
        else if(currentDay == 'Fri'){

            return count = count - 2;

        }
        else if(currentDay == 'Sat'){

            return count = count - 2;

        }
        else{
            return false;
        }  

    }


    function fun_weekDayCount_AddOneDay(count){

       
        
        //var newDate = new Date();
        var newDate = new Date(momment_newDate_convert_YYYY_MM_DD(MomentConvert_currentDay_Date())); //new Date();

        var days = ['Sun','Mon','Tues','Wed','Thrus','Fri','Sat'];
        var currentDay = days[newDate.getDay()];  
        if(currentDay == 'Sun'){
            return count = count - 2;
        }
        else if(currentDay == 'Mon'){

            return count = count - 2;

        }
        else if(currentDay == 'Tues'){

            return count = count - 2;

        }
        else if(currentDay == 'Wed'){

            return count = count - 2;

        }
        else if(currentDay == 'Thrus'){

            return count = count - 1;

        }
        else if(currentDay == 'Fri'){

            return count = count;

        }

        else if(currentDay == 'Sat'){

            return count = count - 1;

        }
        else{
            return false;
        }  

    }

    function fun_weekendCount_AddOneDay(count){

       
        //var newDate = new Date();
        var newDate = new Date(momment_newDate_convert_YYYY_MM_DD(MomentConvert_currentDay_Date())); //new Date();

        var days = ['Sun','Mon','Tues','Wed','Thrus','Fri','Sat'];
        var currentDay = days[newDate.getDay()];  
        if(currentDay == 'Sun'){
            return count;
        }
        else if(currentDay == 'Mon'){

            return count = count;

        }
        else if(currentDay == 'Tues'){

            return count = count;

        }
        else if(currentDay == 'Wed'){

            return count = count;

        }
        else if(currentDay == 'Thrus'){

            return count = count - 1;

        }
        else if(currentDay == 'Fri'){

            return count = count - 2;

        }
        else if(currentDay == 'Sat'){

            return count = count - 1;

        }
        else{
            return false;
        }  

    }


    function fun_weekDayCount_AddTwoDay(count){

       
        //var newDate = new Date();
        var newDate = new Date(momment_newDate_convert_YYYY_MM_DD(MomentConvert_currentDay_Date())); //new Date();

        var days = ['Sun','Mon','Tues','Wed','Thrus','Fri','Sat'];
        var currentDay = days[newDate.getDay()];  
        if(currentDay == 'Sun'){
            return count = count - 1;
        }
        else if(currentDay == 'Mon'){

            return count = count - 1;

        }
        else if(currentDay == 'Tues'){

            return count = count - 1;

        }
        else if(currentDay == 'Wed'){

            return count = count - 1;

        }
        else if(currentDay == 'Thrus'){

            return count = count;

        }
        else if(currentDay == 'Fri'){

            return count = count;

        }

        else if(currentDay == 'Sat'){

            return count = count - 1;

        }
        else{
            return false;
        }  

    }

    function fun_weekendCount_AddTwoDay(count){

        
        //var newDate = new Date();
        var newDate = new Date(momment_newDate_convert_YYYY_MM_DD(MomentConvert_currentDay_Date())); //new Date();

        var days = ['Sun','Mon','Tues','Wed','Thrus','Fri','Sat'];
        var currentDay = days[newDate.getDay()];  
        if(currentDay == 'Sun'){
            return count;
        }
        else if(currentDay == 'Mon'){

            return count = count;

        }
        else if(currentDay == 'Tues'){

            return count = count;

        }
        else if(currentDay == 'Wed'){

            return count = count;

        }
        else if(currentDay == 'Thrus'){

            return count = count - 1;

        }
        else if(currentDay == 'Fri'){

            return count = count - 1;

        }
        else if(currentDay == 'Sat'){

            return count = count;

        }
        else{
            return false;
        }  

    }

    function calculationOFTwoDateDifferenceINHour(startDate,EndDate){
       
        var msIn1Hour = 3600 * 1000;
        var TodayDate = startDate;
        var FutureDate = EndDate;
        var calcTime = (FutureDate - TodayDate)/msIn1Hour;
        if(calcTime <= 2){
            return TodayDate.toString();
        }
        else{

            return FutureDate.toString();

        }
        

    }







function DaysCheking_For_Friday_by_Owner(obj){
    

    var timer1 = $("#sheduler-calender-timer1").val();

        var start_str = new Date();         

        //start_str = new Date(start_str.setHours(conver_Hours(timer1),conver_Minit(timer1),00,0));
        var sss = JSON.parse(sessionStorage.getItem("SettNextBookingDays_boat_ownerLog"));
        //var ssss = 

        var Next_Booking_Days_check = new Date().toString();//JSON.parse(sessionStorage.getItem("SettNextBookingDays_boat_ownerLog"));
       
      var Current_Date =getFormattedDate_WithOut_Zero_Time(Jqueary_string_to_Date_Convert(getFormattedDate_WithOut_Zero_Time(Next_Booking_Days_check)));
      var Booking_StartDate = getFormattedDate_WithOut_Zero_Time(Jqueary_string_to_Date_Convert(getFormattedDate_WithOut_Zero_Time(obj.start)));


      //var currentDates_addOneday =getFormattedDate_WithOut_Zero_Time(adding_MultipleDays(obj.start,1));// currentDates_addOneday_tmp.addDays(1);
     // var currentDates_addTwoday =getFormattedDate_WithOut_Zero_Time(adding_MultipleDays(obj.start,2));// currentDates_addOneday_tmp.addDays(1);
     



      if(Current_Date == Booking_StartDate)
      {
         

        if(getFormattedDate_Friday_only(start_str) == true)
        {
            alert("00000 Error.... inform developer");
        }

      }
      else{
         
      }

    


}

function NextBookindDay_Calculation_OwnerLogin(obj){
  
    
    var Next_Booking_Days_check = JSON.parse(sessionStorage.getItem("SettNextBookingDays_boat_ownerLog"));
    var data = Next_Booking_Days_check.response[0];
    var data_2 = data.BoatDetails[0];
    //SettNextBookingDays_boat_ownerLog
    console.log(Next_Booking_Days_check);
    var currentDate_tmp = new Date(momment_newDate_convert_YYYY_MM_DD(MomentConvert_currentDay_Date())).toString();

    var Launch_Date = Jqueary_string_to_Date_Convert(getFormattedDate_WithOut_Zero_Time(data_2.Launch_Date));
   // var Current_Date =Jqueary_string_to_Date_Convert(getFormattedDate_WithOut_Zero_Time(Next_Booking_Days_check.currentdate));
    var Current_Date =Jqueary_string_to_Date_Convert(getFormattedDate_WithOut_Zero_Time(currentDate_tmp));
   
   
   var Booking_StartDate = Jqueary_string_to_Date_Convert(getFormattedDate_WithOut_Zero_Time(obj.start));
    var Next_BookingDay =data.Next_BookingDay;
    
    if(Launch_Date > Current_Date){

        //calc_next = 

        var expectedDate_NextBooking = adding_MultipleDays(Launch_Date,parseInt(Next_BookingDay));
        if(expectedDate_NextBooking >= Booking_StartDate){
            return true;
        }
        else{
            return false;
        }

    }
    else if(Launch_Date < Current_Date){

        var expectedDate_NextBooking = adding_MultipleDays(Current_Date,Next_BookingDay);
        if(expectedDate_NextBooking >= Booking_StartDate){
            return true;
        }
        else{
            return false;
        }

    }
    else if(Launch_Date == Current_Date){

        var expectedDate_NextBooking = adding_MultipleDays(Current_Date,Next_BookingDay);
        if(expectedDate_NextBooking >= Booking_StartDate){
            return true;
        }
        else{
            return false;
        }

    }



   return false;
}



function NextBookindDay_Calculation_AdminBase(obj){
  
    
    var Next_Booking_Days_check = JSON.parse(sessionStorage.getItem("SettNextBookingDays_boat"));
    var data = Next_Booking_Days_check;//.response[0];
    var data_2 = data.BoatDetails[0];
    //SettNextBookingDays_boat_ownerLog
    console.log(Next_Booking_Days_check);
    var currentDate_tmp = new Date(momment_newDate_convert_YYYY_MM_DD(MomentConvert_currentDay_Date())).toString();

    var Launch_Date = Jqueary_string_to_Date_Convert(getFormattedDate_WithOut_Zero_Time(data_2.Launch_Date));
   // var Current_Date =Jqueary_string_to_Date_Convert(getFormattedDate_WithOut_Zero_Time(Next_Booking_Days_check.currentdate));
    var Current_Date =Jqueary_string_to_Date_Convert(getFormattedDate_WithOut_Zero_Time(currentDate_tmp));
   
   
   var Booking_StartDate = Jqueary_string_to_Date_Convert(getFormattedDate_WithOut_Zero_Time(obj.start));
    var Next_BookingDay =data.Next_BookingDay;
    
    if(Launch_Date > Current_Date){

        //calc_next = 

        var expectedDate_NextBooking = adding_MultipleDays(Launch_Date,parseInt(Next_BookingDay));
        if(expectedDate_NextBooking >= Booking_StartDate){
            return true;
        }
        else{
            return false;
        }

    }
    else if(Launch_Date < Current_Date){

        var expectedDate_NextBooking = adding_MultipleDays(Current_Date,Next_BookingDay);
        if(expectedDate_NextBooking >= Booking_StartDate){
            return true;
        }
        else{
            return false;
        }

    }
    else if(Launch_Date == Current_Date){

        var expectedDate_NextBooking = adding_MultipleDays(Current_Date,Next_BookingDay);
        if(expectedDate_NextBooking >= Booking_StartDate){
            return true;
        }
        else{
            return false;
        }

    }



   return false;
}





// $(document).on("click",".tui-full-calendar-weekday-schedule",function() {

//     var tmp_data = $(this).attr('data-schedule-id');


// });

function Back_To_Back_Booking_Calculation_Edit(obj){
    //this to start.........
    
    var shedulerList_tmp = ScheduleList;
    obj.Back_to_Back_Booking = false;
    var fist_Chek_id =0;
    obj.Back_to_Back_id = 0;
   
    $.each(shedulerList_tmp, function (key, val) {
                
        if((obj.User_Id == val.Owner_Id) && (obj.Boat_Id == val.Boat_Id))
        {    
            var shedul_EndDate_tmp = getFormattedDate_WithOut_Zero_Time(val.end);
            var obj_StartDate_tmp = getFormattedDate_WithOut_Zero_Time(Subtract_Single_day_substract(obj.start));
           
            if(shedul_EndDate_tmp == obj_StartDate_tmp )
            {
                              
                obj.Back_to_Back_Booking = true;
               
                fist_Chek_id = 1;
                
                    if(obj.Back_to_Back_id != 2)
                    {
                       
                    obj.Back_to_Back_id = 3;
                    obj.Back_to_Back_Sheduler_id = obj._id;
                    obj._id = val.id;

                    }    
            }
    
    
            var shedul_Start_Date_tmp = getFormattedDate_WithOut_Zero_Time(val.start);
            var obj_End_Date_tmp = getFormattedDate_WithOut_Zero_Time(Subtract_Single_day_Addition(obj.end));
           
            if(shedul_Start_Date_tmp == obj_End_Date_tmp )
            {
                           
                obj.Back_to_Back_Booking = true;
               
                if(fist_Chek_id == 0){

                    obj.Back_to_Back_id = 3;
                    obj.Back_to_Back_Sheduler_id = val.id
                    //obj._id = val.id;

                }
                obj.end = val.end;  
    
            }
        
        }                 
    });    
    
        return obj;
    
    }

function Back_To_Back_Booking_Calculation(obj){
//this to start.........

var shedulerList_tmp = ScheduleList;
obj.Back_to_Back_Booking = false;
obj.isAStandByBooking = false;
var fist_Chek_id =0;
obj.Back_to_Back_id = 0;
var fix_valId_3_ = 0;
obj.isThisAOwnerCanceledStandByBooking = false;
var isThisAOwnerCanceledStandByBooking_firstchek = true;
//var chek_3_condition = 0;


$.each(shedulerList_tmp, function (key, val) {

                    
    if((obj.User_Id == val.Owner_Id) && (obj.Boat_Id == val.Boat_Id))
    {

        
       
        var shedul_EndDate_tmp = getFormattedDate_WithOut_Zero_Time(val.end);
        var obj_StartDate_tmp = getFormattedDate_WithOut_Zero_Time(Subtract_Single_day_substract(obj.start));
       
        if(shedul_EndDate_tmp == obj_StartDate_tmp )
        {
            
            
            obj.Back_to_Back_Booking = true;
            obj.isAStandByBooking = val.isAStandByBooking;
            obj._id = val.id;
            fist_Chek_id = 1;
            if(isThisAOwnerCanceledStandByBooking_firstchek == true)
            {
                obj.isThisAOwnerCanceledStandByBooking = val.isThisAOwnerCanceledStandByBooking;
                isThisAOwnerCanceledStandByBooking_firstchek = false;

            }
            
            if(obj.Back_to_Back_id != 3 )
            {
                if(obj.Back_to_Back_id != 2)
                {
                   
                obj.Back_to_Back_id = 1;
                obj.Back_to_Back_Sheduler_id = val.id;

                }

                else if(obj.Back_to_Back_id == 2){
                    obj.Back_to_Back_id = 3;
                    obj.Back_to_Back_Sheduler_id = fix_valId_3_;
                   // obj.start = chek_3_condition;
                   
                }


                
            }
            

            //return obj;

        }


        var shedul_Start_Date_tmp = getFormattedDate_WithOut_Zero_Time(val.start);
        var obj_End_Date_tmp = getFormattedDate_WithOut_Zero_Time(Subtract_Single_day_Addition(obj.end));
       
        if(shedul_Start_Date_tmp == obj_End_Date_tmp )
        {
            
            
            obj.Back_to_Back_Booking = true;
            obj.isAStandByBooking = val.isAStandByBooking;
            if(fist_Chek_id == 0){
                obj._id = val.id;
                obj.back_onechange_key = val.id;
                obj.Back_to_Back_id = 2;
                obj.Back_to_Back_Sheduler_id = val.id;
                fix_valId_3_ = val.id;
            }
            obj.end = val.end

            if(fist_Chek_id != 0){
                obj.Back_to_Back_id = 3;
                obj.Back_to_Back_Sheduler_id = val.id
               // obj.start = chek_3_condition;
               
            }
            

           // return obj;

        }


        




        

    }                 
});

//Subtract_Single_day_Addition.......



    return obj;

}

function UPDATE_Schedule_ApiCalling(obj){ 

    if(obj.Check_Status ==  1){

        // (before_Launch_date_message);
         let message = before_Launch_date_message;
         let section = 6;
         let transferData = obj;

         Commen_ConformationMessage(message,section,transferData)//

     }
     else{

        Update_API_calculate_NextBookingDays_MessageBase(obj);

     }
    
   

}



/*


function old_Code_Edit_ownerLogin(){
   // else if(checkController == "Update"){

        var startdate_date = new Date($("#tui-full-calendar-schedule-start-date").val());
        var enddate_date = new Date( $("#tui-full-calendar-schedule-end-date").val());
        var start_str =startdate_date .toString();
        var end_str = enddate_date.toString();    
        var AdminId_get = sessionStorage.getItem("UserId");
        
        // day calculations.....
        const Temp_Date_start = new Date(startdate_date);                        
        const Temp_Date_end = new Date(enddate_date);
        var Temp_Date_dateDiff= Math.round((Temp_Date_end - Temp_Date_start)/(1000*60*60*24));
        var Temp_Date_Winter_dateDiff = Temp_Date_dateDiff+1;
        const Temp_Date_sundays = Math.floor((Temp_Date_Winter_dateDiff + (Temp_Date_start.getDay() + 6) % 7) / 7);
        const Temp_Date_weekenddays = 2 * Temp_Date_sundays + (Temp_Date_end.getDay()==6) - (Temp_Date_start.getDay()==0);                        
        const Temp_Date_weekdays = Temp_Date_Winter_dateDiff - Temp_Date_weekenddays;

       
    // ...................  
        var obj = Object();

        obj.TotalDay_Count = Temp_Date_dateDiff;
        obj.WeekEnd_Count = Temp_Date_weekenddays;
        obj.WeekDay_Count = Temp_Date_weekdays;
        
        obj._id = public_shedulDataId;
        obj.User_RoleType = "Owner";
        obj.User_Id = user_id_owner;
        obj.Admin_Id = AdminId_get;

        obj.Boat_Id = dataGet_AdminSelectBoat._id;
        obj.Boat_Name = dataGet_AdminSelectBoat.Boat_Name;
    
        obj.title = setTitle;
        obj.body = true;
        obj.start = start_str;
        obj.end = end_str;
        obj.goingDuration ="";
        obj.comingDuration ="";
        obj.isAllDay = true;
        obj.category = "allday";
        obj.dueDateClass = "morning";
        obj.location = ""; 
        //obj.attendees = "false"; // this is string arry..
        obj.recurrenceRule = ""; //string..
        obj.isPending = false;
        obj.isFocused = false;
        obj.isVisible = true;
        obj.isReadOnly = false;
        obj.isPrivate = true;
        obj.color = "#ffffff";
        obj.bgColor = "#047b0f";
        obj.dragBgColor = "#047b0f";
        obj.borderColor = "#047b0f";
        obj.customStyle ="";
        obj.raw ="";
        obj.state ="";
        obj.Status = "Enable";
        obj.IsActive = true;
        $.ajax({
            url: public_URL+"EditSchedule",
            type: 'POST',
            dataType: 'json', 
            data: obj,
            success: function(datas) {
                sessionStorage.setItem("datatrrigerd_ownerlogin",1);
                if(datas.status == true)
                {
                    CommenMessage(datas.message);
                    //location.reload();

                }
                else if(datas.status == false){
                        
                    CommenMessage(datas.message);                                   
    
                }
            

            },
            error: function (error) {          
                        
            }
        });

    
    }
//}

*/



$(document).on("click","#span-IsLOAIncluded-booking",function() { 

   
    
    console.log(public_IsLOAIncluded);
        $.ajax({
        url: public_URL+"EditSchedule",
        type: 'POST',
        dataType: 'json', 
        data: public_IsLOAIncluded,
        success: function(datas) { 
         
          sessionStorage.setItem("datatrrigerd_ownerlogin",1);
            if(datas.status == true)
            {
                CommenMessage_save(datas.message);
                //location.reload();    
            }
            else if(datas.status == false)
            {    
                           
                CommenMessage(datas.message);
              
            }
            

        

        },
        error: function (error) {  
                         
           
            console.log(error.responseText);
           // CommenMessage(error.responseText);
                    
        }
    });

   

});


function CommenMessage(obj){
    $("#h4-message-type").text("Message");
    $("#p-message-content").text(obj);
    $('#btn-CommenMessage-disp-btns').trigger('click');
    
}

function CommenMessage_save(obj){
    $("#h4-message-save-type").text("Message");
    $("#p-message-save-content").text(obj);
    $('#btn-CommenMessage-save-disp-btns').trigger('click');
    
}




function GetAllUnAvailableDays_settings(obj){

    public_Global_unavilable = false; 
          
        var datas = JSON.parse(sessionStorage.getItem("GetAllUnAvailableDays_Owners"));
        var data_2_boat_Temp = JSON.parse(sessionStorage.getItem("Owner_pg_boatListed")); 
        
        console.log(datas);
        console.log(data_2_boat_Temp);

        if(data_2_boat_Temp != null)
        {            
            datas = datas.response.filter(x => x.Boat_Id == data_2_boat_Temp._id);

        }

        
        if(data_2_boat_Temp == null){
            
         data_2_boat_Temp = JSON.parse(sessionStorage.getItem("AdminSelectBoat"));
         datas = datas.response.filter(x => x.Boat_Id == data_2_boat_Temp._id);         


        }
        
        
        //
        if (typeof datas !== "undefined" && datas != null) 
        {

            
            var startDate = new Date(obj.start);
            var stopDate = new Date(obj.end);
            
            var temp_res = ["12/26/2010","12/26/2010"]; //mm/dd/yyyy exsample
            
             
            //var response = datas.response;           
            var temp_unAvilable = []; 
            
            if (typeof temp_res !== "undefined" && temp_res != null) 
            {
                $.each(temp_res, function(index, valTmp2) {  
                                 
                    var str_tmp = Jqueary_string_to_Date_Convert_slash_unavilable(valTmp2);//new Date(val);
                    temp_unAvilable.push(getFormattedDate_WithOut_Zero_Time(str_tmp));               
                }); 

                   
                 $.each(datas, function(index, val) {
                    
                     
                     
                     if(data_2_boat_Temp._id == val.Boat_Id){
                        
                        
                        $.each(val.UnAvailableDates, function(index, valTmp2) { 
                               
                           
                            
                            var str_tmp = Jqueary_string_to_Date_Convert_slash_unavilable(valTmp2);//new Date(val);
                            temp_unAvilable.push(getFormattedDate_WithOut_Zero_Time(str_tmp));               
                        });

                     } 
                    
                 });

                                  
    
                var allDate =  getAllDates(startDate, stopDate);
                ///................single date check...........

                if(allDate.length == 1){
                    var temp_1 =  allDate[0];
                    allDate.push(temp_1);
                }

                /////////////////////////////////......................

                var FirstChek = 0;
                var Confirm_StartDate = null;
                var ConFirm_EndDate = null;            
                $.each(allDate, function(index, val) { 
                
                                                   
                    if(FirstChek == 0)
                    {
                        var tmp_values = getFormattedDate_WithOut_Zero_Time(val);
                                           
                        if(jQuery.inArray(tmp_values, temp_unAvilable) !== -1) { 
                             
                             public_Global_unavilable = true;                       
                             CommenMessage("This date ( "+tmp_values+" ) is unavilable");

                            return false;
                        } else {                            
                            Confirm_StartDate = val; 
                        }                   
                        
                        FirstChek = 1;
                    }
                    else{
    
                        var tmp_values = getFormattedDate_WithOut_Zero_Time(val);
                                                            
                        if(jQuery.inArray(tmp_values, temp_unAvilable) !== -1) {                           
                            public_Global_unavilable = true;
                            CommenMessage("This date ( "+tmp_values+" ) is unavilable");
                            return false;
                        } else {                           
                            ConFirm_EndDate = val; 
                        }                      
    
                    }               
    
                });
    
               
    
                    if(Confirm_StartDate != null && ConFirm_EndDate != null)
                    {
                       
                        obj.start = Confirm_StartDate;
                        obj.end = ConFirm_EndDate;
                                          
                       var datas_2 = JSON.parse(sessionStorage.getItem("GetUnAvailabeDaysOfBoats_Owners"));         
                       var data_2_boat = JSON.parse(sessionStorage.getItem("AdminSelectBoat"));                        
                            if ((typeof datas_2 !== "undefined" && datas_2 != null) && 
                                (typeof data_2_boat !== "undefined" && data_2_boat != null) ) 
                                {
                                
                                 var temp_unAvilable_Boats = [];                             
                                 var tmp_Unavilable = datas_2.find(x => x.Boat_Id == data_2_boat._id);
    
                                 if(typeof tmp_Unavilable !== "undefined" && tmp_Unavilable != null){
    
                                    $.each(tmp_Unavilable.UnAvailableDates, function(index, val2) {  
                                        
                                        
                                        
                                        var str_tmp = Jqueary_string_to_Date_Convert_slash(val2);//new Date(val2);
                                        temp_unAvilable_Boats.push(getFormattedDate_WithOut_Zero_Time(str_tmp));               
                                     });                              
                                            
                                     var allDate =  getAllDates(obj.start, obj.end);
                                    var FirstChek = 0;
                                    var Confirm_StartDate = null;
                                    var ConFirm_EndDate = null;            
                                    $.each(allDate, function(index, val) {   
                                                                                                                       
                                        if(FirstChek == 0)
                                        {
                                            var tmp_values = getFormattedDate_WithOut_Zero_Time(val);
                                                            
                                            if(jQuery.inArray(tmp_values, temp_unAvilable_Boats) !== -1) {  
                                                 
                                                public_Global_unavilable = true;                       
                                                CommenMessage("This date ( "+tmp_values+" ) is unavilable");
                                                return false;
                                            } else {                                                
                                                Confirm_StartDate = val; 
                                            }                   
                                            
                                            FirstChek = 1;
                                        }
                                        else{
        
                                            var tmp_values = getFormattedDate_WithOut_Zero_Time(val);
                                                                                
                                            if(jQuery.inArray(tmp_values, temp_unAvilable_Boats) !== -1) {                                                
                                                public_Global_unavilable = true;
                                                CommenMessage("This date ( "+tmp_values+" ) is unavilable");
                                                return false;
                                            } else {
                                                
                                                ConFirm_EndDate = val; 
                                            }                      
        
                                        }               
        
                                    });
                                   
                                    obj.start = Confirm_StartDate;
                                    obj.end = ConFirm_EndDate;
        
                                    AddSchedule_ApiCalling(obj);  //last..
    
                                 }
                                 else{
    
                                    AddSchedule_ApiCalling(obj); //last..
    
                                 }
                                 
                                
    
                               
    
                            }
                            else{
    
                                CommenMessage("Boat selected unavilable");
                                
    
                            }
    
                        
                    } 
                    else{
                        

                        CommenMessage("You are trying to book an unavailable day");
                    }          
            }
            else{


                CommenMessage("code No 1");

                

            }
           

        
           
            
           
        }
        else{
            CommenMessage("You cannot book on these days since the date of booking selection is before pre-launch date.")
        }           
     
     }



function GetAllUnAvailableDays_settings_UPDATE(obj){
   
    
        public_Global_unavilable = false;    
    
                obj.start =  Jqueary_string_to_Date_Convert(getFormattedDate_WithOut_Zero_Time(obj.start)).toString();
                obj.end  = Jqueary_string_to_Date_Convert(getFormattedDate_WithOut_Zero_Time(obj.end)).toString();
    
                var datas = JSON.parse(sessionStorage.getItem("GetAllUnAvailableDays_Owners"));
                var data_2_boat_Temp = JSON.parse(sessionStorage.getItem("Owner_pg_boatListed"));         
                
                if(data_2_boat_Temp == null){
                    
                 data_2_boat_Temp = JSON.parse(sessionStorage.getItem("AdminSelectBoat"));         
        
        
                }
                
                
                //
                if (typeof datas !== "undefined" && datas != null) 
                {
        
                    if(datas.status == true)
                    {
                    var startDate = new Date(obj.start);
                    var stopDate = new Date(obj.end);
                    // try{
                    //     var temp_res = datas.CommonDays[0];
    
                    // }catch{
    
                    // }
    
                    var temp_res = ["12/26/2010","12/27/2010"];
                     
                    //var response = datas.response;           
                    var temp_unAvilable = []; 
                    
                    if (typeof temp_res !== "undefined" && temp_res != null) 
                    {
                        $.each(temp_res, function(index, valTmp2) {                
                            var str_tmp = Jqueary_string_to_Date_Convert_slash_unavilable(valTmp2); //new Date(val);
                            temp_unAvilable.push(getFormattedDate_WithOut_Zero_Time(str_tmp));               
                        }); 
        
                            
                         $.each(datas.response, function(index, val) {
                            
                             
                             
                             if(data_2_boat_Temp._id == val.Boat_Id){
                                 
                                
                                $.each(val.UnAvailableDates, function(index, valTmp2) { 
                                                   
                                    
                                    var str_tmp = Jqueary_string_to_Date_Convert_slash_unavilable(valTmp2); //new Date(val);
                                    temp_unAvilable.push(getFormattedDate_WithOut_Zero_Time(str_tmp));               
                                });
        
                             } 
                            
                         });
                         
        
                                      
                        
            
                        var allDate =  getAllDates(startDate, stopDate);
    
                         ///................single date check...........
    
                            if(allDate.length == 1){
                                var temp_1 =  allDate[0];
                                allDate.push(temp_1);
                            }
    
                        /////////////////////////////////......................
    
                        var FirstChek = 0;
                        var Confirm_StartDate = null;
                        var ConFirm_EndDate = null;            
                        $.each(allDate, function(index, val) {               
                            if(FirstChek == 0)
                            {
                                var tmp_values = getFormattedDate_WithOut_Zero_Time(val);
                                                   
                                if(jQuery.inArray(tmp_values, temp_unAvilable) !== -1) {  
                                     //console.log("is in array"); 
                                     public_Global_unavilable = true;                       
                                     CommenMessage("This date ( "+tmp_values+" ) is unavilable");
                                    return false;
                                } else {
                                    //console.log("is NOT in array");
                                    Confirm_StartDate = val; 
                                }                   
                                
                                FirstChek = 1;
                            }
                            else{
            
                                var tmp_values = getFormattedDate_WithOut_Zero_Time(val);
                                                                    
                                if(jQuery.inArray(tmp_values, temp_unAvilable) !== -1) {
                                    //console.log("is in array");
                                    public_Global_unavilable = true;
                                    CommenMessage("This date ( "+tmp_values+" ) is unavilable");
                                    return false;
                                } else {
                                    //console.log("is NOT in array");
                                    ConFirm_EndDate = val; 
                                }                      
            
                            }               
            
                        });
            
            
                            if(Confirm_StartDate != null && ConFirm_EndDate != null)
                            {
                               
                                obj.start = Confirm_StartDate;
                                obj.end = ConFirm_EndDate;
                                //AddSchedule_ApiCalling(obj); 
                               // GetUnAvailabeDaysOfBoats_Owner(obj);                   
                               var datas_2 = JSON.parse(sessionStorage.getItem("GetUnAvailabeDaysOfBoats_Owners"));         
                               var data_2_boat = JSON.parse(sessionStorage.getItem("AdminSelectBoat"));                        
                                    if ((typeof datas_2 !== "undefined" && datas_2 != null) && 
                                        (typeof data_2_boat !== "undefined" && data_2_boat != null) ) 
                                        {
                                        
                                         var temp_unAvilable_Boats = [];                             
                                         var tmp_Unavilable = datas_2.find(x => x.Boat_Id == data_2_boat._id);
            
                                         if(typeof tmp_Unavilable !== "undefined" && tmp_Unavilable != null){
            
                                            $.each(tmp_Unavilable.UnAvailableDates, function(index, val2) {                              
                                                var str_tmp = new Date(val2);
                                                temp_unAvilable_Boats.push(getFormattedDate_WithOut_Zero_Time(str_tmp));               
                                             });                              
                                             //var aaa = temp_unAvilable_Boats;
                
                                             var allDate =  getAllDates(obj.start, obj.end);
                                            var FirstChek = 0;
                                            var Confirm_StartDate = null;
                                            var ConFirm_EndDate = null;            
                                            $.each(allDate, function(index, val) {               
                                                if(FirstChek == 0)
                                                {
                                                    var tmp_values = getFormattedDate_WithOut_Zero_Time(val);
                                                                    
                                                    if(jQuery.inArray(tmp_values, temp_unAvilable_Boats) !== -1) {  
                                                        //console.log("is in array");  
                                                        public_Global_unavilable = true;                      
                                                        CommenMessage("This date ( "+tmp_values+" ) is unavilable");
                                                        return false;
                                                    } else {
                                                        //console.log("is NOT in array");
                                                        Confirm_StartDate = val; 
                                                    }                   
                                                    
                                                    FirstChek = 1;
                                                }
                                                else{
                
                                                    var tmp_values = getFormattedDate_WithOut_Zero_Time(val);
                                                                                        
                                                    if(jQuery.inArray(tmp_values, temp_unAvilable_Boats) !== -1) {
                                                        //console.log("is in array");
                                                        public_Global_unavilable = true;
                                                        CommenMessage("This date ( "+tmp_values+" ) is unavilable");
                                                        return false;
                                                    } else {
                                                        //console.log("is NOT in array");
                                                        ConFirm_EndDate = val; 
                                                    }                      
                
                                                }               
                
                                            });
                                           
                                            obj.start = Confirm_StartDate;
                                            obj.end = ConFirm_EndDate;
                
                                            UPDATE_Schedule_ApiCalling(obj);
            
                                         }
                                         else{
            
                                            UPDATE_Schedule_ApiCalling(obj);
            
                                         }
                                         
                                        
            
                                       
            
                                    }
                                    else{
            
                                        UPDATE_Schedule_ApiCalling(obj); 
            
                                    }
            
                                
                            } 
                            else{
                               
                                 /// dont this feeld api call
                            }          
                    }
                    else{
        
                        UPDATE_Schedule_ApiCalling(obj); 
        
                    }
                   
        
                    }
                    else{
        
                        UPDATE_Schedule_ApiCalling(obj); 
        
                    }
                    
                   
                }
                else{
                    CommenMessage("You cannot book on these days since the date of booking selection is before pre-launch date.")
                }           
             
    }





$(document).on("click",".tui-full-calendar-popup-save",function() { 
        

    var getbrwserType = sessionStorage.getItem("browserType");
    if(getbrwserType == "Safari"){

        let _passData = "Safari"; 
        //Sheduler_Save_Edit_Safari();
        Sheduler_Save_Edit_Crome_FireFox_Edge(_passData);

    }
    else{

        let _passData = "withOut"; 
     Sheduler_Save_Edit_Crome_FireFox_Edge(_passData);
     
    }
   
            
            
});


function Sheduler_Save_Edit_Crome_FireFox_Edge(_passData){

   
   var fridayBooking = false;
   var standByChekingFrondend = false;
   var previousDay = true;
   

    var pageIdentiFication = sessionStorage.getItem("pageIdentiFiction");    
            
    if(pageIdentiFication == "AdminBooking")
                {
            
                   
                        var checkController = $('.tui-full-calendar-popup-save').children('span').first().text();
                        
                        var dataGet_AdminSelectBoat = sessionStorage.getItem("AdminSelectBoat");
                        if (typeof dataGet_AdminSelectBoat !== "undefined" && dataGet_AdminSelectBoat != null)
                        {
                            
                            dataGet_AdminSelectBoat = JSON.parse(dataGet_AdminSelectBoat);
                            var setTitle = "Admin (" + dataGet_AdminSelectBoat.Boat_Name+")";
            
                                if(checkController == "Save"){    
            
                                var startdate_date = new Date($("#tui-full-calendar-schedule-start-date").val());
                                var enddate_date = new Date( $("#tui-full-calendar-schedule-end-date").val());
                                
                                if(_passData == "Safari"){

                                    var startdate_date = new Date(Safari_suport_Date_format($("#tui-full-calendar-schedule-start-date").val()));
                                    var enddate_date = new Date(Safari_suport_Date_format($("#tui-full-calendar-schedule-end-date").val()));
                                    

                                }
                                
                                
                                
                                var start_str =startdate_date .toString();
                                var end_str = calculationOFTwoDateDifferenceINHour(startdate_date,enddate_date);//enddate_date.toString();    
                                var AdminId_get = sessionStorage.getItem("UserId");
                                
                                // day calculations.....
                                    const Temp_Date_start = new Date(startdate_date);                        
                                    const Temp_Date_end = new Date(enddate_date);
                                    var Temp_Date_dateDiff= Math.round((Temp_Date_end - Temp_Date_start)/(1000*60*60*24));
                                    var Temp_Date_Winter_dateDiff = Temp_Date_dateDiff+1;
                                    const Temp_Date_sundays = Math.floor((Temp_Date_Winter_dateDiff + (Temp_Date_start.getDay() + 6) % 7) / 7);
                                    const Temp_Date_weekenddays = 2 * Temp_Date_sundays + (Temp_Date_end.getDay()==6) - (Temp_Date_start.getDay()==0);                        
                                    const Temp_Date_weekdays = Temp_Date_Winter_dateDiff - Temp_Date_weekenddays;
            
                                    
            
                                // ...................  
                                    var obj = Object();
            
                                    obj.Check_Status = 3;
                                    
                                    obj.TotalDay_Count = parseInt(Temp_Date_dateDiff) + 1;
                                    obj.WeekEnd_Count = Temp_Date_weekenddays;
                                    obj.WeekDay_Count = Temp_Date_weekdays;
                                
                                    obj.User_RoleType = "Admin";
                                    obj.User_Id = AdminId_get;
                                    obj.Admin_Id = AdminId_get;
            
                                    obj.Boat_Id = dataGet_AdminSelectBoat._id;
                                    obj.Boat_Name = dataGet_AdminSelectBoat.Boat_Name;
                                
                                    obj.title = setTitle;
                                    obj.body = true;
                                    obj.start = start_str;
                                    obj.end = end_str;
                                    obj.goingDuration ="";
                                    obj.comingDuration ="";
                                    obj.isAllDay = true;
                                    obj.category = "allday";
                                    obj.dueDateClass = "morning";
                                    obj.location = ""; 
                                    //obj.attendees = "false"; // this is string arry..
                                    obj.recurrenceRule = ""; //string..
                                    obj.isPending = false;
                                    obj.isFocused = false;
                                    obj.isVisible = true;
                                    obj.isReadOnly = false;
                                    obj.isPrivate = true;
                                    obj.color = "#ffffff";
                                    obj.bgColor = "#047b0f";
                                    obj.dragBgColor = "#047b0f";
                                    obj.borderColor = "#047b0f";
                                    obj.customStyle ="";
                                    obj.raw ="";
                                    obj.state ="";
                                    obj.Status = "Enable";
                                    obj.IsActive = true;
            
                                    AddSchedule_ApiCalling(obj);
                                                                     
                            
                                }
                                else if(checkController == "Update")
                                {
            
                                    if(public_shedulData_color != "rgb(44, 70, 248)")
                                    {
            
                                    
            
                                    var startdate_date = new Date($("#tui-full-calendar-schedule-start-date").val());
                                    var enddate_date = new Date( $("#tui-full-calendar-schedule-end-date").val());
                                    
                                    if(_passData == "Safari"){

                                        var startdate_date = new Date(Safari_suport_Date_format($("#tui-full-calendar-schedule-start-date").val()));
                                        var enddate_date = new Date(Safari_suport_Date_format($("#tui-full-calendar-schedule-end-date").val()));
                                        
    
                                    }
                                    
                                    
                                    var start_str =startdate_date .toString();
                                    var end_str = calculationOFTwoDateDifferenceINHour(startdate_date,enddate_date);//enddate_date.toString();    
                                    var AdminId_get = sessionStorage.getItem("UserId");
                                    
                                    // day calculations.....
                                        const Temp_Date_start = new Date(startdate_date);                        
                                        const Temp_Date_end = new Date(enddate_date);
                                        var Temp_Date_dateDiff= Math.round((Temp_Date_end - Temp_Date_start)/(1000*60*60*24));
                                        var Temp_Date_Winter_dateDiff = Temp_Date_dateDiff+1;
                                        const Temp_Date_sundays = Math.floor((Temp_Date_Winter_dateDiff + (Temp_Date_start.getDay() + 6) % 7) / 7);
                                        const Temp_Date_weekenddays = 2 * Temp_Date_sundays + (Temp_Date_end.getDay()==6) - (Temp_Date_start.getDay()==0);                        
                                        const Temp_Date_weekdays = Temp_Date_Winter_dateDiff - Temp_Date_weekenddays;
                
                                        
                
                                    // ...................  
                                        var obj = Object();
                
                                        obj.Check_Status = 3;
            
                                        obj._id = public_shedulDataId;
                                        obj.Back_to_Back_id = 0;
                                        
                                        obj.TotalDay_Count = parseInt(Temp_Date_dateDiff) + 1;
                                        obj.WeekEnd_Count = Temp_Date_weekenddays;
                                        obj.WeekDay_Count = Temp_Date_weekdays;
                                    
                                        obj.User_RoleType = "Admin";
                                        obj.User_Id = AdminId_get;
                                        obj.Admin_Id = AdminId_get;
                
                                        obj.Boat_Id = dataGet_AdminSelectBoat._id;
                                        obj.Boat_Name = dataGet_AdminSelectBoat.Boat_Name;
                                    
                                        obj.title = setTitle;
                                        obj.body = true;
                                        obj.start = start_str;
                                        obj.end = end_str;
                                        obj.goingDuration ="";
                                        obj.comingDuration ="";
                                        obj.isAllDay = true;
                                        obj.category = "allday";
                                        obj.dueDateClass = "morning";
                                        obj.location = ""; 
                                        //obj.attendees = "false"; // this is string arry..
                                        obj.recurrenceRule = ""; //string..
                                        obj.isPending = false;
                                        obj.isFocused = false;
                                        obj.isVisible = true;
                                        obj.isReadOnly = false;
                                        obj.isPrivate = true;
                                        obj.color = "#ffffff";
                                        obj.bgColor = "#047b0f";
                                        obj.dragBgColor = "#047b0f";
                                        obj.borderColor = "#047b0f";
                                        obj.customStyle ="";
                                        obj.raw ="";
                                        obj.state ="";
                                        obj.Status = "Enable";
                                        obj.IsActive = true;
                
                                        UPDATE_Schedule_ApiCalling(obj);
                                    }
                                    else{
            
                                        CommenMessage(Permission_not_allowed_maintenance_message);
            
                                    }
            
                                
                                }
            
                        }
                        else{
                            CommenMessage(select_boat_name_message);
                        }
    }
    else if(pageIdentiFication == "book-for-owner"){
                    
                    
                    var checkController = $('.tui-full-calendar-popup-save').children('span').first().text();
                        
                    var dataGet_AdminSelectBoat = sessionStorage.getItem("AdminSelectBoat");
                    var dataSelected_OwnerDropDown = sessionStorage.getItem("Owner_SelectOwner");
                    if ((typeof dataGet_AdminSelectBoat !== "undefined" && dataGet_AdminSelectBoat != null) 
                       &&(typeof dataSelected_OwnerDropDown !== "undefined" && dataSelected_OwnerDropDown != null) )
                    {
                       
                        dataSelected_OwnerDropDown = JSON.parse(dataSelected_OwnerDropDown);
                        dataGet_AdminSelectBoat = JSON.parse(dataGet_AdminSelectBoat);
                        var setTitle = dataSelected_OwnerDropDown.First_Name  + "(" + dataGet_AdminSelectBoat.Boat_Name+")";
                        var user_id_owner = dataSelected_OwnerDropDown._id;
                                   
                             
                            if(checkController == "Save")
                            { 
                                var newDate_Start = $("#tui-full-calendar-schedule-start-date").val();
                                var newDate_End =   $("#tui-full-calendar-schedule-end-date").val(); 
                                
                                if(_passData == "Safari"){

                                    var newDate_Start = new Date(Safari_suport_Date_format($("#tui-full-calendar-schedule-start-date").val()));
                                    var newDate_End = new Date(Safari_suport_Date_format($("#tui-full-calendar-schedule-end-date").val()));
                                    

                                }
            
                              

                             var _shedule_selectedDates = sheduler_selectedDates(newDate_Start,newDate_End);   

                            var startdate_date = _shedule_selectedDates.newDate_Start; 
                            var enddate_date = _shedule_selectedDates.newDate_End;  


                            var start_str =startdate_date.toString();
                            var end_str = calculationOFTwoDateDifferenceINHour(startdate_date,enddate_date);//enddate_date.toString();    
                            var AdminId_get = sessionStorage.getItem("UserId");
            
                              
                            //this to start
                            
                            var Next_Booking_Days_check = sessionStorage.getItem("SettNextBookingDays_boat");
                            var nextBookingDay = 0;
                            if(typeof Next_Booking_Days_check !== "undefined" && Next_Booking_Days_check != null)
                            {
                                ////sumthinggggg
                                var tmb_Obj = Object()
                                tmb_Obj.Start_Date = startdate_date;
                                tmb_Obj.End_Date = enddate_date;
            
                                nextBookingDay = calculate_NextBookingDays(Next_Booking_Days_check,tmb_Obj);
            
                            }

                                if(nextBookingDay != 404){
                            

                                    let day_Calculation =  dayCalculation(startdate_date,enddate_date);

                                    let dayCalculation_res = day_Calculation.__zone_symbol__value.obj;
                                                
                
                                    var Is_StandByBooking;
                                    
                                    var standByBookingClosed = false;

                                    let dats_standBy = standByCalculation_booking(start_str,dayCalculation_res,Is_StandByBooking,standByChekingFrondend,fridayBooking,previousDay,standByBookingClosed);
                                    debugger;
                                    

                                    let _date_standby = dats_standBy.__zone_symbol__value.obj;

                                    var  Temp_Date_start = _date_standby.Temp_Date_start;
                                    var  Temp_Date_end = _date_standby.Temp_Date_end;
                                    var  Temp_Date_dateDiff = _date_standby.Temp_Date_dateDiff;
                                    var  Temp_Date_Winter_dateDiff = _date_standby.Temp_Date_Winter_dateDiff;
                                    var  Temp_Date_sundays = _date_standby.Temp_Date_sundays;
                                    var  Temp_Date_weekenddays = _date_standby.Temp_Date_weekenddays;
                                    var  Temp_Date_weekdays = _date_standby.Temp_Date_weekdays;

                                        Is_StandByBooking = _date_standby.Is_StandByBooking;
                                        standByChekingFrondend = _date_standby.standByChekingFrondend;
                                        fridayBooking = _date_standby.fridayBooking;
                                        previousDay = _date_standby.previousDay;
                                        standByBookingClosed = _date_standby.standByBookingClosed;


                                        debugger;


                                    ///
                                                        
                                    var obj = Object();
                                    
                                    obj.specialDayCheck = false;
                
                                    obj.Check_Status = nextBookingDay;
                                    obj.Is_StandByBooking = Is_StandByBooking;
                                    obj.fridayBooking = fridayBooking;
                                    obj.standByChekingFrondend = standByChekingFrondend;
                
                                    obj.TotalDay_Count =  parseInt(Temp_Date_dateDiff) + 1;
                                    obj.WeekEnd_Count = Temp_Date_weekenddays;
                                    obj.WeekDay_Count = Temp_Date_weekdays;
                                
                                    obj.User_RoleType = "Owner";
                                    obj.User_Id = user_id_owner;
                                    obj.Admin_Id = AdminId_get;
                
                                    obj.Boat_Id = dataGet_AdminSelectBoat._id;
                                    obj.Boat_Name = dataGet_AdminSelectBoat.Boat_Name;
                                
                                    obj.title = setTitle;
                                    obj.body = true;
                                    obj.start = start_str;
                                    obj.end = end_str;
                                    obj.goingDuration ="";
                                    obj.comingDuration ="";
                                    obj.isAllDay = true;
                                    obj.category = "allday";
                                    obj.dueDateClass = "morning";
                                    obj.location = ""; 
                                    //obj.attendees = "false"; // this is string arry..
                                    obj.recurrenceRule = ""; //string..
                                    obj.isPending = false;
                                    obj.isFocused = false;
                                    obj.isVisible = true;
                                    obj.isReadOnly = false;
                                    obj.isPrivate = true;
                                    obj.color = "#ffffff";
                                    obj.bgColor = "#D50000";
                                    obj.dragBgColor = "#D50000";
                                    obj.borderColor = "#D50000";
                                    obj.customStyle ="";
                                    obj.raw ="";
                                    obj.state ="";
                                    obj.Status = "Enable";
                                    obj.IsActive = true;

                                    if(previousDay == true){
                
                                        if(nextBookingDay != 404)
                                        {                                
                                        
                                            if(standByBookingClosed == false)
                                            {
                                                
                        
                                                if(NextBookindDay_Calculation_AdminBase(obj) == true)
                                                {
                                                
                                                    
                        
                        
                                                    obj = Back_To_Back_Booking_Calculation(obj);
                        
                                                    if(obj.Back_to_Back_Booking == false)
                                                    {
                                                        GetAllUnAvailableDays_settings(obj);
                        
                                                    }
                                                    else if(obj.Back_to_Back_Booking == true)
                                                    {
                                                        if(obj.isAStandByBooking == true)
                                                        {
                                                            if(obj.Back_to_Back_id == 3)
                                                            {
                                                                obj.Back_to_Back_id = 2;
                                                                obj.Back_to_Back_Sheduler_id = obj.back_onechange_key;
                                                                obj._id = obj.back_onechange_key;
                                                                GetAllUnAvailableDays_settings_UPDATE(obj);
                                                            }
                                                            else
                                                            {
                                                                if(obj.Is_StandByBooking == true){
                        
                                                                    obj.end = end_str;
                                                                    GetAllUnAvailableDays_settings(obj);
                        
                                                                }
                                                                else{
                        
                                                                    GetAllUnAvailableDays_settings(obj);
                        
                                                                }
                                                                
                        
                                                            }
                                                            
                        
                                                        }
                                                        else if(obj.Is_StandByBooking == true){
                        
                                                            obj.end = end_str;
                                                            GetAllUnAvailableDays_settings(obj);
                        
                                                        }
                                                        else if(obj.isThisAOwnerCanceledStandByBooking == true){
                                                            GetAllUnAvailableDays_settings(obj);
                        
                                                        }
                                                        else
                                                        {
                                                            GetAllUnAvailableDays_settings_UPDATE(obj);
                                                        }
                                                        
                                                    }
                                                    else{
                                                        CommenMessage(Booking_Type_is_not_available_Message);
                                                    }
                                            }
                                            else{
                                                CommenMessage(contact_Admin_Message);
                                            }
                        
                        
                                            }
                    
                                        }
                                    } 
                                    
                                    
                                }
                                  
                                 
            
                                          
                        
                            }

                            else if(checkController == "Update"){
            
                                if(public_shedulData_color != "rgb(44, 70, 248)"){
            
                                                    var newDate_Start = $("#tui-full-calendar-schedule-start-date").val();
                                                    var newDate_End =  $("#tui-full-calendar-schedule-end-date").val();
                                                    

                                                    if(_passData == "Safari"){

                                                        var newDate_Start = new Date(Safari_suport_Date_format($("#tui-full-calendar-schedule-start-date").val()));
                                                        var newDate_End = new Date(Safari_suport_Date_format($("#tui-full-calendar-schedule-end-date").val()));
                                                        
                    
                                                    }



                                                    var _shedule_selectedDates = sheduler_selectedDates(newDate_Start,newDate_End);   

                                                    var startdate_date = _shedule_selectedDates.newDate_Start; 
                                                    var enddate_date = _shedule_selectedDates.newDate_End;  
                                                    
                                                    
                                                    
                                                    var start_str =startdate_date.toString();
                                                    var end_str = calculationOFTwoDateDifferenceINHour(startdate_date,enddate_date);//enddate_date.toString();    
                                                    var AdminId_get = sessionStorage.getItem("UserId");
                                
                                                
                                                //this to start
                                                
                                                var Next_Booking_Days_check = sessionStorage.getItem("SettNextBookingDays_boat");
                                                var nextBookingDay = 0;
                                                if(typeof Next_Booking_Days_check !== "undefined" && Next_Booking_Days_check != null)
                                                {
                                                    ////sumthinggggg
                                                    var tmb_Obj = Object()
                                                    tmb_Obj.Start_Date = startdate_date;
                                                    tmb_Obj.End_Date = enddate_date;
                                
                                                    nextBookingDay = calculate_NextBookingDays(Next_Booking_Days_check,tmb_Obj);
                                
                                                }
                                                    
                                                if(nextBookingDay != 404){ 
                                                    
                                                    
                                                    let day_Calculation =  dayCalculation(startdate_date,enddate_date);

                                                    let dayCalculation_res = day_Calculation.__zone_symbol__value.obj;
                                                                
                                
                                                    var Is_StandByBooking;
                                                    
                                                    var standByBookingClosed = false;
                
                                                    let dats_standBy = standByCalculation_booking(start_str,dayCalculation_res,Is_StandByBooking,standByChekingFrondend,fridayBooking,previousDay,standByBookingClosed);
                                                    debugger;
                                                    
                
                                                    let _date_standby = dats_standBy.__zone_symbol__value.obj;
                
                                                    var  Temp_Date_start = _date_standby.Temp_Date_start;
                                                    var  Temp_Date_end = _date_standby.Temp_Date_end;
                                                    var  Temp_Date_dateDiff = _date_standby.Temp_Date_dateDiff;
                                                    var  Temp_Date_Winter_dateDiff = _date_standby.Temp_Date_Winter_dateDiff;
                                                    var  Temp_Date_sundays = _date_standby.Temp_Date_sundays;
                                                    var  Temp_Date_weekenddays = _date_standby.Temp_Date_weekenddays;
                                                    var  Temp_Date_weekdays = _date_standby.Temp_Date_weekdays;
                
                                                        Is_StandByBooking = _date_standby.Is_StandByBooking;
                                                        standByChekingFrondend = _date_standby.standByChekingFrondend;
                                                        fridayBooking = _date_standby.fridayBooking;
                                                        previousDay = _date_standby.previousDay;
                                                        standByBookingClosed = _date_standby.standByBookingClosed;



                                
                                                    ///
                                
                                                                        
                                                    var obj = Object();
                                                    
                                                    obj._id = public_shedulDataId;
                                                    obj.Back_to_Back_id = 0;
                                
                                                    obj.specialDayCheck = false;
                                
                                                    obj.Check_Status = nextBookingDay;
                                                    obj.Is_StandByBooking = Is_StandByBooking;
                                                    obj.fridayBooking = fridayBooking;
                                                    obj.standByChekingFrondend = standByChekingFrondend;
                                
                                                    obj.TotalDay_Count =  parseInt(Temp_Date_dateDiff) + 1;
                                                    obj.WeekEnd_Count = Temp_Date_weekenddays;
                                                    obj.WeekDay_Count = Temp_Date_weekdays;
                                                
                                                    obj.User_RoleType = "Owner";
                                                    obj.User_Id = user_id_owner;
                                                    obj.Admin_Id = AdminId_get;
                                
                                                    obj.Boat_Id = dataGet_AdminSelectBoat._id;
                                                    obj.Boat_Name = dataGet_AdminSelectBoat.Boat_Name;
                                                
                                                    obj.title = setTitle;
                                                    obj.body = true;
                                                    obj.start = start_str;
                                                    obj.end = end_str;
                                                    obj.goingDuration ="";
                                                    obj.comingDuration ="";
                                                    obj.isAllDay = true;
                                                    obj.category = "allday";
                                                    obj.dueDateClass = "morning";
                                                    obj.location = ""; 
                                                    //obj.attendees = "false"; // this is string arry..
                                                    obj.recurrenceRule = ""; //string..
                                                    obj.isPending = false;
                                                    obj.isFocused = false;
                                                    obj.isVisible = true;
                                                    obj.isReadOnly = false;
                                                    obj.isPrivate = true;
                                                    obj.color = "#ffffff";
                                                    obj.bgColor = "#D50000";
                                                    obj.dragBgColor = "#D50000";
                                                    obj.borderColor = "#D50000";
                                                    obj.customStyle ="";
                                                    obj.raw ="";
                                                    obj.state ="";
                                                    obj.Status = "Enable";
                                                    obj.IsActive = true;

                                                    if(previousDay == true){
                                
                                                        if(nextBookingDay != 404){
                                    
                                                    
                                                            if(standByBookingClosed == false)
                                                            {
                                                                obj = Back_To_Back_Booking_Calculation_Edit(obj);                    
                                                                GetAllUnAvailableDays_settings_UPDATE(obj);
                                                            }
                                    
                                                    
                                    
                                                    
                                                    
                                                        }
                                                    }
                                
                                
                                                }
                                                
                                                
                                                
                                                
                                                
                                                

                               
                                }

                                else{
            
                                    CommenMessage(Permission_not_allowed_maintenance_message);
            
                                }
                                
                            
                            }
            
                    }
                    else{
                        CommenMessage(select_boat_name_message);
                    }
            
    }
    else if(pageIdentiFication == "boat-maintenance"){
                    
            
                    var checkController = $('.tui-full-calendar-popup-save').children('span').first().text();
                        
                     var dataGet_AdminSelectBoat = sessionStorage.getItem("AdminSelectBoat");
                     if (typeof dataGet_AdminSelectBoat !== "undefined" && dataGet_AdminSelectBoat != null)
                     {
                         
                         dataGet_AdminSelectBoat = JSON.parse(dataGet_AdminSelectBoat);
                         var setTitle = "Maintenance (" + dataGet_AdminSelectBoat.Boat_Name+")";
                        
             
                             if(checkController == "Save")
                             {    
             
                             var startdate_date = new Date($("#tui-full-calendar-schedule-start-date").val());
                             var enddate_date = new Date( $("#tui-full-calendar-schedule-end-date").val());
                             
                             if(_passData == "Safari"){

                                var startdate_date = new Date(Safari_suport_Date_format($("#tui-full-calendar-schedule-start-date").val()));
                                var enddate_date = new Date(Safari_suport_Date_format($("#tui-full-calendar-schedule-end-date").val()));
                                

                            }
                             
                             
                             
                             var start_str =startdate_date .toString();
                             var end_str = calculationOFTwoDateDifferenceINHour(startdate_date,enddate_date);//enddate_date.toString();    
                             var AdminId_get = sessionStorage.getItem("UserId");
                                 
                                 // day calculations.....
                                 const Temp_Date_start = new Date(startdate_date);                        
                                 const Temp_Date_end = new Date(enddate_date);
                                 var Temp_Date_dateDiff= Math.round((Temp_Date_end - Temp_Date_start)/(1000*60*60*24));
                                 var Temp_Date_Winter_dateDiff = Temp_Date_dateDiff+1;
                                 const Temp_Date_sundays = Math.floor((Temp_Date_Winter_dateDiff + (Temp_Date_start.getDay() + 6) % 7) / 7);
                                 const Temp_Date_weekenddays = 2 * Temp_Date_sundays + (Temp_Date_end.getDay()==6) - (Temp_Date_start.getDay()==0);                        
                                 const Temp_Date_weekdays = Temp_Date_Winter_dateDiff - Temp_Date_weekenddays;
            
                                 
                             // ...................  
                                 var obj = Object();
            
                                 obj.TotalDay_Count = parseInt(Temp_Date_dateDiff) + 1;;
                                 obj.WeekEnd_Count = Temp_Date_weekenddays;
                                 obj.WeekDay_Count = Temp_Date_weekdays;
                             
                                 obj.User_RoleType = "Maintenance";
                                 obj.User_Id = AdminId_get;
                                 obj.Admin_Id = AdminId_get;
            
                                 obj.Boat_Id = dataGet_AdminSelectBoat._id;
                                 obj.Boat_Name = dataGet_AdminSelectBoat.Boat_Name;
                             
                                 obj.title = setTitle;
                                 obj.body = true;
                                 obj.start = start_str;
                                 obj.end = end_str;
                                 obj.goingDuration ="";
                                 obj.comingDuration ="";
                                 obj.isAllDay = true;
                                 obj.category = "allday";
                                 obj.dueDateClass = "morning";
                                 obj.location = ""; 
                                 //obj.attendees = "false"; // this is string arry..
                                 obj.recurrenceRule = ""; //string..
                                 obj.isPending = false;
                                 obj.isFocused = false;
                                 obj.isVisible = true;
                                 obj.isReadOnly = false;
                                 obj.isPrivate = true;
                                 obj.color = "#ffffff";
                                 obj.bgColor = "#2c46f8";
                                 obj.dragBgColor = "#2c46f8";
                                 obj.borderColor = "#2c46f8";
                                 obj.customStyle ="";
                                 obj.raw ="";
                                 obj.state ="";
                                 obj.Status = "Enable";
                                 obj.IsActive = true;
            
                                 AddSchedule_ApiCalling(obj);
                             
                                             
                         
                             }
                             else if(checkController == "Update")
                             {
             
                                if((public_shedulData_color != "rgb(213, 0, 0)"))
                                {
                                    if((public_shedulData_color != "rgb(4, 123, 15)")){
            
                                    
                                
                                var startdate_date = new Date($("#tui-full-calendar-schedule-start-date").val());
                                var enddate_date = new Date( $("#tui-full-calendar-schedule-end-date").val());
                                
                                if(_passData == "Safari"){

                                    var startdate_date = new Date(Safari_suport_Date_format($("#tui-full-calendar-schedule-start-date").val()));
                                    var enddate_date = new Date(Safari_suport_Date_format($("#tui-full-calendar-schedule-end-date").val()));
                                    
    
                                }
                                
                                
                                var start_str =startdate_date .toString();
                                var end_str = calculationOFTwoDateDifferenceINHour(startdate_date,enddate_date);//enddate_date.toString();    
                                var AdminId_get = sessionStorage.getItem("UserId");
                                    
                                    // day calculations.....
                                    const Temp_Date_start = new Date(startdate_date);                        
                                    const Temp_Date_end = new Date(enddate_date);
                                    var Temp_Date_dateDiff= Math.round((Temp_Date_end - Temp_Date_start)/(1000*60*60*24));
                                    var Temp_Date_Winter_dateDiff = Temp_Date_dateDiff+1;
                                    const Temp_Date_sundays = Math.floor((Temp_Date_Winter_dateDiff + (Temp_Date_start.getDay() + 6) % 7) / 7);
                                    const Temp_Date_weekenddays = 2 * Temp_Date_sundays + (Temp_Date_end.getDay()==6) - (Temp_Date_start.getDay()==0);                        
                                    const Temp_Date_weekdays = Temp_Date_Winter_dateDiff - Temp_Date_weekenddays;
               
                                    
                                // ...................  
                                    var obj = Object();
               
                                    obj._id = public_shedulDataId;
                                    obj.check_Status="4"
                                    obj.Back_to_Back_id = 0;
            
                                    obj.TotalDay_Count = parseInt(Temp_Date_dateDiff) + 1;;
                                    obj.WeekEnd_Count = Temp_Date_weekenddays;
                                    obj.WeekDay_Count = Temp_Date_weekdays;
                                
                                    obj.User_RoleType = "Maintenance";
                                    obj.User_Id = AdminId_get;
                                    obj.Admin_Id = AdminId_get;
               
                                    obj.Boat_Id = dataGet_AdminSelectBoat._id;
                                    obj.Boat_Name = dataGet_AdminSelectBoat.Boat_Name;
                                
                                    obj.title = setTitle;
                                    obj.body = true;
                                    obj.start = start_str;
                                    obj.end = end_str;
                                    obj.goingDuration ="";
                                    obj.comingDuration ="";
                                    obj.isAllDay = true;
                                    obj.category = "allday";
                                    obj.dueDateClass = "morning";
                                    obj.location = ""; 
                                    //obj.attendees = "false"; // this is string arry..
                                    obj.recurrenceRule = ""; //string..
                                    obj.isPending = false;
                                    obj.isFocused = false;
                                    obj.isVisible = true;
                                    obj.isReadOnly = false;
                                    obj.isPrivate = true;
                                    obj.color = "#ffffff";
                                    obj.bgColor = "#2c46f8";
                                    obj.dragBgColor = "#2c46f8";
                                    obj.borderColor = "#2c46f8";
                                    obj.customStyle ="";
                                    obj.raw ="";
                                    obj.state ="";
                                    obj.Status = "Enable";
                                    obj.IsActive = true;
               
                                    UPDATE_Schedule_ApiCalling(obj);
                                    }
            
                                    else{
            
                                        CommenMessage(Permission_not_allowed_Message);
                
                                    }
            
                                }
                                else{
            
                                    CommenMessage(Permission_not_allowed_Message);
            
                                }
             
                             
                             }
             
                     }
                     else{
                        CommenMessage(select_boat_name_message);
                     }
             
            
    }
    else if(pageIdentiFication == "owner-dashboard-Reservation"){
            
                  
                    var checkController = $('.tui-full-calendar-popup-save').children('span').first().text();
                        
                    var dataGet_AdminSelectBoat = sessionStorage.getItem("Owner_pg_boatListed");
                    var dataSelected_OwnerDropDown = sessionStorage.getItem("Ownerlogin");
                    var selectedBotCheking = sessionStorage.getItem("SettNextBookingDays_boat");
                    if ((typeof dataGet_AdminSelectBoat !== "undefined" && dataGet_AdminSelectBoat != null) 
                       &&(typeof dataSelected_OwnerDropDown !== "undefined" && dataSelected_OwnerDropDown != null)
                       && (typeof selectedBotCheking !== "undefined" && selectedBotCheking != null) )
                    {
                       
                        dataSelected_OwnerDropDown = JSON.parse(dataSelected_OwnerDropDown);
                        dataGet_AdminSelectBoat = JSON.parse(dataGet_AdminSelectBoat);
                        var setTitle = dataSelected_OwnerDropDown.First_Name  + "(" + dataGet_AdminSelectBoat.Boat_Name+")";
                        var user_id_owner = dataSelected_OwnerDropDown._id;
                                   
            
                            if(checkController == "Save"){
                                
                                
                            var newDate_Start = $("#tui-full-calendar-schedule-start-date").val();
                            var newDate_End =  $("#tui-full-calendar-schedule-end-date").val();

                            if(_passData == "Safari"){

                                var newDate_Start = new Date(Safari_suport_Date_format($("#tui-full-calendar-schedule-start-date").val()));
                                var newDate_End = new Date(Safari_suport_Date_format($("#tui-full-calendar-schedule-end-date").val()));
                                

                            }

                            
                            
                            
                            
                            var _shedule_selectedDates = sheduler_selectedDates(newDate_Start,newDate_End);   

                            var startdate_date = _shedule_selectedDates.newDate_Start; 
                            var enddate_date = _shedule_selectedDates.newDate_End;  

                         
                            var start_str =startdate_date.toString();
                            var end_str = calculationOFTwoDateDifferenceINHour(startdate_date,enddate_date); //enddate_date.toString();    
                            var AdminId_get = user_id_owner; //sessionStorage.getItem("UserId");
            
                              
                            //this to start
                            
                            var Next_Booking_Days_check = sessionStorage.getItem("SettNextBookingDays_boat");
                            var nextBookingDay = 0;
                            if(typeof Next_Booking_Days_check !== "undefined" && Next_Booking_Days_check != null)
                            {
                                ////sumthinggggg
                                var tmb_Obj = Object()
                                tmb_Obj.Start_Date = startdate_date;
                                tmb_Obj.End_Date = enddate_date;
            
                                nextBookingDay = calculate_NextBookingDays(Next_Booking_Days_check,tmb_Obj);
            
                            }

                                if(nextBookingDay != 404){
                            

                                    let day_Calculation =  dayCalculation(startdate_date,enddate_date);

                                    let dayCalculation_res = day_Calculation.__zone_symbol__value.obj;
                                                
                
                                    var Is_StandByBooking;
                                    
                                    var standByBookingClosed = false;

                                    let dats_standBy = standByCalculation_booking(start_str,dayCalculation_res,Is_StandByBooking,standByChekingFrondend,fridayBooking,previousDay,standByBookingClosed);
                                    debugger;
                                    

                                    let _date_standby = dats_standBy.__zone_symbol__value.obj;

                                    var  Temp_Date_start = _date_standby.Temp_Date_start;
                                    var  Temp_Date_end = _date_standby.Temp_Date_end;
                                    var  Temp_Date_dateDiff = _date_standby.Temp_Date_dateDiff;
                                    var  Temp_Date_Winter_dateDiff = _date_standby.Temp_Date_Winter_dateDiff;
                                    var  Temp_Date_sundays = _date_standby.Temp_Date_sundays;
                                    var  Temp_Date_weekenddays = _date_standby.Temp_Date_weekenddays;
                                    var  Temp_Date_weekdays = _date_standby.Temp_Date_weekdays;

                                        Is_StandByBooking = _date_standby.Is_StandByBooking;
                                        standByChekingFrondend = _date_standby.standByChekingFrondend;
                                        fridayBooking = _date_standby.fridayBooking;
                                        previousDay = _date_standby.previousDay;
                                        standByBookingClosed = _date_standby.standByBookingClosed;


                                        debugger;
                            
                            
                            
                            
                                   
            
            
                                ///
                                                      
                                var obj = Object();                   
                                
                                obj.specialDayCheck = false;
                                obj.Check_Status = nextBookingDay;
                                obj.Is_StandByBooking = Is_StandByBooking;
                                obj.fridayBooking = fridayBooking;
                                obj.standByChekingFrondend = standByChekingFrondend;
            
                               
                                obj.TotalDay_Count =  parseInt(Temp_Date_dateDiff) + 1;
                                obj.WeekEnd_Count = Temp_Date_weekenddays;
                                obj.WeekDay_Count = Temp_Date_weekdays;
                            
                                obj.User_RoleType = "Owner";
                                obj.User_Id = user_id_owner;
                                obj.Admin_Id = AdminId_get;
            
                                obj.Boat_Id = dataGet_AdminSelectBoat._id;
                                obj.Boat_Name = dataGet_AdminSelectBoat.Boat_Name;
                            
                                obj.title = setTitle;
                                obj.body = true;
                                obj.start = start_str;
                                obj.end = end_str;
                                obj.goingDuration ="";
                                obj.comingDuration ="";
                                obj.isAllDay = true;
                                obj.category = "allday";
                                obj.dueDateClass = "morning";
                                obj.location = "";                     
                                obj.recurrenceRule = ""; //string..
                                obj.isPending = false;
                                obj.isFocused = false;
                                obj.isVisible = true;
                                obj.isReadOnly = false;
                                obj.isPrivate = true;
                                obj.color = "#ffffff";
                                obj.bgColor = "#D50000";
                                obj.dragBgColor = "#D50000";
                                obj.borderColor = "#D50000";
                                obj.customStyle ="";
                                obj.raw ="";
                                obj.state ="";
                                obj.Status = "Enable";
                                obj.IsActive = true;
            
                                if(previousDay == true){
            
                                    if(nextBookingDay != 404)
                                    {
                
                                        if(standByBookingClosed == false)
                                        {                   
                                        
                                            if(NextBookindDay_Calculation_OwnerLogin(obj) == true)
                                            {
                                                
                                                
                                                obj = Back_To_Back_Booking_Calculation(obj);
                                            
                                                
                                                if(obj.Back_to_Back_Booking == false)
                                                {
                                                    GetAllUnAvailableDays_settings(obj);
                
                                                }
                                                else if(obj.Back_to_Back_Booking == true)
                                                {
                                                    if(obj.isAStandByBooking == true)
                                                    {
                                                        if(obj.Back_to_Back_id == 3)
                                                        {
                                                            obj.Back_to_Back_id = 2;
                                                            obj.Back_to_Back_Sheduler_id = obj.back_onechange_key;
                                                            obj._id = obj.back_onechange_key;
                                                            GetAllUnAvailableDays_settings_UPDATE(obj);
                                                        }
                                                        else
                                                        {
                                                            if(obj.Is_StandByBooking == true){
                
                                                                obj.end = end_str;
                                                                GetAllUnAvailableDays_settings(obj);
                
                                                            }
                                                            else{
                
                                                                GetAllUnAvailableDays_settings(obj);
                
                                                            }
                                                            
                
                                                        }
                                                        
                
                                                    }
                                                    else if(obj.Is_StandByBooking == true){
                
                                                        obj.end = end_str;
                                                        GetAllUnAvailableDays_settings(obj);
                
                                                    }
                                                    else if(obj.isThisAOwnerCanceledStandByBooking == true){
                                                        GetAllUnAvailableDays_settings(obj);
                
                                                    }
                                                    else
                                                    {
                                                        GetAllUnAvailableDays_settings_UPDATE(obj);
                                                    }
                                                    
                                                }
                                                else{
                                                    CommenMessage(Booking_Type_is_not_available_Message);
                                                }
                                                
                                                
                                                
                                            }
                                            
                                            else{
                                                CommenMessage(contact_Admin_Message);
                                            }
                                        }
                
                                    }

                                }
                            }
                                
                                                                  
                                          
                        
                            }
                            else if(checkController == "Update"){
                    
                                    
                                    var newDate_Start = $("#tui-full-calendar-schedule-start-date").val();
                                    var newDate_End =  $("#tui-full-calendar-schedule-end-date").val();

                                    if(_passData == "Safari"){

                                        var newDate_Start = new Date(Safari_suport_Date_format($("#tui-full-calendar-schedule-start-date").val()));
                                        var newDate_End = new Date(Safari_suport_Date_format($("#tui-full-calendar-schedule-end-date").val()));
                                        
        
                                    }



                                    var _shedule_selectedDates = sheduler_selectedDates(newDate_Start,newDate_End);   

                                    var startdate_date = _shedule_selectedDates.newDate_Start; 
                                    var enddate_date = _shedule_selectedDates.newDate_End;  
                                
                                
                                    var start_str =startdate_date.toString();
                                    var end_str = calculationOFTwoDateDifferenceINHour(startdate_date,enddate_date);//enddate_date.toString();    
                                    var AdminId_get = user_id_owner; //sessionStorage.getItem("UserId");
                    
                                    
                    
                                    var obj_Confirm = Object();
                                    obj_Confirm.User_Id = user_id_owner;
                                    obj_Confirm.Boat_Id = dataGet_AdminSelectBoat._id;
                    
                    
                    
                    
                                    var chekInfo_Sheduler_Current = false;
                    
                    
                                    var shedulerList_tmp = ScheduleList;
                                    var chekFirst = 0;
                                        
                                        $.each(shedulerList_tmp, function (key, val) {
                                        
                                            if(chekFirst == 0)
                                            {          
                                                if((obj_Confirm.User_Id == val.Owner_Id) && (obj_Confirm.Boat_Id == val.Boat_Id))
                                                {
                                                
                                                    if(val.id == public_shedulDataId){
                                                        chekFirst = 1;
                                                
                                                        chekInfo_Sheduler_Current = true;
                    
                    
                                                    }
                                                                    
                                                }
                                            }      
                    
                                        });
                    
                       
                    
                                    if(chekInfo_Sheduler_Current == false){
                                        CommenMessage(Not_allowed_this_booking_message);
                    
                                    }
                    
                                    else if(chekInfo_Sheduler_Current == true)
                                    {
                                    
                                    //this to start
                                        var Next_Booking_Days_check = sessionStorage.getItem("SettNextBookingDays_boat");
                                        var nextBookingDay = 0;
                                        if(typeof Next_Booking_Days_check !== "undefined" && Next_Booking_Days_check != null)
                                        {
                                            ////sumthinggggg
                                            var tmb_Obj = Object()
                                            tmb_Obj.Start_Date = startdate_date;
                                            tmb_Obj.End_Date = enddate_date;
                        
                                            nextBookingDay = calculate_NextBookingDays(Next_Booking_Days_check,tmb_Obj);
                        
                                        }

                                        if(nextBookingDay != 404){ 
                                                                
                                                                
                                            let day_Calculation =  dayCalculation(startdate_date,enddate_date);

                                            let dayCalculation_res = day_Calculation.__zone_symbol__value.obj;
                                                        
                        
                                            var Is_StandByBooking;
                                            
                                            var standByBookingClosed = false;

                                            let dats_standBy = standByCalculation_booking(start_str,dayCalculation_res,Is_StandByBooking,standByChekingFrondend,fridayBooking,previousDay,standByBookingClosed);
                                            debugger;
                                            

                                            let _date_standby = dats_standBy.__zone_symbol__value.obj;

                                            var  Temp_Date_start = _date_standby.Temp_Date_start;
                                            var  Temp_Date_end = _date_standby.Temp_Date_end;
                                            var  Temp_Date_dateDiff = _date_standby.Temp_Date_dateDiff;
                                            var  Temp_Date_Winter_dateDiff = _date_standby.Temp_Date_Winter_dateDiff;
                                            var  Temp_Date_sundays = _date_standby.Temp_Date_sundays;
                                            var  Temp_Date_weekenddays = _date_standby.Temp_Date_weekenddays;
                                            var  Temp_Date_weekdays = _date_standby.Temp_Date_weekdays;

                                                Is_StandByBooking = _date_standby.Is_StandByBooking;
                                                standByChekingFrondend = _date_standby.standByChekingFrondend;
                                                fridayBooking = _date_standby.fridayBooking;
                                                previousDay = _date_standby.previousDay;
                                                standByBookingClosed = _date_standby.standByBookingClosed;

                        
                                            ///
                                                                
                                            var obj = Object();  
                                            
                                            ///////////// .....................
                        
                                            obj._id = public_shedulDataId;
                                            obj.Back_to_Back_id = 0;
                        
                                            //////.........................
                                            
                                            obj.specialDayCheck = false;
                                            obj.Check_Status = nextBookingDay;
                                            obj.Is_StandByBooking = Is_StandByBooking;
                                            obj.fridayBooking = fridayBooking;
                                            obj.standByChekingFrondend = standByChekingFrondend;
                        
                                            obj.TotalDay_Count =  parseInt(Temp_Date_dateDiff) + 1;
                                            obj.WeekEnd_Count = Temp_Date_weekenddays;
                                            obj.WeekDay_Count = Temp_Date_weekdays;
                                        
                                            obj.User_RoleType = "Owner";
                                            obj.User_Id = user_id_owner;
                                            obj.Admin_Id = AdminId_get;
                        
                                            obj.Boat_Id = dataGet_AdminSelectBoat._id;
                                            obj.Boat_Name = dataGet_AdminSelectBoat.Boat_Name;
                                        
                                            obj.title = setTitle;
                                            obj.body = true;
                                            obj.start = start_str;
                                            obj.end = end_str;
                                            obj.goingDuration ="";
                                            obj.comingDuration ="";
                                            obj.isAllDay = true;
                                            obj.category = "allday";
                                            obj.dueDateClass = "morning";
                                            obj.location = "";                     
                                            obj.recurrenceRule = ""; //string..
                                            obj.isPending = false;
                                            obj.isFocused = false;
                                            obj.isVisible = true;
                                            obj.isReadOnly = false;
                                            obj.isPrivate = true;
                                            obj.color = "#ffffff";
                                            obj.bgColor = "#D50000";
                                            obj.dragBgColor = "#D50000";
                                            obj.borderColor = "#D50000";
                                            obj.customStyle ="";
                                            obj.raw ="";
                                            obj.state ="";
                                            obj.Status = "Enable";
                                            obj.IsActive = true;

                                            if(previousDay == true){
                        
                                                if(nextBookingDay != 404){
                            
                                                    if(standByBookingClosed == false){
                            
                                                    if(NextBookindDay_Calculation_OwnerLogin(obj) == true)
                                                    {
                                                        obj = Back_To_Back_Booking_Calculation_Edit(obj); 
                            
                                                        
                            
                                                    // DaysCheking_For_Friday_by_Owner(obj);
                                                        GetAllUnAvailableDays_settings_UPDATE(obj);
                                                    
                                                    }
                                                    else{
                                                        CommenMessage(contact_Admin_Message);
                                                    }
                            
                                                    }
                            
                                                }
                                            }


                                        }
                                        
                                                                        
                                                
                                
                                    
                    
                                    
                                    }
                            }
                            else
                            {
                                CommenMessage(Not_allowed_this_booking_message);
                            }
            
            
                    }
                    else{
                        CommenMessage(select_boat_name_message);
                    }
            
    }

}



//safari functionality.....................

function Safari_suport_Date_format(dateString){   
     
    
    var dateObj = dateString.replace(/-/g, "/");
  
    return dateObj;

  }



///end


$(document).on("click","#span-ConformationMessage-booking",function() { 

  
    if(Public_section_status == 1){
        You_are_booking_Special_day_changes_1(public_global_transfer_datas);
    }
    else if(Public_section_status == 2){
        You_are_booking_Special_day_changes_2(public_global_transfer_datas);
    }
    else if(Public_section_status == 3){
        calculate_NextBookingDays_MessageBase(public_global_transfer_datas);
    }
    else if(Public_section_status == 4){
        
        Calculate_StandByBooking_MessageBase(public_global_transfer_datas);
    }
    else if(Public_section_status == 5){
        
        Finalize_One_AddSheduel_API_Call(public_global_transfer_datas);
    }
    ////Updated SheduleApi call

    else if(Public_section_status == 6){
        Update_API_calculate_NextBookingDays_MessageBase(public_global_transfer_datas);
    }
    else if(Public_section_status == 7){
        
        Update_API_Calculate_StandByBooking_MessageBase(public_global_transfer_datas);
    }
    else if(Public_section_status == 8){
        
        Finalize_One_Update_Addshedule_API_Call(public_global_transfer_datas);
    }
    


});

function Commen_ConformationMessage(message,section,transferData){

 

    $("#P-ConformationMessage").text(message);
    Public_section_status = section;
    public_global_transfer_datas = transferData;
    $('#ConformationMessage').trigger('click');


}

function Commen_ConformationMessage_second(message,section,transferData){

    

    $("#P-ConformationMessage_Second").text(message);
    Public_section_status = section;
    public_global_transfer_datas = transferData;
    $('#ConformationMessage_Second').trigger('click');


}

function Commen_ConformationMessage_Therd(message,section,transferData){

    

    $("#P-ConformationMessage_Therd").text(message);
    Public_section_status = section;
    public_global_transfer_datas = transferData;
    $('#ConformationMessage_Therd').trigger('click');


}



function You_are_booking_Special_day_changes_1(commenDatas){

    var obj = commenDatas.obj;
    var check_SpecialDay = commenDatas.check_SpecialDay;

    //("You are booking Special day");
    
    obj.specialDayCheck = 1;
    obj.Special_Day = check_SpecialDay.data_SpecialDays_Arry;
    

    console.log(obj);

    if(obj.Is_StandByBooking == true){

        $.ajax({
            url: public_StandByBooking+"AddStandByBooking",
            type: 'POST',
            dataType: 'json', 
            data: obj,
            success: function(datas) { 
                sessionStorage.setItem("datatrrigerd_ownerlogin",1);    
                if(datas.status == true)
                {
                    CommenMessage_save(datas.message);
                    //location.reload();    
                }
                else if(datas.status == false)
                {                    
                    CommenMessage(datas.message);
                    //location.reload();    
                }
            
    
            },
            error: function (error) {               
                
                console.log(error.responseText);
                CommenMessage(error.responseText);
                        
            }
        });

    }
    else
    {       
        $.ajax({
            url: public_URL+"AddSchedule",
            type: 'POST',
            dataType: 'json', 
            data: obj,
            success: function(datas) {
                
                sessionStorage.setItem("datatrrigerd_ownerlogin",1);
                            
                if(datas.status == true)
                {
                    CommenMessage_save(datas.message);
                    //location.reload();    
                }
                else if(datas.status == false)
                {                    
                    CommenMessage(datas.message);
                    //location.reload();    
                }
            
    
            },
            error: function (error) {               
                
                console.log(error.responseText);
                CommenMessage(error.responseText);
                        
            }
        });
    }
}


function You_are_booking_Special_day_changes_2(commenDatas)
{
    var obj = commenDatas.obj;
    var check_SpecialDay = commenDatas.check_SpecialDay;

    
    //("You are booking Special day");
            obj.specialDayCheck = 1;
            obj.Special_Day = check_SpecialDay.data_SpecialDays_Arry;
            obj.bookingId = obj._id;
            obj.incomingStartDate = obj.start;
            obj.incomingEndDate = obj.end;
            

            console.log(obj);

            if(obj.Is_StandByBooking == true){

                CommenMessage(Standby_bookings_can_not_be_edited);

                

            }
            else
            { 
                ////////step...............2  
                console.log(obj);
                
                if(obj.User_RoleType == "Owner")
                {

                    if(obj.Back_to_Back_id == 0)
                    { 
                        
                        var obj22 = Object();// start
                        obj22.bookingId =  obj.bookingId;
                        obj22.incomingStartDate = obj.incomingStartDate;
                        obj22.incomingEndDate = obj.incomingEndDate;
            
                        

                        console.log(obj22);

                    $.ajax({
                        url: public_URL+"IsLOAIncluded",
                        type: 'POST',
                        dataType: 'json', 
                        data: obj22,
                        success: function(datas) { 

                            
                        
                            if(datas.status == true)
                            {
                                if(datas.IsLOAIncluded == true) 
                                {                   
                                    var count_Temp =  parseInt(datas.LOAInWeekday) + parseInt(datas.LOAInWeekend);
                                        
                                        $("#P-IsLOAIncluded").text("Are you sure you want to partially cancel this booking? It will result in "+count_Temp+" DAYS loss of allocation. Do you wish to proceed?");
                                        
                                        $('#IsLOAIncluded').trigger('click');
                                }
                                else{

                                    //$('#IsLOAIncluded').trigger('click');
                                    public_IsLOAIncluded = obj;
                                    $("#span-IsLOAIncluded-booking").trigger('click');

                                }
                                
                                
                            }
                            else if(datas.status == false)
                            {     
                                if(datas.IsLOAIncluded == true)
                                {
                                    ///start............

                                    obj.bookingId = obj._id;
                                    obj.incomingStartDate = obj.start;
                                    obj.incomingEndDate = obj.end;
                                    ///let isIncludedDate = {}



                                    public_IsLOAIncluded = obj;
                                    $('#IsLOAIncluded').trigger('click');
                                } 
                                else
                                {
                                            
                                CommenMessage(datas.message);
                                }
                                    
                            }
                            

                        

                        },
                        error: function (error) {  
                                        
                        
                            console.log(error.responseText);
                        // CommenMessage(error.responseText);
                                    
                        }
                    });
                    
                }
                else
                {

                    $("#span-IsLOAIncluded-booking").trigger('click');

                }

            }
            else
            {
                //$("#span-IsLOAIncluded-booking").trigger('click'); 
                $.ajax({
                    url: public_URL+"EditSchedule",
                    type: 'POST',
                    dataType: 'json', 
                    data: public_IsLOAIncluded,
                    success: function(datas) { 
                        sessionStorage.setItem("datatrrigerd_ownerlogin",1);
                        if(datas.status == true)
                        {
                            CommenMessage_save(datas.message);
                            //location.reload();    
                        }
                        else if(datas.status == false)
                        {    
                                    
                            CommenMessage(datas.message);
                        
                        }
                        

                    

                    },
                    error: function (error) {  
                                    
                    
                        console.log(error.responseText);
                    // CommenMessage(error.responseText);
                                
                    }
                });

            }



            }
}


function calculate_NextBookingDays_MessageBase(obj){

    
    if(obj.standByChekingFrondend == true){

        let message = standbyBookingMessage;
        let section = 4;
        let transferData = obj;

        Commen_ConformationMessage_second(message,section,transferData);

    }
    else
    {

        Finalize_One_AddSheduel_API_Call(obj);       

    }

}

function Calculate_StandByBooking_MessageBase(obj){

   
    if(obj.fridayBooking == true){

        let message = frideAfterHourBooking;
        let section = 5;
        let transferData = obj;

        Commen_ConformationMessage_Therd(message,section,transferData);

    }
    else{

        Finalize_One_AddSheduel_API_Call(obj);

    }
}

///////Update

function Update_API_calculate_NextBookingDays_MessageBase(obj){

   

    if(obj.standByChekingFrondend == true){

        let message = standbyBookingMessage;
        let section = 7;
        let transferData = obj;

        Commen_ConformationMessage_second(message,section,transferData);

    }
    else
    {

        Finalize_One_Update_Addshedule_API_Call(obj);       

    }

}

function Update_API_Calculate_StandByBooking_MessageBase(obj){

   

    if(obj.fridayBooking == true){

        let message = frideAfterHourBooking;
        let section = 8;
        let transferData = obj;

        Commen_ConformationMessage_Therd(message,section,transferData);

    }
    else{

        Finalize_One_Update_Addshedule_API_Call(obj);

    }
}





function Finalize_One_AddSheduel_API_Call(obj){

    debugger;

    if(public_Global_unavilable == false){

        obj.timeZone = timeszon_Set; //Intl.DateTimeFormat().resolvedOptions().timeZone; //"Asia/Kolkata";//datas_json.timezone;

        obj.summer_Winter_Calc = JSON.parse(sessionStorage.getItem("daysMoreDan"));

           
        var pageIdentiFication = sessionStorage.getItem("pageIdentiFiction"); 
        
        obj.commends = $(".commen-cammends-sheduler").val();

        var timer1 = $("#sheduler-calender-timer1").val();    
        var timer2 = $("#sheduler-calender-timer2").val();           
        
        var start_str = new Date(momment_newDate_convert_YYYY_MM_DD(obj.start)); 
            if(obj.end == null)
            {
                obj.end = obj.start;
            }
        var end_str   = new Date(momment_newDate_convert_YYYY_MM_DD(obj.end));  
              

        start_str = new Date(start_str.setHours(conver_Hours(timer1),conver_Minit(timer1),00,0));
       
        end_str = new Date(end_str.setHours(conver_Hours(timer2),conver_Minit(timer2),00,0));
        
        // if(obj.timeZone != "Asia/Calcutta"){

        //     obj.start = Start_convertUTCDateToLocalDate(start_str.toString());
        //     obj.end   = End_convertUTCDateToLocalDate(end_str.toString());

        // }
        // else
        // {
            obj.start = start_str.toString(); //MomentConvert(start_str.toString());
            obj.end   = end_str.toString(); //MomentConvert(end_str.toString());
       // }
       


        obj.specialDayCheck = 0;

      

        var check_SpecialDay = SpecialDaysCalculations(start_str,end_str);

        

            if(check_SpecialDay.multiple_specialDay_chek == false){

            
                if(check_SpecialDay.specialday_check == false || pageIdentiFication == "AdminBooking" || pageIdentiFication == "boat-maintenance" )
                {
                    
                
                    if(obj.Is_StandByBooking == true){
                    
                        console.log(obj);

                        $.ajax({
                            url: public_StandByBooking+"AddStandByBooking",
                            type: 'POST',
                            dataType: 'json', 
                            data: obj,
                            success: function(datas) { 
                            
                                sessionStorage.setItem("datatrrigerd_ownerlogin",1);         
                                if(datas.status == true)
                                {
                                    CommenMessage_save(datas.message);
                                    //location.reload();    
                                }
                                else if(datas.status == false)
                                {                    
                                    CommenMessage(datas.message);
                                    //location.reload();    
                                }
                            
                    
                            },
                            error: function (error) {               
                                
                                console.log(error.responseText);
                                CommenMessage(error.responseText);   
                            }
                        });

                    }
                    else
                    { 
                    
                        console.log(obj);               
                        $.ajax({
                            url: public_URL+"AddSchedule",
                            type: 'POST',
                            dataType: 'json', 
                            data: obj,
                            success: function(datas) { 
                            
                                sessionStorage.setItem("datatrrigerd_ownerlogin",1);
                                            
                                if(datas.status == true)
                                {
                                    CommenMessage_save(datas.message);
                                    //location.reload();    
                                }
                                else if(datas.status == false)
                                {                    
                                    CommenMessage(datas.message);
                                    //location.reload();    
                                }
                            
                    
                            },
                            error: function (error) {  
                                            
                            
                                console.log(error.responseText);
                                CommenMessage(error.responseText);
                                        
                            }
                        });
                    }
                }
                
                else{

                    //Changes............1 FunctionName .... You_are_booking_Special_day_changes_1();
                    
                    

                    var passJson = {
                        obj : obj,
                        check_SpecialDay: check_SpecialDay
                    }
                    
                    Commen_ConformationMessage_Therd(You_are_booking_Special_day,1,passJson);
                   

                }

            }
            else if(check_SpecialDay.multiple_specialDay_chek == true){

                CommenMessage(Multiple_special_day_booking_Message);


            }

       }

}



function Finalize_One_Update_Addshedule_API_Call(obj)
{

    
    public_IsLOAIncluded = obj;
    if(public_Global_unavilable == false){

        obj.timeZone = timeszon_Set;//Intl.DateTimeFormat().resolvedOptions().timeZone; // "Asia/Kolkata";

    obj.summer_Winter_Calc = JSON.parse(sessionStorage.getItem("daysMoreDan"));

 
var pageIdentiFication = sessionStorage.getItem("pageIdentiFiction"); 

obj.commends = $(".commen-cammends-sheduler").val();

var timer1 = $("#sheduler-calender-timer1").val();    
var timer2 = $("#sheduler-calender-timer2").val();           

var start_str =  new Date(momment_newDate_convert_YYYY_MM_DD(obj.start));
if(obj.end == null){
    obj.end = obj.start;
} 
var end_str   =  new Date(momment_newDate_convert_YYYY_MM_DD(obj.end));        

start_str = new Date(start_str.setHours(conver_Hours(timer1),conver_Minit(timer1),00,0));

end_str = new Date(end_str.setHours(conver_Hours(timer2),conver_Minit(timer2),00,0));

//obj.start = start_str.toString();
//obj.end   = end_str.toString();

// if(obj.timeZone != "Asia/Calcutta"){

//     obj.start = Start_convertUTCDateToLocalDate(start_str.toString());
//     obj.end   = End_convertUTCDateToLocalDate(end_str.toString());

// }
// else
// {
    obj.start = start_str.toString();// MomentConvert(start_str.toString());
    obj.end   = end_str.toString();//MomentConvert(end_str.toString());
//}


obj.specialDayCheck = 0;

var check_SpecialDay = SpecialDaysCalculations(start_str,end_str);

        if(check_SpecialDay.multiple_specialDay_chek == false){

            if(check_SpecialDay.specialday_check == false || pageIdentiFication == "AdminBooking" || pageIdentiFication == "boat-maintenance" )
            {
            

            if(obj.Is_StandByBooking == true)
            {
                
                console.log(obj);

                CommenMessage(Standby_bookings_can_not_be_edited);

            }
            else
            { 
                //step.........1
                console.log(obj); 

                if(obj.User_RoleType == "Owner")
                {

                    if(obj.Back_to_Back_id == 0)
                    {

                                
                        var obj2_data = Object();

                        obj2_data.bookingId = obj._id;
                        obj2_data.incomingStartDate = start_str.toString(); //obj.start;
                        obj2_data.incomingEndDate = end_str.toString();//obj.end;


                        $.ajax({
                            url: public_URL+"IsLOAIncluded",
                            type: 'POST',
                            dataType: 'json', 
                            data: obj2_data,
                            success: function(datas) { 
                                                            
                            
                                if(datas.status == true)
                                {
                                    public_IsLOAIncluded = obj;

                                    if(datas.IsLOAIncluded == true)
                                    {
                                        var count_Temp =  parseInt(datas.LOAInWeekday) + parseInt(datas.LOAInWeekend);
                                        
                                        $("#P-IsLOAIncluded").text("Are you sure you want to partially cancel this booking? It will result in "+count_Temp+" DAYS loss of allocation. Do you wish to proceed?");
                                        
                                        $('#IsLOAIncluded').trigger('click');
                                    } 
                                    else
                                    {

                                        $("#span-IsLOAIncluded-booking").trigger('click'); 
                                                
                                    //CommenMessage(datas.message);
                                    }
                                    
                                }
                                else if(datas.status == false)
                                {     
                                    
                                    CommenMessage(datas.message);
                                        
                                }
                                

                            

                            },
                            error: function (error) {  
                                            
                            
                                console.log(error.responseText);
                            // CommenMessage(error.responseText);
                                        
                            }
                        });
                    }
                    else{

                        ////////// This to start........

                        $("#span-IsLOAIncluded-booking").trigger('click'); 

                    }

                }
                else if(obj.User_RoleType == "Maintenance"){

                    $.ajax({
                        url: public_URL+"EditSchedule",
                        type: 'POST',
                        dataType: 'json', 
                        data: public_IsLOAIncluded,
                        success: function(datas) { 
                            sessionStorage.setItem("datatrrigerd_ownerlogin",1);
                            if(datas.status == true)
                            {
                                CommenMessage_save(datas.message);
                                //location.reload();    
                            }
                            else if(datas.status == false)
                            {    
                                        
                                CommenMessage(datas.message);
                            
                            }
                            
                
                        
                
                        },
                        error: function (error) {  
                                        
                        
                            console.log(error.responseText);
                        // CommenMessage(error.responseText);
                                    
                        }
                    });

                }


                else
                {
                    $("#span-IsLOAIncluded-booking").trigger('click'); 
                

                }

                
                

                //             
                
                
            }
            }

            else{


                //Changes............2 FunctionName .... You_are_booking_Special_day_changes_2();
                    

                    var passJson = {
                        obj : obj,
                        check_SpecialDay: check_SpecialDay
                    }
                    
                    Commen_ConformationMessage_Therd(You_are_booking_Special_day,2,passJson);


            }

        }

        else if(check_SpecialDay.multiple_specialDay_chek == true){

            CommenMessage(Multiple_special_day_booking_Message);


        }

    }
}


function Start_convertUTCDateToLocalDate(date) {

   
    var date_con = new Date(date);
    date_con.setDate(date_con.getDate() + 1);

    var isoDateString = new Date(date_con).toUTCString(); //new Date(date).toISOString();
    

    return isoDateString;   
}

function End_convertUTCDateToLocalDate(date) {


    var isoDateString = new Date(date).toUTCString(); //new Date(date).toISOString();

    return isoDateString;   
}

function dayCalculation(startdate_date,enddate_date){

    return new Promise(async(resolve,reject) => {

        
        const Temp_Date_start = new Date(startdate_date);                        
        const Temp_Date_end = new Date(enddate_date);
        var Temp_Date_dateDiff= Math.round((Temp_Date_end - Temp_Date_start)/(1000*60*60*24));
        var Temp_Date_Winter_dateDiff = Temp_Date_dateDiff+1;
        const Temp_Date_sundays = Math.floor((Temp_Date_Winter_dateDiff + (Temp_Date_start.getDay() + 6) % 7) / 7);
        var Temp_Date_weekenddays = 2 * Temp_Date_sundays + (Temp_Date_end.getDay()==6) - (Temp_Date_start.getDay()==0);                        
        var Temp_Date_weekdays = Temp_Date_Winter_dateDiff - Temp_Date_weekenddays;

        let obj ={

            Temp_Date_start: Temp_Date_start,
            Temp_Date_end: Temp_Date_end,
            Temp_Date_dateDiff: Temp_Date_dateDiff,
            Temp_Date_Winter_dateDiff: Temp_Date_Winter_dateDiff,
            Temp_Date_sundays: Temp_Date_sundays,
            Temp_Date_weekenddays: Temp_Date_weekenddays,
            Temp_Date_weekdays: Temp_Date_weekdays
        }

        resolve({obj})

      //return obj;



    });

    


}

function sheduler_selectedDates(newDate_Start,newDate_End){

    let startdate = momment_newDate_convert_YYYY_MM_DD(newDate_Start);
    let endDate = momment_newDate_convert_YYYY_MM_DD(newDate_End);
    return {
        newDate_Start: new Date(startdate),
        newDate_End: new Date(endDate)
    }

}

function Jqueary_string_to_Date_Convert_slashBase(dateString){   
       
    var dateArray = dateString.split("-");
    var dateObj = new Date(`${dateArray[2]}/${dateArray[1]}/${dateArray[0]}`);
  
    return dateObj;

  }




//......................

function Moment_Time_Onley(dates){

    let results = moment(dates).tz(timeszon_Set).format("HH:mm:ss");
    return results;

}




function MomentConvert(dates){


    var results = moment(dates).tz(timeszon_Set).format();
   

    return results;

}

function MomentConvert_toString(dates){

       

    var re = moment(dates).tz(timeszon_Set).format();
    var results = re.toString();

    return results;

}

function MomentConvert_currentDay_toString(){

    var re = moment().tz(timeszon_Set).format();
    var results = re.toString();

    return results;

} 

function MomentConvert_currentDay_Date(){

    var results = moment().tz(timeszon_Set).format();
   
    return results;

}

function momment_newDate_convert_YYYY_MM_DD(date){

    

   return moment(date).tz(timeszon_Set).format("YYYY/MM/DD");

}

function adding_MultipleDays_moment(date,numberOfdays){
     
   

     //let _momenConvert =  moment(date).tz(timeszon_Set).format("DD-MM-YYYY");

     var newdate = new Date(momment_newDate_convert_YYYY_MM_DD(date)) //date;//new Date(date);
     newdate.setDate(newdate.getDate() + numberOfdays);
     return new Date(newdate);

}


function standByCalculation_booking(start_str,objects,Is_StandByBooking,standByChekingFrondend,fridayBooking,previousDay,standByBookingClosed){

    
    return new Promise ((resolve, reject) => {

       debugger;

      


         let current_ausDate = MomentConvert_currentDay_Date();
         
         var currentDates = getFormattedDate_WithOut_Zero_Time(current_ausDate);
         
         var startDateConvertDate = getFormattedDate_WithOut_Zero_Time(MomentConvert(start_str)); 

        // var startDateConvertDate = getFormattedDate_WithOut_Zero_Time(start_str); 
                                  
        // var currentDates_addOneday_tmp = new Date();
        // var currentDates_addTwoay_tmp = new Date();

         var currentDates_addOneday_tmp = MomentConvert_currentDay_Date();
         var currentDates_addTwoay_tmp = MomentConvert_currentDay_Date();


         var currentDates_addOneday =getFormattedDate_WithOut_Zero_Time(adding_MultipleDays_moment(currentDates_addOneday_tmp,1));// currentDates_addOneday_tmp.addDays(1);
         var currentDates_addTwoday =getFormattedDate_WithOut_Zero_Time(adding_MultipleDays_moment(currentDates_addTwoay_tmp,2));// currentDates_addOneday_tmp.addDays(1);
                                
        if(currentDates == startDateConvertDate){
            debugger
             var currentDay_tmp =  MomentConvert_currentDay_Date(); //new Date();
             var current_Time = Moment_Time_Onley(currentDay_tmp) //Time_Onley(currentDay_tmp);//current_Time
              
             if("12:00:00" >= current_Time){
            
            
                     if(3 <= objects.Temp_Date_weekdays){
                
                        objects.Temp_Date_weekdays = fun_weekDayCount_AddZeroDay(objects.Temp_Date_weekdays);
                        }
                    else{
                        objects.Temp_Date_weekdays = 0;
                        }
            
                        objects.Temp_Date_weekenddays = fun_weekendCount_AddZeroDay(objects.Temp_Date_weekenddays)
                                            
                        objects.Temp_Date_dateDiff = (parseInt(objects.Temp_Date_weekdays) + parseInt(objects.Temp_Date_weekenddays)) - 1;
            
                        Is_StandByBooking = JSON.parse("true");
                        standByChekingFrondend = true;
                                           //(standbyBookingMessage);
            
                }
                else{
            
                    CommenMessage(Bookings_are_closed_message);
                    standByBookingClosed = true;                           
                }
            
        }
                                                   
        else if(currentDates_addOneday == startDateConvertDate){      
              
            var currentDay_tmp =  MomentConvert_currentDay_Date(); 
             var current_Time = Moment_Time_Onley(currentDay_tmp);
            //var currentDay_tmp = new Date();
            //var current_Time = Time_Onley(currentDay_tmp);                       
            if("12:00:00" <= current_Time){                
                
                if(2 <= objects.Temp_Date_weekdays){
                
                    objects.Temp_Date_weekdays = fun_weekDayCount_AddOneDay(objects.Temp_Date_weekdays);
                }
                else{
                    objects.Temp_Date_weekdays = 0;
                }
            
                objects.Temp_Date_weekenddays = fun_weekendCount_AddOneDay(objects.Temp_Date_weekenddays)
                                            
                objects.Temp_Date_dateDiff = (parseInt(objects.Temp_Date_weekdays) + parseInt(objects.Temp_Date_weekenddays)) - 1;
            
                                         
                Is_StandByBooking = JSON.parse("true");
                standByChekingFrondend = true; 

                if(getFormattedDate_Friday_only(start_str) == true){                                              
                    
                    fridayBooking = true;

                }
            
            }
            else if("12:00:00" >= current_Time){

                if(2 <= objects.Temp_Date_weekdays){
                
                    objects.Temp_Date_weekdays = fun_weekDayCount_AddTwoDay(objects.Temp_Date_weekdays);
                }
                else{
                    objects.Temp_Date_weekdays = 0;
                }
            
                objects.Temp_Date_weekenddays = fun_weekendCount_AddTwoDay(objects.Temp_Date_weekenddays)
                                            
                objects.Temp_Date_dateDiff = (parseInt(objects.Temp_Date_weekdays) + parseInt(objects.Temp_Date_weekenddays)) - 1;
            
                Is_StandByBooking = JSON.parse("true");
                standByChekingFrondend = true;
                                         
            
            }
            
        }

        else if(currentDates_addTwoday == startDateConvertDate){

            var currentDay_tmp =  MomentConvert_currentDay_Date(); 
             var current_Time = Moment_Time_Onley(currentDay_tmp);

            //var currentDay_tmp = new Date();
            //var current_Time = Time_Onley(currentDay_tmp);                       
            if("12:00:00" <= current_Time){
            
                if(2 <= objects.Temp_Date_weekdays){
                
                    objects.Temp_Date_weekdays = fun_weekDayCount_AddTwoDay(objects.Temp_Date_weekdays);
                }
                else{
                    objects.Temp_Date_weekdays = 0;
                }
            
                objects.Temp_Date_weekenddays = fun_weekendCount_AddTwoDay(objects.Temp_Date_weekenddays)
                                            
                objects.Temp_Date_dateDiff = (parseInt(objects.Temp_Date_weekdays) + parseInt(objects.Temp_Date_weekenddays)) - 1;
            
                Is_StandByBooking = JSON.parse("true");
                standByChekingFrondend = true;                                          
            
                if(getFormattedDate_Friday_only(start_str) == true){
                                               
                                                fridayBooking = true;
                }
            
            }
            
        }

        else{

            let _currentDate = new Date(momment_newDate_convert_YYYY_MM_DD(Jqueary_string_to_Date_Convert_slashBase(currentDates)));
            let _startDateConvert = new Date(momment_newDate_convert_YYYY_MM_DD(Jqueary_string_to_Date_Convert_slashBase(startDateConvertDate)));
          
            if(_currentDate > _startDateConvert){

                previousDay = false;
                CommenMessage(previousDayMessage + getFormattedDate_WithOut_Zero_Time(MomentConvert_currentDay_Date())); 
            }
        }


        let obj ={

            Temp_Date_start: objects.Temp_Date_start,
            Temp_Date_end: objects.Temp_Date_end,
            Temp_Date_dateDiff: objects.Temp_Date_dateDiff,
            Temp_Date_Winter_dateDiff: objects.Temp_Date_Winter_dateDiff,
            Temp_Date_sundays: objects.Temp_Date_sundays,
            Temp_Date_weekenddays: objects.Temp_Date_weekenddays,
            Temp_Date_weekdays: objects.Temp_Date_weekdays,

            Is_StandByBooking: Is_StandByBooking,
            standByChekingFrondend: standByChekingFrondend,
            fridayBooking: fridayBooking,
            previousDay: previousDay,
            standByBookingClosed: standByBookingClosed


        }

        resolve({obj});

       //return obj;


    });


}