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

function generateTime_Orginal(schedule, renderStart, renderEnd) {
    var startDate = moment(renderStart.getTime())
    var endDate = moment(renderEnd.getTime());
    var diffDate = endDate.diff(startDate, 'days');

    schedule.isAllday = chance.bool({likelihood: 30});
    if (schedule.isAllday) {
        schedule.category = 'allday';
    } else if (chance.bool({likelihood: 30})) {
        schedule.category = SCHEDULE_CATEGORY[chance.integer({min: 0, max: 1})];
        if (schedule.category === SCHEDULE_CATEGORY[1]) {
            schedule.dueDateClass = 'morning';
        }
    } else {
        schedule.category = 'time';
    }
    startDate.add(chance.integer({min: 0, max: diffDate}), 'days');
    startDate.hours(chance.integer({min: 0, max: 23}))
    startDate.minutes(chance.bool() ? 0 : 30);
    schedule.start = startDate.toDate();

    endDate = moment(startDate);
    if (schedule.isAllday) {
        endDate.add(chance.integer({min: 0, max: 3}), 'days');
    }

    schedule.end = endDate
        .add(chance.integer({min: 1, max: 4}), 'hour')
        .toDate();

    if (!schedule.isAllday && chance.bool({likelihood: 20})) {
        schedule.goingDuration = chance.integer({min: 30, max: 120});
        schedule.comingDuration = chance.integer({min: 30, max: 120});;

        if (chance.bool({likelihood: 50})) {
            schedule.end = schedule.start;
        }
    }
}


function generateTime(schedule, renderStart, renderEnd) {
    var startDate = moment(renderStart.getTime())
    var endDate = moment(renderEnd.getTime());
    var diffDate = endDate.diff(startDate, 'days');

    schedule.isAllday = chance.bool({likelihood: 30});
    if (schedule.isAllday) 
    {
        schedule.category = 'allday';
    } 
    else if (chance.bool({likelihood: 30})) 
    {
        schedule.category = SCHEDULE_CATEGORY[chance.integer({min: 0, max: 1})];
        if (schedule.category === SCHEDULE_CATEGORY[1]) {
            schedule.dueDateClass = 'morning';
        }
    } 
    else 
    {
        schedule.category = 'time';
    }
   
    startDate.add(chance.integer({min: 0, max: diffDate}), 'days');
    startDate.hours(chance.integer({min: 0, max: 23}))
    startDate.minutes(chance.bool() ? 0 : 30);
    schedule.start = startDate.toDate();

    endDate = moment(startDate);
    if (schedule.isAllday) {
        endDate.add(chance.integer({min: 0, max: 3}), 'days');
    }

    schedule.end = endDate
        .add(chance.integer({min: 1, max: 4}), 'hour')
        .toDate();

   /* if (!schedule.isAllday && chance.bool({likelihood: 20})) {
        schedule.goingDuration = chance.integer({min: 30, max: 120});
        schedule.comingDuration = chance.integer({min: 30, max: 120});;

        if (chance.bool({likelihood: 50})) {
            schedule.end = schedule.start;
        }
    }*/
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

function generateNames() {
    var names = [];
    var i = 0;
    var length = chance.integer({min: 1, max: 10});

    for (; i < length; i += 1) {
        names.push("sibi_name_"+ i);
    }

    return names;
}

function generateRandomSchedule_orginal(calendar, renderStart, renderEnd) {
    var schedule = new ScheduleInfo();

    

    schedule.id = chance.guid();
    schedule.calendarId = calendar.id;

    schedule.title = chance.sentence({words: 3});
    schedule.body = chance.bool({likelihood: 20}) ? chance.sentence({words: 10}) : '';
    schedule.isReadOnly = chance.bool({likelihood: 20});
    generateTime(schedule, renderStart, renderEnd);

    schedule.isPrivate = chance.bool({likelihood: 10});
    schedule.location = chance.address();
    schedule.attendees = chance.bool({likelihood: 70}) ? generateNames() : [];
    schedule.recurrenceRule = chance.bool({likelihood: 20}) ? 'repeated events' : '';
    schedule.state = chance.bool({likelihood: 20}) ? 'Free' : 'Busy';
    schedule.color = calendar.color;
    schedule.bgColor = calendar.bgColor;
    schedule.dragBgColor = calendar.dragBgColor;
    schedule.borderColor = calendar.borderColor;

    if (schedule.category === 'milestone') {
        schedule.color = schedule.bgColor;
        schedule.bgColor = 'transparent';
        schedule.dragBgColor = 'transparent';
        schedule.borderColor = 'transparent';
    }

    schedule.raw.memo = chance.sentence();
    schedule.raw.creator.name = chance.name();
    schedule.raw.creator.avatar = chance.avatar();
    schedule.raw.creator.company = chance.company();
    schedule.raw.creator.email = chance.email();
    schedule.raw.creator.phone = chance.phone();

    if (chance.bool({ likelihood: 20 })) {
        var travelTime = chance.minute();
        schedule.goingDuration = travelTime;
        schedule.comingDuration = travelTime;
    }

    ScheduleList.push(schedule);
}




function generateRandomSchedule(calendar, renderStart, renderEnd) {
    var schedule = new ScheduleInfo();


    schedule.id = chance.guid();
    schedule.calendarId = calendar.id;

    schedule.title = "sibi test Title";//chance.sentence({words: 3});
    schedule.body = true;//chance.bool({likelihood: 20}) ? chance.sentence({words: 10}) : '';
    schedule.isReadOnly = true;//chance.bool({likelihood: 20});

    

    

    console.log(startDate);


    generateTime(schedule, renderStart, renderEnd); //Not cheking... this to start..
    //generateTime(schedule, startDate, endDate);

   // generateTime(schedule, "Sun Apr 25 2021 00:00:00 GMT+0530 (India Standard Time)", "Sat Jun 05 2021 00:00:00 GMT+0530 (India Standard Time)"); //Not cheking...



    //Time.........Start..........

    schedule.isAllday  = true;

    schedule.category = 'allday';
    schedule.dueDateClass = 'morning';
    schedule.category = 'time';



    //Time.......End..................

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

    if (schedule.category === 'milestone') {
        schedule.color = schedule.bgColor;
        schedule.bgColor = 'transparent';
        schedule.dragBgColor = 'transparent';
        schedule.borderColor = 'transparent';
    }

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

    ScheduleList.push(schedule);
}



function generateSchedule(viewName, renderStart, renderEnd) {
    
    ScheduleList = [];

    console.log(CalendarList);

    CalendarList.forEach(function(calendar) {
        var i = 0, length = 10;
        if (viewName === 'month') {
            length = 3;
        } else if (viewName === 'day') {
            length = 4;
        }
        for (; i < length; i += 1) {
            generateRandomSchedule(calendar, renderStart, renderEnd);
            console.log(ScheduleList);
        }
    });
}
