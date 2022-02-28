

 $(document).ready(function(){

  const public_URL = "http://65.2.28.16/api/Schedule/";
    
  //const public_URL = "https://test.smartboating.com.au/api/Schedule/";
  //const public_URL = "https://bookings.smartboating.com.au/api/Schedule/";

  var sorted_ShedulList = null;


 var templates = {
//   popupIsAllDay: function () {
//       return 'All Day';
//   },
//   popupStateFree: function () {
//       return 'Free';
//   },
//   popupStateBusy: function () {
//       return 'Busy';
//   },
//   titlePlaceholder: function () {
//       return 'Subject';
//   },
//   locationPlaceholder: function () {
//       return 'Location';
//   },
//   startDatePlaceholder: function () {
//       return 'Start date';
//   },
//   endDatePlaceholder: function () {
//       return 'End date';
//   },
  popupSave: function () {
      return 'Save';
  },
  popupUpdate: function () {
      return 'Update';
  },
//   popupDetailDate: function (isAllDay, start, end) {
//       var isSameDate = moment(start).isSame(end);
//       var endFormat = (isSameDate ? '' : 'YYYY.MM.DD ') + 'hh:mm a';

//       if (isAllDay) {
//           return moment(start).format('YYYY.MM.DD') + (isSameDate ? '' : ' - ' + moment(end).format('YYYY.MM.DD'));
//       }

//       return (moment(start).format('YYYY.MM.DD hh:mm a') + ' - ' + moment(end).format(endFormat));
//   },
//   popupDetailLocation: function (schedule) {
//       return 'Location : ' + schedule.location;
//   },
//   popupDetailUser: function (schedule) {
//       return 'User : ' + (schedule.attendees || []).join(', ');
//   },
//   popupDetailState: function (schedule) {
//       return 'State : ' + schedule.state || 'Busy';
//   },
//   popupDetailRepeat: function (schedule) {
//       return 'Repeat : ' + schedule.recurrenceRule;
//   },
//   popupDetailBody: function (schedule) {
//       return 'Discription : ' + schedule.title;
//   },

// Add popu view function //Done By Alagesan on 11.06.2021	

  popupView: function () {
      return 'View';
  },  
  popupEdit: function () {
      return 'Edit';
  },
  // Changed function label name //Done By Alagesan on 11.06.2021	

  popupDelete: function () {
      return 'Cancel';
  }
};

var cal = new tui.Calendar('#calendar', {
  defaultView: 'month',
  template: templates,
  useCreationPopup: true,
  useDetailPopup: true
});





//.................sheduler...End...................

///Sheduler............Datas...................Start........



function init() {



cal.setCalendars(CalendarList);

setRenderRangeText();
setSchedules();
setEventListener();
}

function getDataAction(target) {
return target.dataset ? target.dataset.action : target.getAttribute('data-action');
}

function setDropdownCalendarType() {
var calendarTypeName = document.getElementById('calendarTypeName');
var calendarTypeIcon = document.getElementById('calendarTypeIcon');
var options = cal.getOptions();
var type = cal.getViewName();
var iconClassName;

if (type === 'day') {
 type = 'Daily';
 iconClassName = 'calendar-icon ic_view_day';
} else if (type === 'week') {
 type = 'Weekly';
 iconClassName = 'calendar-icon ic_view_week';
} else if (options.month.visibleWeeksCount === 2) {
 type = '2 weeks';
 iconClassName = 'calendar-icon ic_view_week';
} else if (options.month.visibleWeeksCount === 3) {
 type = '3 weeks';
 iconClassName = 'calendar-icon ic_view_week';
} else {
 type = 'Monthly';
 iconClassName = 'calendar-icon ic_view_month';
}

calendarTypeName.innerHTML = type;
calendarTypeIcon.className = iconClassName;
}

function onClickMenu(e) {
var target = $(e.target).closest('a[role="menuitem"]')[0];
var action = getDataAction(target);
var options = cal.getOptions();
var viewName = '';

switch (action) {
case 'toggle-daily':
  viewName = 'day';
  break;
case 'toggle-weekly':
  viewName = 'week';
  break;
case 'toggle-monthly':
  options.month.visibleWeeksCount = 0;
  viewName = 'month';
  break;
case 'toggle-weeks2':
  options.month.visibleWeeksCount = 2;
  viewName = 'month';
  break;
case 'toggle-weeks3':
  options.month.visibleWeeksCount = 3;
  viewName = 'month';
  break;
case 'toggle-narrow-weekend':
  options.month.narrowWeekend = !options.month.narrowWeekend;
  options.week.narrowWeekend = !options.week.narrowWeekend;
  viewName = cal.getViewName();

  target.querySelector('input').checked = options.month.narrowWeekend;
  break;
case 'toggle-start-day-1':
  options.month.startDayOfWeek = options.month.startDayOfWeek ? 0 : 1;
  options.week.startDayOfWeek = options.week.startDayOfWeek ? 0 : 1;
  viewName = cal.getViewName();

  target.querySelector('input').checked = options.month.startDayOfWeek;
  break;
case 'toggle-workweek':
  options.month.workweek = !options.month.workweek;
  options.week.workweek = !options.week.workweek;
  viewName = cal.getViewName();

  target.querySelector('input').checked = !options.month.workweek;
  break;
default:
  break;
}

cal.setOptions(options, true);
cal.changeView(viewName, true);

setDropdownCalendarType();
setRenderRangeText();
setSchedules();
}

function onClickNavi(e) {
var action = getDataAction(e.target);

switch (action) {
case 'move-prev':
  cal.prev();
  break;
case 'move-next':
  cal.next();
  break;
case 'move-today':
  cal.today();
  break;
default:
  return;
}

setRenderRangeText();
setSchedules_Next_Prev();
}

function setRenderRangeText() {
var renderRange = document.getElementById('renderRange');
var options = cal.getOptions();
var viewName = cal.getViewName();
var html = [];
if (viewName === 'day') {
html.push(moment(cal.getDate().getTime()).format('YYYY.MM.DD'));
} else if (viewName === 'month' &&
(!options.month.visibleWeeksCount || options.month.visibleWeeksCount > 4)) {
html.push(moment(cal.getDate().getTime()).format('YYYY.MMMM'));
} else {
html.push(moment(cal.getDateRangeStart().getTime()).format('YYYY.MM.DD'));
html.push(' ~ ');
html.push(moment(cal.getDateRangeEnd().getTime()).format(' MM.DD'));
}
renderRange.innerHTML = html.join('');
}

function setSchedules_Next_Prev() {
  cal.clear();
  
  cal.createSchedules(sorted_ShedulList);
 // generateSchedule();  
  
  refreshScheduleVisibility();
  }
  

function setSchedules() {
cal.clear();

// var start = new Date("Sat May 08 2021 00:00:00 GMT+0530 (India Standard Time)");
// var end = new Date("Sat May 10 2021 00:00:00 GMT+0530 (India Standard Time)");

//generateSchedule(cal.getViewName(), start, end);
generateSchedule();  
//cal.createSchedules(ScheduleList);

refreshScheduleVisibility();
}


function refreshScheduleVisibility() {
var calendarElements = Array.prototype.slice.call(document.querySelectorAll('#calendarList input'));

CalendarList.forEach(function(calendar) {
cal.toggleSchedules(calendar.id, !calendar.checked, false);
});

cal.render(true);

calendarElements.forEach(function(input) {
var span = input.nextElementSibling;
span.style.backgroundColor = input.checked ? span.style.borderColor : 'transparent';
});
}

resizeThrottled = tui.util.throttle(function() {
cal.render();
}, 50);

function setEventListener() {
$('.dropdown-menu a[role="menuitem"]').on('click', onClickMenu);
$('#menu-navi').on('click', onClickNavi);
window.addEventListener('resize', resizeThrottled);
}

cal.on({
'clickTimezonesCollapseBtn': function(timezonesCollapsed) {
if (timezonesCollapsed) {
  cal.setTheme({
    'week.daygridLeft.width': '77px',
    'week.timegridLeft.width': '77px'
  });
} else {
  cal.setTheme({
    'week.daygridLeft.width': '60px',
    'week.timegridLeft.width': '60px'
  });
}

return true;
}
});

function generateSchedule(){

  $("#shown-loader-commen").css("display", "block");

    cal.clear();
    ScheduleList = [];   

    $.ajax({
        url: public_URL+"ViewAllSchedule",
        type: 'GET',
        dataType: 'json',        
        success: function(datas) {
            var respon =  datas.response;

            sessionStorage.setItem("load_SpecialDays",JSON.stringify(datas.SpecialDays));
                      
            $.each(respon, function (key, val) {                
                generateRandomSchedule(val);                 
            });

            
            

           sorted_ShedulList = ScheduleList;
            cal.createSchedules(ScheduleList);

            sessionStorage.setItem("sorted_SheduleList_Owr_Log",JSON.stringify(sorted_ShedulList));
            
            

            $("#shown-loader-commen").css("display", "none");
            $(".pointer-function-all").css("pointer-events", "auto");

            
                   

         },
         error: function (error) {
           
          $("#shown-loader-commen").css("display", "none");
          $(".pointer-function-all").css("pointer-events", "auto");
          
            //$("#responceDiv").html(error.responseText);            
          }
    });
    
}


function generateSchedule_save_then_First(){
  $("#shown-loader-commen").css("display", "block");

  cal.clear();
  ScheduleList = [];   

  $.ajax({
      url: public_URL+"ViewAllSchedule",
      type: 'GET',
      dataType: 'json',        
      success: function(datas) {
          var respon =  datas.response;

          sessionStorage.setItem("load_SpecialDays",JSON.stringify(datas.SpecialDays));
                    
          $.each(respon, function (key, val) {                
              generateRandomSchedule(val);                 
          });

         

          $('.multiselect-dropdown').trigger('click');
          $("#shown-loader-commen").css("display", "none");
          
                 

       },
       error: function (error) {   
        $("#shown-loader-commen").css("display", "none");       
          //$("#responceDiv").html(error.responseText);            
        }
  });
  
}



init();

//sheduler-Binding-click




$(document).on("click",".id-manual-reload",function() {

  //alert();
  generateSchedule_save_then_First();
 

});

//multiselect-dropdown

$(document).on("click",".multiselect-dropdown",function() {



  var pageIdentiFiction = sessionStorage.getItem("pageIdentiFiction");

  if(pageIdentiFiction == "AdminBooking")
  {
    sorted_ShedulList = ScheduleList;    
    var datas = JSON.parse(sessionStorage.getItem("AdminSelectBoat"));
    if (typeof datas !== "undefined" && datas != null)
    {
    cal.clear();     
    sorted_ShedulList = sorted_ShedulList.filter(x => x.Boat_Id == datas._id);
    cal.createSchedules(sorted_ShedulList);     
    
    }
    else{

      cal.clear();    
      cal.createSchedules(ScheduleList);

    }
        
  }

  else if(pageIdentiFiction == "book-for-owner")
  {
    
    sorted_ShedulList = ScheduleList;    
    var datas = JSON.parse(sessionStorage.getItem("AdminSelectBoat"));        
    if (typeof datas !== "undefined" && datas != null)
    {
      cal.clear();     
      sorted_ShedulList = sorted_ShedulList.filter(x => x.Boat_Id == datas._id);
      cal.createSchedules(sorted_ShedulList);     
    
    }
    else
    {
      cal.clear();    
      cal.createSchedules(ScheduleList);
  
    }

      
 
        
  }

  else if(pageIdentiFiction == "boat-maintenance")
  {
    sorted_ShedulList = ScheduleList;    
    var datas = JSON.parse(sessionStorage.getItem("AdminSelectBoat"));
    if (typeof datas !== "undefined" && datas != null)
    {
    cal.clear();     
    sorted_ShedulList = sorted_ShedulList.filter(x => x.Boat_Id == datas._id);
    cal.createSchedules(sorted_ShedulList);     
    
    }
    else{

      cal.clear();    
      cal.createSchedules(ScheduleList);

    }
        
  }
  else if(pageIdentiFiction == "owner-dashboard-Reservation"){

    sorted_ShedulList = ScheduleList;    
    var datas = JSON.parse(sessionStorage.getItem("Owner_pg_boatListed"));        
    if (typeof datas !== "undefined" && datas != null)
    {

      
      if(typeof datas._id === "undefined" && datas._id == null)
      {

       var data_id = JSON.parse(sessionStorage.getItem("Owner_pg_boatListed_Sheduler_tmp"));
       sessionStorage.removeItem("Owner_pg_boatListed_Sheduler_tmp"); 

       var tmp1 = JSON.parse(sessionStorage.getItem("Owner_pg_boatListed_Temp_List"));

       sessionStorage.setItem("Owner_pg_boatListed",JSON.stringify(tmp1));

      cal.clear();     
      sorted_ShedulList = sorted_ShedulList.filter(x => x.Boat_Id == data_id);
      cal.createSchedules(sorted_ShedulList); 
      
      

      }
      else
      {

        cal.clear();     
      sorted_ShedulList = sorted_ShedulList.filter(x => x.Boat_Id == datas._id);
      cal.createSchedules(sorted_ShedulList);  

      }


         
    
    }
    else
    {
      cal.clear();    
      cal.createSchedules(ScheduleList);
  
    }

  }

  
   

 });






 });


 ////////// datas..............

 'use strict';

