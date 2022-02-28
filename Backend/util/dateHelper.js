const moment = require('moment-timezone')
const momentTimezone = require('moment-timezone');

 //This function will push all dates between start and end dates to array and return it

 let getDaysBetweenDates = (startDate, endDate) =>{
    let now = moment(startDate).clone(), dates = [];

    while (now.isSameOrBefore(moment(endDate))) {
        dates.push(now.format('MM/DD/YYYY'));
        now.add(1, 'days');
    }
    return dates;
};



let getDaysBetweenDatesWithoutYear = (startDate, endDate) =>{
    let now = moment(startDate).clone(), dates = [];

    while (now.isSameOrBefore(moment(endDate))) {
        dates.push(now.format('MM/DD'));
        now.add(1, 'days');
    }
    return dates;
};

let getDaysBetweenDatesWithoutYearDay = (startDate) =>{
    let now = moment(startDate).clone();
    var res = now.format('DD-MM');
  
    return res;
};



let getDaysBetweenDatesYearFirst = (startDate, endDate) =>{
    let now = moment(startDate).clone(), dates = [];

    while (now.isSameOrBefore(moment(endDate))) {
        dates.push(now.format('YYYY/MM/DD'));
        now.add(1, 'days');
    }
    return dates;
};







const checkIfSameDaysSelectedInTwoSeasons = (firstSeason,secondSeason)=>{

    

    let firstSeasonStartDate = new Date(firstSeason.startDate);
    let firstSeasonEndDate = new Date(firstSeason.endDate);
    let secondSeasonStartDate = new Date(secondSeason.startDate);
    let secondSeasonEndDate = new Date(secondSeason.endDate);


    if(firstSeasonEndDate.getTime() < firstSeasonStartDate.getTime() || secondSeasonEndDate.getTime() < secondSeasonStartDate.getTime()){
       
        console.log({status:false,error:'Season start date must be less than season end date.'})
        return {status:false,error:'Season start date must be less than season end date.'}
    }


    let firstSeasonsSelectedDays = getDaysBetweenDatesWithoutYear(firstSeasonStartDate,firstSeasonEndDate)
    let secondSeasonSelectedDays = getDaysBetweenDatesWithoutYear(secondSeasonStartDate,secondSeasonEndDate)


    //checking if same month and day included in secondSeason

    const isInclude = firstSeasonsSelectedDays.filter((monthAndDay) => secondSeasonSelectedDays.includes(monthAndDay))


    if(isInclude.length){
        return   {status:false,error:"You can't select the same days for summer and winter. "}
    }else{
        return {status:true,message:'Same days are not selected.'}
    }

    

}


const getNumberOfWeekDaysAndWeekendsFromDates = (dates)=>{


    let numberOfWeekDays = 0
    let numberOfWeekEnds = 0

    for (let date of dates) {
        date = new Date(date)

        if(date.getDay() == 6 || date.getDay() == 0){
            numberOfWeekEnds++
        }else{
            numberOfWeekDays++
        }
    }

    return {numberOfWeekDays,numberOfWeekEnds}

}

const getHoursFromTwoDate = (startDate,endDate)=>{

    startDate = new Date(startDate)
    endDate = new Date(endDate)

    let differenceBetweenStartAndEndInHrs = Math.abs(startDate.getTime() - endDate.getTime()) / 1000 / 3600;

    return differenceBetweenStartAndEndInHrs;



} 


const getBookingIsFromWhichSeasonBasedOnStartDate = (summerSeasonStartDate,summerSeasonEndDate,bookingStartDate) =>{

    let bookingStartDateWithoutYear = moment(new Date(bookingStartDate)).format('MM/DD')
    //check if booking is in summer

   let summerDays = getDaysBetweenDatesWithoutYear(summerSeasonStartDate,summerSeasonEndDate);

   if(summerDays.includes(bookingStartDateWithoutYear)){
       return {isIncludedInSummer:true,message:"Booking is included in summer"}
   }else{
    return {isIncludedInSummer:false,message:"Booking is included in winter"}
   }
   

}


const getCurrentTimeFormatted = ()=> moment().tz(process.env.TIME_ZONE).format('dddd Do of MMMM h:mm a')

const dateToStr = (dt)=> {
    var nY = dt.getFullYear();
    if (dt.getMonth() < 10) {
        var nM = '0' + dt.getMonth();
    } else {
        var nM = dt.getMonth();
    }
    if (dt.getDate() < 10) {
        var nDa = '0' + dt.getDate();
    } else {
        var nDa = dt.getDate();
    }
    if (dt.getHours() < 10) {
        var nH = '0' + dt.getHours();
    } else {
        var nH = dt.getHours();
    }
    var cD = nY + '' + nM + '' + nDa + '' + nH;
    return parseInt(cD);
}