/*eslint-disable*/

var ScheduleList = [];

var SCHEDULE_CATEGORY = [
    'milestone',
    'task'
];

function ScheduleInfo() {
    this.id = null;
    this.calendarId = null;

    this.title = null;
    this.body = null;
    this.isAllday = false;
    this.start = null;
    this.end = null;
    this.category = '';
    this.dueDateClass = '';

    this.color = null;
    this.bgColor = null;
    this.dragBgColor = null;
    this.borderColor = null;
    this.customStyle = '';

    this.isFocused = false;
    this.isPending = false;
    this.isVisible = true;
    this.isReadOnly = false;
    this.goingDuration = 0;
    this.comingDuration = 0;
    this.recurrenceRule = '';
    this.state = '';

    this.Boat_Id = null;
    this.Boat_Name = null;

    this.Owner_Id = null;
    this.Owner_Name = null;

    this.raw = {
        memo: '',
        hasToOrCc: false,
        hasRecurrenceRule: false,
        location: null,
        class: 'public', // or 'private'
        creator: {
            name: '',
            avatar: '',
            company: '',
            email: '',
            phone: ''
        }
    };
}

function generateNames_orginal() {
    var names = [];
    var i = 0;
    var length = chance.integer({min: 1, max: 10});

    for (; i < length; i += 1) {
        names.push(chance.name());
    }

    return names;
}