let getDaysBetweenDatesFormat = (startDate, endDate) =>{
    let now = moment(startDate).clone(), dates = [];

    while (now.isSameOrBefore(moment(endDate))) {
        dates.push(now.format('DD/MM/YYYY'));
        now.add(1, 'days');
    }
    return dates;
};


const getNormalDate = (dt)=>{

    date = new Date(dt);
    year = date.getFullYear();
    month = date.getMonth()+1;
    dt = date.getDate();

    if (dt < 10) {
    dt = '0' + dt;
    }
    if (month < 10) {
    month = '0' + month;
    }
    return dt+'-' + month + '-'+year;

}

let getDaysBetweenDatesDayFirst = (startDate, endDate) =>{
    let now = moment(startDate).clone(), dates = [];

    while (now.isSameOrBefore(moment(endDate))) {
        dates.push(now.format('DD/MM/YYYY'));
        now.add(1, 'days');
    }
    return dates;
};

const getCurrentTimeFormattedDate = (date)=> moment(date).tz(process.env.TIME_ZONE).format('dddd Do of MMMM YYYY');

const getLastdayOfmonth =(start_Date)=>{

    let StartOfFirst =  momentTimezone(start_Date).tz(process.env.TIME_ZONE).format();
    var BeginDate = StartOfFirst.toString();
    console.log(BeginDate,"-------------------------BeginDate");
  
   var start_mydate = new Date(BeginDate);
    let end_Monthdate_Startyear = new Date((start_mydate.getFullYear()), (start_mydate.getMonth()+1), 0);

    var MonthStart = momentTimezone(end_Monthdate_Startyear).tz(process.env.TIME_ZONE).format();
    var endMonthdateStartyear = MonthStart.toString();

    return endMonthdateStartyear;
   

}

const getFirstDayOfMonth = (end_Date)=>{

   
    
    let EndOfFirst = momentTimezone(end_Date).tz(process.env.TIME_ZONE).format();
    var EndingDate = EndOfFirst.toString();

    var getMonthEndyear = new Date(EndingDate);
 
   
    let start_Monthdate_Endyear = new Date((getMonthEndyear.getFullYear()), (getMonthEndyear.getMonth()), 1);

    var MonthEnd = momentTimezone(start_Monthdate_Endyear).tz(process.env.TIME_ZONE).format();
    var startMonthdateEndyear = MonthEnd.toString();

    return startMonthdateEndyear;

}
const dateCheck =(from,to,check)=>{ 
    var fDate,lDate,cDate;
    fDate = Date.parse(from);
    lDate = Date.parse(to);
    cDate = Date.parse(check);
 console.log(fDate,lDate,cDate);
    if((cDate <= lDate && cDate >= fDate)) {
        console.log(check,"--------check");
        return true;
    }
    return false;

}

const CheckDaynames = (dateCehck)=>{

    
    let weekdayarrYearOne =[];
    let weekendarrYearOne =[];

    var BulKdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    if((dateCehck.length)==1){
        var knowDay = new Date(dateCehck);
        if((BulKdays[knowDay.getDay()] == "Sunday")||(BulKdays[knowDay.getDay()] == "Saturday"))
        weekendarrYearOne.push( BulKdays[knowDay.getDay()]);
        else
        weekdayarrYearOne.push(BulKdays[knowDay.getDay()]);
    }else{

        for(i=0;i<(dateCehck).length;i++){
  
            var knowDay = new Date(dateCehck[i]);
            if((BulKdays[knowDay.getDay()] == "Sunday")||(BulKdays[knowDay.getDay()] == "Saturday"))
            weekendarrYearOne.push( BulKdays[knowDay.getDay()]);
            else
            weekdayarrYearOne.push(BulKdays[knowDay.getDay()]);
      
      
        }
      

    }

    


    let weekdaycnt = weekdayarrYearOne.length;
    let weekendCnt = weekendarrYearOne.length;

    var output ='{"weekdaycnt":'+weekdaycnt+',"weekendCnt":'+weekendCnt+'}';

  
    return output;

    
}


module.exports = {dateCheck,getDaysBetweenDatesWithoutYearDay,CheckDaynames,getLastdayOfmonth,getFirstDayOfMonth,getCurrentTimeFormattedDate,getDaysBetweenDatesDayFirst,getDaysBetweenDatesWithoutYear,getNormalDate,getDaysBetweenDatesYearFirst,getDaysBetweenDates,checkIfSameDaysSelectedInTwoSeasons,getNumberOfWeekDaysAndWeekendsFromDates,getHoursFromTwoDate,getBookingIsFromWhichSeasonBasedOnStartDate,getCurrentTimeFormatted,dateToStr,getDaysBetweenDatesFormat}