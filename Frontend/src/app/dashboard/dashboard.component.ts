import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl,FormBuilder, Validators} from '@angular/forms';
// import environment for dashboard Done By Alagesan	on 06.07.2021
import { environment } from '../../environments/environment';
declare var $: any;
declare var jQuery: any;
declare var Swal: any;

export class Lopupdate {
  Boat_Id?: string;
  Booking_ID?: string;
  WeekDay_Count?:string;
  WeekEnd_Count?:string;
  LOA?: string;
  IsActive?: boolean;
  Name?:string; 
  _id?:any;
  
}

export class Lopupdate_partial {
  Boat_Id?: string;
  Booking_ID?: string;
  LOA?: string;
  WeekDay_Count?:string;
  WeekEnd_Count?:string;
  IsActive?: boolean;
  Name?:string; 
  _id?:any;
  partialcancelationid?:any;
  Scheduleid?:any;

  WeekDay_Count_Edit? : any;
  WeekEnd_Count_Edit? : any;
  Total_Edit_Loa? : any;
  PartialCancellation_Status? : any;
  
}


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
   // Add Base URL for dashboard Done By Alagesan	on 06.07.2021
   EnvironmentURL:string = environment.url;
  url = this.EnvironmentURL+"api/Schedule"
  url_Boat = this.EnvironmentURL+"api/Boat"
  url_Boat_Shedule = this.EnvironmentURL+"api/Schedule";
  Booking: any=[];
  newBooking: any=[];
  todaysBooking: any=[];
  Cancellations: any=[];
  imgUrl = this.EnvironmentURL+"api/uploads/";
  imagePath = this.EnvironmentURL+'api/uploads/';
  Cancels: any=[];
  adminlogin: any;
  CommenMessages: any;
  cancellationInfo: any;

  Cancels_First: any = [];
  Cancels_Second: any = [];
  Cancels_Thread: any = [];

  public ApproveLopDetails: Lopupdate = {};
  public ApproveLopDetails_Partial: Lopupdate_partial = {};
  public IsmodelActive: boolean = false;
  public NotFound: string = 'NotFound';

  getResponce: any;

  New_Booking_Count:any = 0;
  Todays_Booking_Count:any = 0;
  Cancellations_Count:any = 0;
  Stand_by_Booking_Count:any = 0;

  searchLoction: any = '';
  searchLoction_Boat: any = '';
  loctions: any=[];
  Location_Name_dropDown: any = "Select Location";
  Boat_Name_dropDown :any = "Select Boat";
  allBoats: any;
  dropdown_Boat_List: any = [];
  Stand_by_Booking :any = [];
  dropdown_Boat_List_static: any = [];


  public_LocationType_id :any = null;
  public_baotType_Single_id :any = null;
  searchText: any = '';

  //permission...........

  Overview= false;
  NewBooking=false;
  TodaysBooking= false;
  Cancellations_permission= false;
  StandbyBooking= false;
  NeedAssistance= false;

  datas_log:any;
  permissions:any;
  schedules: any = [{'name':'Last 24hrs updates','value':24},{'name':'Last 2 days updates','value':2},{'name':'Last 3 days updates','value':3},{'name':'Last 5 days updates','value':5}]
  selectedDaysforlist = 24;
  activeTab = 'Overview';
  cancellationInfoForupdates: any;
  //................

  constructor(private httpClient: HttpClient,private http: HttpClient ,private fb: FormBuilder, private router: Router,
    private route: ActivatedRoute) {
     }
  ngOnInit(): void {

    //permission.......

    $(".mobile-menu-icon").click(function(){
      $(".side-menu").toggleClass("mobile-sidebar");
    });
   
    this.adminlogin = JSON.parse(sessionStorage.getItem("adminLogin"));
    if(this.adminlogin==false){
      this.router.navigate(['/session-Expire']);
    }
    else if(this.adminlogin == null){
      this.router.navigate(['']);
    }

    // $(".nav-tabs").on("click", function (e) {
    //   //debugger
    //        var target = $(e.target).attr("href");
    //   console.log('efg'+target);
    //   if(target =='#overview'){
    //     this.activeTab = 'Overview';
    //   }else {
    //     this.activeTab = 'showUpdate';
    //   }
    //   //this.activeTab=$('.nav-tabs .active').text();
    //   console.log('active tabgh'+this.activeTab);
     
    //  });
    //  console.log('active rtttj'+this.activeTab); 


    $("#shown-loader-commen").css("display", "block");

    this.permissions_menuItems()

    var public_URL_Schedule = this.EnvironmentURL+"api/Schedule/";
    var public_URL_Days      = this.EnvironmentURL+"api/Days/";
     
      var ScheduleList = null;
      var GetAllUnAvailableDays = null;
      var GetAllUnAvailableDays_Boats = null;

    

     


        this.getBooking();
        //this.getCancellations();
        this.getLoction();
        this.getAllBoat();
        var getallBoats;     
        
        sessionStorage.setItem("relodePg_book-for-owner","1");
        sessionStorage.setItem("Adminbooking-relodePg","1");
        sessionStorage.setItem("boat-maintenance-reload","1");
        sessionStorage.setItem("view-boat-reload","1");

       
        ///////////......................Resource Timeline ..Start...........

        var public_CurruntSet_Date_Month;
        var public_CurruntSet_Date_Year;
        var public_sheduler_totaldaysbased = [];
        
        ViewAllSchedule();

        $(document).ready(function(){
          $('[data-toggle="tooltip"]').tooltip();   
        });
        
        function Resource_Timeline(){

          
          var currnt_Month = Month_Genarator(new Date() );
          var currnt_Year = Year_Genarator(new Date());
          $(".cls-span-Month").text(currnt_Month);
          $(".cls-span-Year").text(currnt_Year);
          Days_Genarator();

        }



        $(document).on("click",".Cls-btn-left",function() {

          var Substract_Month = addMonths(public_CurruntSet_Date_Month,-1);
          var Substract_year = addyear(public_CurruntSet_Date_Year,-1);
          $(".cls-span-Month").text(Month_Genarator(Substract_Month));
          $(".cls-span-Year").text(Year_Genarator(Substract_year));

          Days_Genarator();

         

        });

        $(document).on("click",".Cls-btn-right",function() {

          var addingMonth = addMonths(public_CurruntSet_Date_Month,1);
          var addingyear = addyear(public_CurruntSet_Date_Year,1);
          $(".cls-span-Month").text(Month_Genarator(addingMonth));
          $(".cls-span-Year").text(Year_Genarator(addingyear));

          Days_Genarator();

          //lert(Year_Genarator(new Date()));

        });

      function Days_Genarator(){        
       
        var result = [];
        var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
        var monthNames = [ "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December" ];
        var monthNames_Number = [ "1", "2", "3", "4", "5", "6",
            "7", "8", "9", "10", "11", "12" ];

        var r = getDaysInMonth();
        
        $.each(r, function(k, v)
        { 
          
          var obj = Object();
          obj.Day_week = v.getDate() +" "+ days[v.getDay()] ;
          obj.day = v.getDate();
          obj.month = monthNames[v.getMonth()];
          obj.month_Number = monthNames_Number[v.getMonth()];
          obj.year = v.getFullYear();       
          
          result.push(obj);
        });

        Binding_TR_Resource_Timeline(result);

      } 
      
      function Binding_TR_Resource_Timeline(values)
      {  
        $("#shown-loader-commen").css("display", "block");
        
        if(typeof getallBoats !== "undefined" && getallBoats != null)
        {         
         
          $("#dtHorizontalVerticalExample").html("");
          var tmp_Bind_TH = '<th style="width:150px; font-weight: 500; position: sticky; top: 0 ;left:0; z-index: 11; background: #172479; color: #FFF; border: 1px solid #3a4273 !important; line-height: 40px; text-align: center;">Boats</th>';
          var tmp_Bind_TR , tmp_Bind_TD;
          $.each(values, function(key, val)
          {
              
            tmp_Bind_TH += '<th style="width:90px; font-weight: 500; position: sticky; top: 0; z-index: 10; background: #172479; color: #FFF; border: 1px solid #3a4273 !important;">'+val.Day_week+'</th>'; 
               
          });
  
          var tmp1 = 0;          
          $.each(getallBoats, function(key, val)
          {
                 
              tmp_Bind_TD = '<td style="position: sticky; left: 0; z-index: 2;background: #dee2e6;" id="'+val._id+'">'+val.Boat_Name+'</td>';
              var temp_SheduleList = ScheduleList;
              temp_SheduleList = public_sheduler_totaldaysbased.filter(x => x.Boat_Id == val._id || x.User_RoleType == "UnAvailableDays")
              var tempstore_sheduler = []; 
              $.each(values, function(key2, val2)
              {                  

                var tmp_sort = temp_SheduleList.find(x => x.day == val2.day &&
                  x.month_Number == val2.month_Number && x.year == val2.year
                  );                                

                 if(typeof tmp_sort !== "undefined" && tmp_sort != null)
                 {
                  //tmp_Bind_TD += '<td style="background-color: '+tmp_sort.borderColor+'; border-color: '+tmp_sort.borderColor+';" data-toggle="tooltip" title="'+tmp_sort.title+'"></td>'; 
                  
                  var datasortingLabel = tempstore_sheduler.filter(x => x == tmp_sort.id);
                  tempstore_sheduler.push(tmp_sort.id);

                  if(datasortingLabel.length == 0)
                  {
                      tmp_Bind_TD += '<td style="background-color: '+tmp_sort.borderColor+'; border-right: '+tmp_sort.borderColor+' 1px solid !important; width: 90px !important; border-left: 5px solid #142175" data-toggle="tooltip" title="'+tmp_sort.title+'"><span style="color: #FFF; display: flex; overflow: hidden; -webkit-line-clamp: 1; -webkit-box-orient: vertical; text-overflow: ellipsis; width: 100%; height: 25px; max-width: 100%; margin: 0;">'+tmp_sort.title+'</span></td>'; 
                     
                  }
                  else
                  {

                   tmp_Bind_TD += '<td style="background-color: '+tmp_sort.borderColor+'; border-right: '+tmp_sort.borderColor+' 1px solid !important; width: 90px !important; " data-toggle="tooltip" title="'+tmp_sort.title+'"></td>'; 


                  }

                                  
                
                }
                 else
                 {
                  tmp_Bind_TD += '<td></td>';

                 }                   
  
              });
  
              if(tmp1 == 0)
              {                
                tmp_Bind_TR = '<tr>'+tmp_Bind_TD+'</tr>';
                tmp1 = 1;
              }
              else
              {                
                tmp_Bind_TR += '<tr>'+tmp_Bind_TD+'</tr>';
  
              }              
               
          });
         
          
          tmp_Bind_TH = '<thead><tr>'+tmp_Bind_TH+'</tr></thead>';
  
          $("#dtHorizontalVerticalExample").html(tmp_Bind_TH + tmp_Bind_TR);

        }        
     
        else
        {
                   
          this.CommenMessages ="Boat data is not loaded please refresh the page.";
          $('#btn-CommenMessage-save-disp-btns').trigger('click');

        }

        $("#shown-loader-commen").css("display", "none");





    }

    function getFormattedDate_second(dateVal) {
      var newDate = new Date(dateVal);
  
      var sMonth = padValue(newDate.getMonth() + 1);
      var sDay = padValue(newDate.getDate());
      var sYear = newDate.getFullYear();
      var sHour = newDate.getHours();
      var sMinute = padValue(newDate.getMinutes());
      var sAMPM = "AM";
  
      var iHourCheck = Number(sHour);
  
      if (iHourCheck > 12) {
          sAMPM = "PM";
          sHour = iHourCheck - 12;
      }
      else if (iHourCheck === 0) {
          sHour = 12;
      }
  
      sHour = padValue(sHour);
  
      return sDay + "-" + sMonth + "-" + sYear + " " + sHour + ":" + sMinute + " " + sAMPM;
  }


    function getDaysInMonth_Sheduler(datas_Arry,data_UnAvailableDays,data_UnAvailableDays_Boats){

    
        var monthNames = [ "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December" ];
        var monthNames_Number = [ "1", "2", "3", "4", "5", "6",
            "7", "8", "9", "10", "11", "12" ];
      
      $.each(datas_Arry, function(key, val){

        var tmp1 = val;
        var tmp1_StartDate = new Date(tmp1.start);
        var tmp2_EndDate = new Date(tmp1.end);
  
  
        var tmp_month = tmp1_StartDate.getMonth();
        var tmp_year = tmp1_StartDate.getFullYear();
        var tmp_Date = tmp1_StartDate.getDate();
  
        var date = new Date(tmp_year, tmp_month, tmp_Date);        
        
        do
        {
          
           var obj = Object();
          var tmp_dt = new Date(date);
          obj.fullofTheDate = tmp_dt;
          obj.day = tmp_dt.getDate();
          obj.month = monthNames[tmp_dt.getMonth()];
          obj.month_Number = monthNames_Number[tmp_dt.getMonth()];
          obj.year = tmp_dt.getFullYear(); 
          
           obj.User_RoleType = val.User_RoleType;
           obj.id = val.id;
            
           obj.title = val.title +" "+ getFormattedDate_second(val.start)+ " to " + getFormattedDate_second(val.end);;
          
        
           obj.start = val.start;
           obj.end = val.end;    
        
         
            obj.color = val.color;
            obj.bgColor = val.bgColor;
            obj.dragBgColor = val.dragBgColor;
            obj.borderColor = val.borderColor;

            obj.Boat_Id = val.Boat_Id;
            obj.Boat_Name = val.Boat_Name;

          public_sheduler_totaldaysbased.push(obj);         
           date.setDate(date.getDate() + 1);
           var tmp_Add_Date = new Date(date);
  
        }while(tmp_Add_Date <= tmp2_EndDate)
       

      });
       
     
      $.each(data_UnAvailableDays, function(key, val){

        var tmp1 = val;
        var tmp1_StartDate = new Date(tmp1);
        var tmp2_EndDate = new Date(tmp1);
  
  
        var tmp_month = tmp1_StartDate.getMonth();
        var tmp_year = tmp1_StartDate.getFullYear();
        var tmp_Date = tmp1_StartDate.getDate();
  
        var date = new Date(tmp_year, tmp_month, tmp_Date);        
        
        do
        {
          
           var obj = Object();
          var tmp_dt = new Date(date);
          obj.fullofTheDate = tmp_dt;
          obj.day = tmp_dt.getDate();
          obj.month = monthNames[tmp_dt.getMonth()];
          obj.month_Number = monthNames_Number[tmp_dt.getMonth()];
          obj.year = tmp_dt.getFullYear(); 
          
           obj.User_RoleType = "UnAvailableDays";
           
            
           obj.title = "UnAvailable Days";
                            
            obj.bgColor = "#3f4240";
            obj.dragBgColor = "#3f4240";
            obj.borderColor = "#3f4240";
            

          public_sheduler_totaldaysbased.push(obj);         
           date.setDate(date.getDate() + 1);
           var tmp_Add_Date = new Date(date);
  
        }while(tmp_Add_Date <= tmp2_EndDate)
       

      });


      $.each(data_UnAvailableDays_Boats, function(key, val){
       

        var tmp1 = val;
        var tmp1_StartDate = new Date(tmp1.start);
        var tmp2_EndDate = new Date(tmp1.start);
  
  
        var tmp_month = tmp1_StartDate.getMonth();
        var tmp_year = tmp1_StartDate.getFullYear();
        var tmp_Date = tmp1_StartDate.getDate();
  
        var date = new Date(tmp_year, tmp_month, tmp_Date);        
        
        do
        {
          
           var obj = Object();
          var tmp_dt = new Date(date);
          obj.fullofTheDate = tmp_dt;
          obj.day = tmp_dt.getDate();
          obj.month = monthNames[tmp_dt.getMonth()];
          obj.month_Number = monthNames_Number[tmp_dt.getMonth()];
          obj.year = tmp_dt.getFullYear(); 
          
           obj.User_RoleType = "UnAvailableDays_Boats";
           //obj.id = val.id;
            
           obj.title = "UnAvailable Days for Boats";
          
            obj.color = "#3f4240";
            obj.bgColor = "#3f4240";
            obj.dragBgColor = "#3f4240";
            obj.borderColor = "#3f4240";

            obj.Boat_Id = val.Boat_Id;
            

          public_sheduler_totaldaysbased.push(obj);         
           date.setDate(date.getDate() + 1);
           var tmp_Add_Date = new Date(date);
  
        }while(tmp_Add_Date <= tmp2_EndDate)
       

      });
       



     
    };


    function getDaysInMonth(){
       
        var tmp_month = public_CurruntSet_Date_Month.getMonth();
        var tmp_year = public_CurruntSet_Date_Year.getFullYear();
        var date = new Date(tmp_year, tmp_month, 1);
            
        var days = [];
        while (date.getMonth() === tmp_month) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return days;
    };

      function Month_Genarator(dateVal) {
          var newDate = new Date(dateVal);
          public_CurruntSet_Date_Month = newDate;

          var monthNames = [ "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December" ];
      
          var sMonth = padValue(newDate.getMonth() + 1);
          var sDay = padValue(newDate.getDate());
          var sYear = newDate.getFullYear(); 
          
          return monthNames[newDate.getMonth()];
          
          //return sDay + "-" + sMonth + "-" + sYear;
      }

      function Year_Genarator(dateVal) {
        var newDate = new Date(dateVal);
        public_CurruntSet_Date_Year = newDate;
    
        var sMonth = padValue(newDate.getMonth() + 1);
        var sDay = padValue(newDate.getDate());
        var sYear = newDate.getFullYear(); 
        
        return sYear;
        
        //return sDay + "-" + sMonth + "-" + sYear;
    }

      function padValue(value) {
        return (value < 10) ? "0" + value : value;
    }

    function addMonths(date, months)
     {
        var d = date.getDate();
        date.setMonth(date.getMonth() + +months);
        if (date.getDate() != d) {
          date.setDate(0);
        }
        return date;
    }

    function addyear(date, year) 
    { 
      var tmp_mon = public_CurruntSet_Date_Month.getFullYear(); 
      var tmp_year =  public_CurruntSet_Date_Year.getFullYear();

      if(tmp_mon != tmp_year)
      {   
        var d = date.getMonth();    
        date.setFullYear(date.getFullYear() + +year);
        if (date.getMonth() != d) {
          date.setDate(0);
        }
      }
      return date;
    }


    function ViewAllSchedule()
    { 
      $("#shown-loader-commen").css("display", "block");     
      ScheduleList = [];
      GetAllUnAvailableDays = [];
      GetAllUnAvailableDays_Boats = [];   

      $.ajax({
          url: public_URL_Schedule+"ViewAllSchedule",
          type: 'GET',
          dataType: 'json',        
          success: function(datas) {
              var respon =  datas.response;
                        
              $.each(respon, function (key, val) {                
                  generateRandomSchedule(val);                 
              });

              ///////

              $.ajax({
                url: public_URL_Days+"GetAllUnAvailableDays",
                type: 'GET',
                dataType: 'json',        
                success: function(GetAllUnAvailableDays_datas) {
                    
                  if(GetAllUnAvailableDays_datas.status == true)
                  {
                    var tmp1_dt = GetAllUnAvailableDays_datas.response;
                      if(tmp1_dt != null)
                      {
                        try{
                        GetAllUnAvailableDays = tmp1_dt[0].UnAvailableDates;
                        }
                        catch{
                          
                        }
                      }
                  } 

                  ///////////////

                        $.ajax({
                          url: public_URL_Days+"GetUnAvailabeDaysOfBoats",
                          type: 'GET',
                          dataType: 'json',        
                          success: function(GetUnAvailabeDaysOfBoats_datas) {

                            
                           
                            if(GetUnAvailabeDaysOfBoats_datas.status == true)
                            {
                              var tmp1_dt2 = GetUnAvailabeDaysOfBoats_datas.response;
                              $.each(tmp1_dt2, function(key, val2){
                                

                                try {

                                 // $.each(val2.Boat_Id, function(key, val3){
                                    
                                   $.each(val2.UnAvailableDates, function(key, val4){
                                     
                                     
                                            var obj = Object();
                                            obj.Boat_Id = val2.Boat_Id;//val3;
                                            obj.start = val4; //Jqueary_string_to_Date_Convert(val4);
                                            GetAllUnAvailableDays_Boats.push(obj);
 
                                   });
 
 
 
                                 //}); 
                                  
                                }
                                catch(err) {

                                  $("#shown-loader-commen").css("display", "none");
                                  //document.getElementById("demo").innerHTML = err.message;
                                }



                                                              

                              });
                              
                            } 
                                                       

                            getDaysInMonth_Sheduler(ScheduleList,GetAllUnAvailableDays,GetAllUnAvailableDays_Boats);
                            getallBoats_Func();
          
                            $("#shown-loader-commen").css("display", "none");
                            
                
                          },
                          error: function (error) {          
                              
                            $("#shown-loader-commen").css("display", "none");
                              this.CommenMessages = error.responseText;
                              $('#btn-CommenMessage-disp-btns').trigger('click');

                              
                            }
                      });

                  ////////////
      
                },
                error: function (error) { 
                  
                  $("#shown-loader-commen").css("display", "none");
                                       
                    this.CommenMessages = error.responseText;
                    $('#btn-CommenMessage-disp-btns').trigger('click');
                    

                  }
            });

              

          },
          error: function (error) {          
                           
            $("#shown-loader-commen").css("display", "none");
              this.CommenMessages = error.responseText;
              $('#btn-CommenMessage-disp-btns').trigger('click');
              
            }
      });
      
    }

    function getallBoats_Func(){

      var obj = Object();      
        obj.alphabet = ""; 

      $.ajax({
        url: public_URL_Schedule+"GetBoatNames",
        type: 'POST',
        dataType: 'json', 
        data: obj,
        success: function(datas) {
          
          getallBoats = datas.response;
          Resource_Timeline();          
            
        },
        error: function (error) { 
            
           
            this.CommenMessages = error.responseText;
              $('#btn-CommenMessage-disp-btns').trigger('click');
                       
        }
    });

    }

  function generateRandomSchedule(val){
    
        var schedule = Object();

        if(val.User_RoleType == "Admin")
        {

          if(val.Is_StandByBooking == true)
          {
            schedule.User_RoleType = "Admin"
            schedule.id = val._id;
            
            schedule.title = val.title;
            schedule.body = "";
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
            schedule.bgColor = "#bf9191";
            schedule.dragBgColor = "#bf9191";
            schedule.borderColor = "#bf9191";

            schedule.Boat_Id = val.Boat_Id;
            schedule.Boat_Name = val.Boat_Name;

            schedule.Owner_Id = val.User_Id;  

            ScheduleList.push(schedule);

          }
          else{

            schedule.User_RoleType = "Admin"
            schedule.id = val._id;
            
            schedule.title = val.title;
            schedule.body = "";
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

          schedule.User_RoleType = "Owner"
        
            schedule.id = val._id;//chance.guid();
            //schedule.calendarId = calendar.id;
            schedule.title = val.title;// +" "+ getFormattedDate(val.start)+ " to " + getFormattedDate(val.end);;
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

          schedule.User_RoleType = "Maintenance"
            schedule.id = val._id;//chance.guid();
            //schedule.calendarId = calendar.id;
            schedule.title = val.title;// +" "+ getFormattedDate(val.start)+ " to " + getFormattedDate(val.end);;
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
            schedule.bgColor = "#2c46f8";
            schedule.dragBgColor = "#2c46f8";
            schedule.borderColor = "#2c46f8";

            schedule.Boat_Id = val.Boat_Id;
            schedule.Boat_Name = val.Boat_Name;

            schedule.Owner_Id = val.User_Id;  

            ScheduleList.push(schedule);
        }

        

    





  

  }


  function Jqueary_string_to_Date_Convert(dateString){   
   
    var dateArray = dateString.split("/");
    //var dateObj = new Date(`${dateArray[2]}-${dateArray[0]}-${dateArray[1]}`);
    var dateObj =dateArray[1] +"/"+dateArray[0]+"/"+ dateArray[2];
  
    return dateObj;

  }


///////...................Resource Timeline end...............
  }
  
  /////////permission..............

  permissions_menuItems(){

    
    this.datas_log = JSON.parse(sessionStorage.getItem("permiss"));
    var datas_tmp1 = this.datas_log.data;
    
    if(datas_tmp1.UserType == "Sub Admin"){

      this.permissions = this.datas_log.data.Permissions;
      this.SubAdmin(this.permissions);

    }
    else{
      this.MainAdmin()

    }



  }

  MainAdmin(){

    this.Overview= true;
    this.NewBooking=true;
    this.TodaysBooking= true;
    this.Cancellations_permission= true;
    this.StandbyBooking= true;
    this.NeedAssistance= true;

  

  }
  SubAdmin(permis){

    

    this.Overview= permis.Dashboard.Overview;
    this.NewBooking= permis.Dashboard.NewBooking;
    this.TodaysBooking= permis.Dashboard.TodaysBooking;
    this.Cancellations_permission= permis.Dashboard.Cancellations;
    this.StandbyBooking= permis.Dashboard.StandbyBooking;
    this.NeedAssistance= permis.Dashboard.NeedAssistance;

  

  }



  //...............................


   getFormattedDate_WithOut_Zero_Time(dateVal) {
    var newDate = new Date(dateVal);

    var sMonth = this.padValue(newDate.getMonth() + 1);
    var sDay = this.padValue(newDate.getDate());
    var sYear = newDate.getFullYear();  
    
    return sDay + "-" + sMonth + "-" + sYear;
}

 padValue(value) {
  return (value < 10) ? "0" + value : value;
}

cancellation_responceRemove_to_Partialcancell(Cancelledresponse,partialcancel){

  var tmp_cancell = Cancelledresponse;
  var tmp_partial = partialcancel;

  tmp_partial.forEach(element => {

    tmp_cancell = tmp_cancell.filter(x => x._id != element.Scheduleid);
        
  });

  return tmp_cancell;


}




  getBooking(){

    this.http
    .get<any>(`${this.url}/ViewCancelledBookingNew`)
    .subscribe(
      (data_cancellBooking) => {

                  debugger;
        this.cancellationInfo = data_cancellBooking['response'];
        this.Cancellations_Count = this.cancellationInfo.length;
        this.cancellationInfoForupdates = this.cancellationInfo;

        this.http.get<any>(`${this.url}/ViewBookingDetailsWithBoatAndOwner`).subscribe(data => {
     
     
          this.Booking = data['response'];
          
          
          this.Booking.forEach(element => {
            
           
          var date = new Date(element.Current_Time);
          var upadtedate = new Date(element.Updated_time);
           
    
          var dates = date.getDate()
          var todaysDate = new Date();
    
          var updatedates = upadtedate.getDate();
          var todaysDates = todaysDate.getDate();
    
          var to_date = new Date();
          var to_date_only = this.getFormattedDate_WithOut_Zero_Time(to_date);// to_date.getDay();
    
          var start_Date = new Date(element.start);
          var start_Date_only = this.getFormattedDate_WithOut_Zero_Time(start_Date); //start_Date.getDay();
    
          
        if(to_date_only  == start_Date_only ){
    
          var obj_s = Object();
    
          if(element.BoatDetails.length !== 0){
    
          obj_s.Boat_Image = element.BoatDetails[0].Boat_Image[0];
          obj_s.imgUrl = this.imgUrl + element.BoatDetails[0].Boat_Image[0];
          obj_s.Boat_Name = element.BoatDetails[0].Boat_Name;
          obj_s.Boat_Number = element.BoatDetails[0].Boat_Number;
          obj_s._id = element._id;
    
          obj_s.Boat_Number_and_Booking_ID = element.BoatDetails[0].Boat_Number +"/"+element.Booking_ID;
    
          obj_s.start = element.start;
          obj_s.Boat_Id =  element.BoatDetails[0]._id;
          obj_s.end = element.end;
          obj_s.Booking_ID = element.Booking_ID;
          obj_s.Is_StandByBooking = element.Is_StandByBooking;
    
          obj_s.Location_Name = element.BoatDetails[0].Location_Name;
          obj_s.Location_Id = element.BoatDetails[0].Location_Id;
    
          if(element.OwnerDetails.length !== 0){
    
            obj_s.First_Name = element.OwnerDetails[0].First_Name;
            obj_s.Parking_Ability = element.OwnerDetails[0].Parking_Ability;
            obj_s.OwnerDetails = element.OwnerDetails[0];
    
          } 
    
          this.todaysBooking.push(obj_s);
    
    
          }      
    
         
    
    
    
        //obj2 = element; 
          
    
          }
          console.log(updatedates);
    console.log(todaysDates);
        if(updatedates  == todaysDates ){      
          var obj_s = Object();
    
          if(element.BoatDetails.length !== 0){
    
          obj_s.Boat_Image = element.BoatDetails[0].Boat_Image[0];
          obj_s.imgUrl = this.imgUrl + element.BoatDetails[0].Boat_Image[0];
          obj_s.Boat_Name = element.BoatDetails[0].Boat_Name;
          obj_s.start = element.start;
          obj_s.Boat_Id =  element.BoatDetails[0]._id;
          obj_s.end = element.end;
          obj_s.Booking_ID = element.Booking_ID;
          obj_s.Is_StandByBooking = element.Is_StandByBooking;
    
    
          obj_s.Boat_Number_and_Booking_ID = element.BoatDetails[0].Boat_Number +"/"+element.Booking_ID;
    
          obj_s.Boat_Number = element.BoatDetails[0].Boat_Number;
          obj_s._id = element._id;
          obj_s.Location_Name = element.BoatDetails[0].Location_Name;
          obj_s.Location_Id = element.BoatDetails[0].Location_Id;
    
          if(element.OwnerDetails.length !== 0){
    
            obj_s.First_Name = element.OwnerDetails[0].First_Name;
            obj_s.Parking_Ability = element.OwnerDetails[0].Parking_Ability;
            obj_s.OwnerDetails = element.OwnerDetails[0];
    
          } 
          this.newBooking.push(obj_s);
    
    
          }      
    
          
        }
    
        });
    
    
        //this is Start..........
        var standByBooking = data['StandbyBooking'];
    
        standByBooking.forEach(element => {
    
          var to_date = new Date();
          var to_date_only = this.getFormattedDate_WithOut_Zero_Time(to_date);// to_date.getDay();
    
          var start_Date = new Date(element.Updated_time);
          var start_Date_only = this.getFormattedDate_WithOut_Zero_Time(start_Date); //start_Date.getDay();
    
          var nexs_tDate = this.getFormattedDate_WithOut_Zero_Time(this.adding_MultipleDays(to_date,1));
    
          if(element.isOrginalBookingCanceled != true)
          {
          
          if(to_date_only == start_Date_only)
          {
                
              if(element.Is_StandByBooking == true){
    
                var obj_s = Object();
    
                if(element.BoatDetails.length !== 0){
    
                  obj_s._Id = element._id;
                obj_s.Boat_Image = element.BoatDetails[0].Boat_Image[0];
                obj_s.imgUrl = this.imgUrl + element.BoatDetails[0].Boat_Image[0];
                obj_s.Boat_Name = element.BoatDetails[0].Boat_Name;
                obj_s.start = element.start;
                obj_s.Boat_Id =  element.BoatDetails[0]._id;
                obj_s.end = element.end;
                obj_s.Booking_ID = element.Booking_ID;
    
                obj_s.Boat_Number_and_Booking_ID = element.BoatDetails[0].Boat_Number +"/"+element.Booking_ID;
    
                obj_s.Boat_Number = element.BoatDetails[0].Boat_Number;
                obj_s._id = element._id;
                obj_s.Location_Name = element.BoatDetails[0].Location_Name;
                obj_s.Location_Id = element.BoatDetails[0].Location_Id;
    
                if(element.OwnerDetails.length !== 0){
    
                  obj_s.First_Name = element.OwnerDetails[0].First_Name;
                  obj_s.Parking_Ability = element.OwnerDetails[0].Parking_Ability;
                  obj_s.OwnerDetails = element.OwnerDetails[0];
    
                } 
    
                this.Stand_by_Booking.push(obj_s);
    
    
                }      
    
    
              }
    
          }
          else if(nexs_tDate == start_Date_only)
          {
    
            if(element.Is_StandByBooking == true){
    
              var obj_s = Object();
    
              if(element.BoatDetails.length !== 0){
    
                obj_s._Id = element._id;
              obj_s.Boat_Image = element.BoatDetails[0].Boat_Image[0];
              obj_s.imgUrl = this.imgUrl + element.BoatDetails[0].Boat_Image[0];
              obj_s.Boat_Name = element.BoatDetails[0].Boat_Name;
              obj_s.start = element.start;
              obj_s.Boat_Id =  element.BoatDetails[0]._id;
              obj_s.end = element.end;
              obj_s.Booking_ID = element.Booking_ID;
    
              obj_s.Boat_Number_and_Booking_ID = element.BoatDetails[0].Boat_Number +"/"+element.Booking_ID;
    
              obj_s.Boat_Number = element.BoatDetails[0].Boat_Number;
              obj_s._id = element._id;
              obj_s.Location_Name = element.BoatDetails[0].Location_Name;
              obj_s.Location_Id = element.BoatDetails[0].Location_Id;
    
              if(element.OwnerDetails.length !== 0){
    
                obj_s.First_Name = element.OwnerDetails[0].First_Name;
                obj_s.Parking_Ability = element.OwnerDetails[0].Parking_Ability;
                obj_s.OwnerDetails = element.OwnerDetails[0];
    
              } 
    
              this.Stand_by_Booking.push(obj_s);
    
    
              }      
    
    
            }
    
          }
    
        }
    
        
    
        });
    
    
        ////End...................
    
        this.Cancellations = this.cancellation_responceRemove_to_Partialcancell(data['Cancelledresponse'],data['partialcancel']);
        
       
    
        /// cancell .... 01
    
        
        //Cancell ......02
    
        this.Cancellations.forEach(element => {
          var obj4 = Object();
          var date = new Date(element.Updated_time);
          var dates = date.getDate()
          var todaysDate = new Date();
          var todaysDates = todaysDate.getDate()
          if(dates  == todaysDates )
          {
                
            if(element.BoatDetails.length !== 0){
    
            
            if(element.BookingStatus == "Accepted"){
    
              var obj_s = Object();
              
      
            obj_s.Boat_Image = element.BoatDetails[0].Boat_Image[0];
            obj_s.imgUrl = this.imgUrl + element.BoatDetails[0].Boat_Image[0];
            obj_s.Boat_Name = element.BoatDetails[0].Boat_Name;
            obj_s.start = element.start;
            obj_s.Boat_Id =  element.BoatDetails[0]._id;
            obj_s.end = element.end;
            obj_s.Booking_ID = element.Booking_ID;
            obj_s.BookingStatus = element.BookingStatus;
            obj_s.Approved_LOA = element.Approved_LOA;
            obj_s.LOA = element.LOA;
    
    
            var boatnum = element.BoatDetails[0].Boat_Number;
    
            if (typeof boatnum !== "undefined" || boatnum != null){
             
              obj_s.Boat_Number = element.BoatDetails[0].Boat_Number;
              obj_s.Boat_Number_and_Booking_ID = element.BoatDetails[0].Boat_Number +"/"+element.Booking_ID;
            }
            else{
    
              obj_s.Boat_Number = 0;
              obj_s.Boat_Number_and_Booking_ID = 0 +"/"+element.Booking_ID;
              
    
            }
    
            obj_s._id = element._id;
            obj_s.Location_Name = element.BoatDetails[0].Location_Name;
            obj_s.Location_Id = element.BoatDetails[0].Location_Id;
            if(element.OwnerDetails.length !== 0){
      
              obj_s.First_Name = element.OwnerDetails[0].First_Name;
              obj_s.Parking_Ability = element.OwnerDetails[0].Parking_Ability;
              obj_s.OwnerDetails = element.OwnerDetails[0];
      
            } 
    
            
      
             this.Cancels_Second.push(obj_s);
      
      
            }
    
            else if(element.BookingStatus != "Accepted") 
            {
    
              var obj_s = Object();
      
            obj_s.Boat_Image = element.BoatDetails[0].Boat_Image[0];
            obj_s.imgUrl = this.imgUrl + element.BoatDetails[0].Boat_Image[0];
            obj_s.Boat_Name = element.BoatDetails[0].Boat_Name;
            obj_s.start = element.start;
            obj_s.Boat_Id =  element.BoatDetails[0]._id;
            obj_s.end = element.end;
            obj_s.Booking_ID = element.Booking_ID;
            obj_s.BookingStatus = element.BookingStatus;
            obj_s.Approved_LOA = element.Approved_LOA;
            obj_s.LOA = element.LOA;
    
            obj_s.WeekDay_Count = element.WeekDay_Count;
          obj_s.WeekDay_Count_Edit = element.WeekDay_Count_Edit;
          obj_s.WeekDay_Count_Reassign = element.WeekDay_Count_Reassign;
          obj_s.WeekEnd_Count = element.WeekEnd_Count
          obj_s.WeekEnd_Count_Edit = element.WeekEnd_Count_Edit;
          obj_s.WeekEnd_Count_Reassign = element.WeekEnd_Count_Reassign;
            
    
            if (typeof element.BoatDetails[0].Boat_Number !== "undefined" || element.BoatDetails[0].Boat_Number != null){
              
              obj_s.Boat_Number = element.BoatDetails[0].Boat_Number;
              obj_s.Boat_Number_and_Booking_ID = element.BoatDetails[0].Boat_Number +"/"+element.Booking_ID;
    
            }
            else{
              
              obj_s.Boat_Number = 0;
              obj_s.Boat_Number_and_Booking_ID = 0 +"/"+element.Booking_ID;
    
            }
            
            obj_s._id = element._id;
            obj_s.Location_Name = element.BoatDetails[0].Location_Name;
            obj_s.Location_Id = element.BoatDetails[0].Location_Id;
            if(element.OwnerDetails.length !== 0){
      
              obj_s.First_Name = element.OwnerDetails[0].First_Name;
              obj_s.Parking_Ability = element.OwnerDetails[0].Parking_Ability;
              obj_s.OwnerDetails = element.OwnerDetails[0];
      
            } 
      
             this.Cancels_First.push(obj_s);
      
      
            }
    
            else
            {
    
              var obj_s = Object();
    
            obj_s.Boat_Image = element.BoatDetails[0].Boat_Image[0];
            obj_s.imgUrl = this.imgUrl + element.BoatDetails[0].Boat_Image[0];
            obj_s.Boat_Name = element.BoatDetails[0].Boat_Name;
            obj_s.start = element.start;
            obj_s.Boat_Id =  element.BoatDetails[0]._id;
            obj_s.end = element.end;
            obj_s.Booking_ID = element.Booking_ID;
            obj_s.BookingStatus = element.BookingStatus;
            obj_s.Approved_LOA = element.Approved_LOA;
            obj_s.LOA = element.LOA;
    
            if (typeof element.BoatDetails[0].Boat_Number !== "undefined" || element.BoatDetails[0].Boat_Number != null){
              obj_s.Boat_Number = element.BoatDetails[0].Boat_Number;
              obj_s.Boat_Number_and_Booking_ID = element.BoatDetails[0].Boat_Number +"/"+element.Booking_ID;
            }
            else{
              
              obj_s.Boat_Number = 0;
              obj_s.Boat_Number_and_Booking_ID = 0 +"/"+element.Booking_ID;
    
            }
            obj_s._id = element._id;
            obj_s.Location_Name = element.BoatDetails[0].Location_Name;
            obj_s.Location_Id = element.BoatDetails[0].Location_Id;
            if(element.OwnerDetails.length !== 0){
      
              obj_s.First_Name = element.OwnerDetails[0].First_Name;
              obj_s.Parking_Ability = element.OwnerDetails[0].Parking_Ability;
              obj_s.OwnerDetails = element.OwnerDetails[0];
      
             } 
      
             this.Cancels_Thread.push(obj_s);
      
      
            
    
            } 
            
            
    
    
          }     
            
            
            // obj4 = element       
            //     this.Cancels.push(obj4);
            
          }
      
      
        });
    
    
        /*Cancels_First:any[];
      Cancels_Second:any[];*/
    
    
      this.Cancellations.forEach(element => {
        var obj4 = Object();
        var date = new Date(element.Updated_time);
        var dates = date.getDate()
        var todaysDate = new Date();
        var todaysDates = todaysDate.getDate()
        if(dates  == todaysDates )
        {
          
          var obj_s = Object();
      
          if(element.BoatDetails.length !== 0){
    
           
    
          obj_s.Boat_Image = element.BoatDetails[0].Boat_Image[0];
          obj_s.imgUrl = this.imgUrl + element.BoatDetails[0].Boat_Image[0];
          obj_s.Boat_Name = element.BoatDetails[0].Boat_Name;
          obj_s.start = element.start;
          obj_s.Boat_Id =  element.BoatDetails[0]._id;
          obj_s.end = element.end;
          obj_s.Booking_ID = element.Booking_ID;
          obj_s.BookingStatus = element.BookingStatus;
          obj_s.Approved_LOA = element.Approved_LOA;
    
          obj_s.Boat_Number = element.BoatDetails[0].Boat_Number;
          obj_s._id = element._id;
          obj_s.Location_Name = element.BoatDetails[0].Location_Name;
          obj_s.Location_Id = element.BoatDetails[0].Location_Id;
          if(element.OwnerDetails.length !== 0){
    
            obj_s.First_Name = element.OwnerDetails[0].First_Name;
            obj_s.Parking_Ability = element.OwnerDetails[0].Parking_Ability;
            obj_s.OwnerDetails = element.OwnerDetails[0];
    
          } 
    
           this.Cancels.push(obj_s);
    
    
          }      
          
          
          // obj4 = element       
          //     this.Cancels.push(obj4);
          
        }
    
    
      });
    
    
    
        
      
        this.Cancellations_Count = this.Cancellations_Count + this.Cancels.length;
        this.New_Booking_Count = this.newBooking.length;
        this.Todays_Booking_Count = this.todaysBooking.length;
        this.Stand_by_Booking_Count = this.Stand_by_Booking.length;
    
       }, err => {
       })
       
      },
      (err) => {}
    );


   



  }

  public ApproveLop_Partial(cancelinfo): void {
   
    debugger;
    this.IsmodelActive = true;
    this.ApproveLopDetails_Partial.Boat_Id = cancelinfo.BoatDetails[0]._id;
    this.ApproveLopDetails_Partial.Booking_ID = cancelinfo.Booking_ID;
    this.ApproveLopDetails_Partial.LOA = cancelinfo.LOA;
    this.ApproveLopDetails_Partial.WeekDay_Count = cancelinfo.WeekDay_Count;
    this.ApproveLopDetails_Partial.WeekEnd_Count = cancelinfo.WeekEnd_Count;
    this.ApproveLopDetails_Partial.IsActive = true;
    this.ApproveLopDetails_Partial._id = cancelinfo.Scheduleid;
    this.ApproveLopDetails_Partial.partialcancelationid = cancelinfo._id;
    


    this.ApproveLopDetails_Partial.WeekDay_Count_Edit = cancelinfo.WeekDay_Count;
    this.ApproveLopDetails_Partial.WeekEnd_Count_Edit = cancelinfo.WeekEnd_Count;
    this.ApproveLopDetails_Partial.Total_Edit_Loa = cancelinfo.Total_Edit_Loa;
    this.ApproveLopDetails_Partial.PartialCancellation_Status = cancelinfo.PartialCancellation_Status;




    if (cancelinfo.OwnerDetails.length) {
      this.ApproveLopDetails_Partial.Name = cancelinfo.OwnerDetails[0].First_Name;
    } else {
      this.ApproveLopDetails_Partial.Name = this.NotFound; 
    }
  }


  
   public ApproveLop(cancelinfo): void {
      
    this.IsmodelActive = true;
    this.ApproveLopDetails.Boat_Id = cancelinfo._id;
    this.ApproveLopDetails.Booking_ID = cancelinfo.Booking_ID;
    this.ApproveLopDetails.LOA = cancelinfo.LOA;
    this.ApproveLopDetails.IsActive = true;
    this.ApproveLopDetails._id = cancelinfo._id;
    this.ApproveLopDetails.WeekDay_Count = cancelinfo.WeekDay_Count;
    this.ApproveLopDetails.WeekEnd_Count = cancelinfo.WeekEnd_Count;

    
      this.ApproveLopDetails.Name = cancelinfo.First_Name;
   
  }


  public UpdateLop(): void {

    
    
    if(this.ApproveLopDetails.LOA){
      delete this.ApproveLopDetails.Name
      
        this.http.post<any>(`${this.url}/ApproveCancellation`, this.ApproveLopDetails  ).subscribe(data => {  

         

         if(data.status == true){

          this.getResponce = data.message;
          $('#pop-up-btn_btn').trigger('click');

         }
         
       
      });
     }else{
    
    }
  }

  public UpdateLop_partial(): void {
    
    debugger;
    // if(this.ApproveLopDetails.LOA){
      delete this.ApproveLopDetails_Partial.Name

      /*
      WeekDay_Count
      WeekEnd_Count
      */
      
       console.log(this.ApproveLopDetails_Partial);
        this.http.post<any>(`${this.url}/ApproveCancellationNew`, this.ApproveLopDetails_Partial  ).subscribe(data => {  

         if(data.status == true){

          this.getResponce = data.message;
          $('#pop-up-btn_btn').trigger('click');

         }
         
        console.log('uploadsuccess', data);
      });
    //  }else{

    //   this.getResponce = "LOA is Required";
    //       $('#pop-up-btn_btn').trigger('click');

     
    // }
  }


 adding_MultipleDays(date,numberOfdays){
     
    var newdate = date;//new Date(date);
    newdate.setDate(newdate.getDate() + numberOfdays);
    return new Date(newdate);
}

  

  getLoction(){
    this.http.get<any>(`${this.url_Boat}/GetLocation`).subscribe(data => {    
     
  this.loctions = data['response']
  
   }, err => {
   })
  }

  getAllBoat(){

    var obj = Object();
             obj.alphabet = "";
           this.http.post<any>(`${this.url_Boat_Shedule}/GetBoatNames`, obj).subscribe(data => { 
             this.dropdown_Boat_List = data.response;                          
              this.dropdown_Boat_List_static = data.response;                
                     
             }, err => {
              
             })

  }
  getLoctionTypeId_Boat(loc){

    
    
  this.public_baotType_Single_id = loc._id;
   // this.cancellationInfo = [];
    this.newBooking = [];
    this.Stand_by_Booking = [];
    this.todaysBooking = [];

    this.Cancels_Thread = [];
    this.Cancels_First = [];
    this.Cancels_Second = [];


    this.http
    .get<any>(`${this.url}/ViewCancelledBookingNew`)
    .subscribe(
      (data_cancellBooking) => {

                  
       // this.cancellationInfo = data_cancellBooking['response'];

        //this.Cancellations_Count = this.cancellationInfo.length;

        this.http.get<any>(`${this.url}/ViewBookingDetailsWithBoatAndOwner`).subscribe(data => {

     
     
          this.Booking = data['response']
          this.Booking.forEach(element => {
          //   var obj2 = Object();
          //   var obj3 = Object();
          // var date = new Date(element.Current_Time);
          // var upadtedate = new Date(element.Updated_time);
    
          // var dates = date.getDate();
          // var todaysDate = new Date();
    
          // var updatedates = upadtedate.getDate();
          // var todaysDates = todaysDate.getDate();
    
    
          // var to_date = new Date();
          // var to_date_only = this.getFormattedDate_WithOut_Zero_Time(to_date);// to_date.getDay();
    
          // var start_Date = new Date(element.start);
          // var start_Date_only = this.getFormattedDate_WithOut_Zero_Time(start_Date); //start_Date.getDay();
          let upadtedate = new Date(element.Updated_time);
          var d = new Date();
            if(this.selectedDaysforlist == 2){
              d.setDate(d.getDate() - 2);
            }else if(this.selectedDaysforlist == 3){
              d.setDate(d.getDate() - 3);
            }else if(this.selectedDaysforlist == 5){
              d.setDate(d.getDate() - 5);
            }else{
              d.setDate(d.getDate());
            }
          let updatedates = this.getFormattedDate_WithOut_Zero_Time(upadtedate);
          let selectedDays = this.getFormattedDate_WithOut_Zero_Time(d.toString());
    console.log(updatedates);
    console.log(selectedDays);
    if(this.selectedDaysforlist == 24){
    if( selectedDays == updatedates){
      var obj_s = Object();
    
      if(element.BoatDetails.length !== 0){

      obj_s.Boat_Image = element.BoatDetails[0].Boat_Image[0];
      obj_s.imgUrl = this.imgUrl + element.BoatDetails[0].Boat_Image[0];
      obj_s.Boat_Name = element.BoatDetails[0].Boat_Name;
      obj_s.start = element.start;
      obj_s.Boat_Id =  element.BoatDetails[0]._id;
      obj_s.end = element.end;
      obj_s.Booking_ID = element.Booking_ID;
      obj_s.Is_StandByBooking = element.Is_StandByBooking;

      obj_s.Boat_Number_and_Booking_ID = element.BoatDetails[0].Boat_Number +"/"+element.Booking_ID;

      obj_s.Location_Name = element.BoatDetails[0].Location_Name;
      obj_s.Location_Id = element.BoatDetails[0].Location_Id;

      if(element.OwnerDetails.length !== 0){

        obj_s.First_Name = element.OwnerDetails[0].First_Name;
        obj_s.Parking_Ability = element.OwnerDetails[0].Parking_Ability;
        obj_s.OwnerDetails = element.OwnerDetails[0];

      } 
      this.newBooking.push(obj_s);

      } 
        let to_date = new Date();
        let to_date_only = this.getFormattedDate_WithOut_Zero_Time(to_date);// to_date.getDay();
        let start_Date = new Date(element.start);
        let start_Date_only = this.getFormattedDate_WithOut_Zero_Time(start_Date); //start_Date.getDay();
          if(to_date_only  == start_Date_only ){
    
            var obj_s = Object();
      
            if(element.BoatDetails.length !== 0){
      
            obj_s.Boat_Image = element.BoatDetails[0].Boat_Image[0];
            obj_s.imgUrl = this.imgUrl + element.BoatDetails[0].Boat_Image[0];
            obj_s.Boat_Name = element.BoatDetails[0].Boat_Name;
            obj_s.start = element.start;
            obj_s.Boat_Id =  element.BoatDetails[0]._id;
            obj_s.end = element.end;
            obj_s.Booking_ID = element.Booking_ID;
            obj_s.Is_StandByBooking = element.Is_StandByBooking;
    
            obj_s.Boat_Number_and_Booking_ID = element.BoatDetails[0].Boat_Number +"/"+element.Booking_ID;
    
            obj_s.Location_Name = element.BoatDetails[0].Location_Name;
            obj_s.Location_Id = element.BoatDetails[0].Location_Id;
            if(element.OwnerDetails.length !== 0){
      
              obj_s.First_Name = element.OwnerDetails[0].First_Name;
              obj_s.Parking_Ability = element.OwnerDetails[0].Parking_Ability;
              obj_s.OwnerDetails = element.OwnerDetails[0];
      
            } 
      
             this.todaysBooking.push(obj_s);
      
    
            }      
      
            
            }
          
    
        }
    
      } else {
        if( selectedDays <= updatedates){
          var obj_s = Object();
        
          if(element.BoatDetails.length !== 0){
    
          obj_s.Boat_Image = element.BoatDetails[0].Boat_Image[0];
          obj_s.imgUrl = this.imgUrl + element.BoatDetails[0].Boat_Image[0];
          obj_s.Boat_Name = element.BoatDetails[0].Boat_Name;
          obj_s.start = element.start;
          obj_s.Boat_Id =  element.BoatDetails[0]._id;
          obj_s.end = element.end;
          obj_s.Booking_ID = element.Booking_ID;
          obj_s.Is_StandByBooking = element.Is_StandByBooking;
    
          obj_s.Boat_Number_and_Booking_ID = element.BoatDetails[0].Boat_Number +"/"+element.Booking_ID;
    
          obj_s.Location_Name = element.BoatDetails[0].Location_Name;
          obj_s.Location_Id = element.BoatDetails[0].Location_Id;
    
          if(element.OwnerDetails.length !== 0){
    
            obj_s.First_Name = element.OwnerDetails[0].First_Name;
            obj_s.Parking_Ability = element.OwnerDetails[0].Parking_Ability;
            obj_s.OwnerDetails = element.OwnerDetails[0];
    
          } 
          this.newBooking.push(obj_s);
    
          } 
            let to_date = new Date();
            let to_date_only = this.getFormattedDate_WithOut_Zero_Time(to_date);// to_date.getDay();
            let start_Date = new Date(element.start);
            let start_Date_only = this.getFormattedDate_WithOut_Zero_Time(start_Date); //start_Date.getDay();
              if(to_date_only  == start_Date_only ){
        
                var obj_s = Object();
          
                if(element.BoatDetails.length !== 0){
          
                obj_s.Boat_Image = element.BoatDetails[0].Boat_Image[0];
                obj_s.imgUrl = this.imgUrl + element.BoatDetails[0].Boat_Image[0];
                obj_s.Boat_Name = element.BoatDetails[0].Boat_Name;
                obj_s.start = element.start;
                obj_s.Boat_Id =  element.BoatDetails[0]._id;
                obj_s.end = element.end;
                obj_s.Booking_ID = element.Booking_ID;
                obj_s.Is_StandByBooking = element.Is_StandByBooking;
        
                obj_s.Boat_Number_and_Booking_ID = element.BoatDetails[0].Boat_Number +"/"+element.Booking_ID;
        
                obj_s.Location_Name = element.BoatDetails[0].Location_Name;
                obj_s.Location_Id = element.BoatDetails[0].Location_Id;
                if(element.OwnerDetails.length !== 0){
          
                  obj_s.First_Name = element.OwnerDetails[0].First_Name;
                  obj_s.Parking_Ability = element.OwnerDetails[0].Parking_Ability;
                  obj_s.OwnerDetails = element.OwnerDetails[0];
          
                } 
          
                 this.todaysBooking.push(obj_s);
          
        
                }      
          
                
                }
              
        
            }

      }
      
      
      });
      
       var standByBooking = data['StandbyBooking']
    
        standByBooking.forEach(element => {
    
          var to_date = new Date();
          var to_date_only = this.getFormattedDate_WithOut_Zero_Time(to_date);// to_date.getDay();
    
          var start_Date = new Date(element.Updated_time);
          var start_Date_only = this.getFormattedDate_WithOut_Zero_Time(start_Date); //start_Date.getDay();
    
          var nexs_tDate = this.getFormattedDate_WithOut_Zero_Time(this.adding_MultipleDays(to_date,1));
    
          if(element.isOrginalBookingCanceled != true)
          {
          if(to_date_only == start_Date_only)
          {
                
              if(element.Is_StandByBooking == true){
    
                var obj_s = Object();
    
                if(element.BoatDetails.length !== 0){
    
                  obj_s._Id = element._id;
                obj_s.Boat_Image = element.BoatDetails[0].Boat_Image[0];
                obj_s.imgUrl = this.imgUrl + element.BoatDetails[0].Boat_Image[0];
                obj_s.Boat_Name = element.BoatDetails[0].Boat_Name;
                obj_s.start = element.start;
                obj_s.Boat_Id =  element.BoatDetails[0]._id;
                obj_s.end = element.end;
                obj_s.Booking_ID = element.Booking_ID;
    
                obj_s.Boat_Number_and_Booking_ID = element.BoatDetails[0].Boat_Number +"/"+element.Booking_ID;
    
                obj_s.Boat_Number = element.BoatDetails[0].Boat_Number;
                obj_s._id = element._id;
                obj_s.Location_Name = element.BoatDetails[0].Location_Name;
                obj_s.Location_Id = element.BoatDetails[0].Location_Id;
    
                if(element.OwnerDetails.length !== 0){
    
                  obj_s.First_Name = element.OwnerDetails[0].First_Name;
                  obj_s.Parking_Ability = element.OwnerDetails[0].Parking_Ability;
                  obj_s.OwnerDetails = element.OwnerDetails[0];
    
                } 
    
                this.Stand_by_Booking.push(obj_s);
    
    
                }      
    
    
              }
    
          }
          else if(nexs_tDate == start_Date_only)
          {
    
            if(element.Is_StandByBooking == true){
    
              var obj_s = Object();
    
              if(element.BoatDetails.length !== 0){
    
                obj_s._Id = element._id;
              obj_s.Boat_Image = element.BoatDetails[0].Boat_Image[0];
              obj_s.imgUrl = this.imgUrl + element.BoatDetails[0].Boat_Image[0];
              obj_s.Boat_Name = element.BoatDetails[0].Boat_Name;
              obj_s.start = element.start;
              obj_s.Boat_Id =  element.BoatDetails[0]._id;
              obj_s.end = element.end;
              obj_s.Booking_ID = element.Booking_ID;
    
              obj_s.Boat_Number_and_Booking_ID = element.BoatDetails[0].Boat_Number +"/"+element.Booking_ID;
    
              obj_s.Boat_Number = element.BoatDetails[0].Boat_Number;
              obj_s._id = element._id;
              obj_s.Location_Name = element.BoatDetails[0].Location_Name;
              obj_s.Location_Id = element.BoatDetails[0].Location_Id;
    
              if(element.OwnerDetails.length !== 0){
    
                obj_s.First_Name = element.OwnerDetails[0].First_Name;
                obj_s.Parking_Ability = element.OwnerDetails[0].Parking_Ability;
                obj_s.OwnerDetails = element.OwnerDetails[0];
    
              } 
    
              this.Stand_by_Booking.push(obj_s);
    
    
              }      
    
    
            }
    
          }
    
        }
    
        
    
        });
    
    
    
    
    
    
    
    
    
      this.Cancellations = this.cancellation_responceRemove_to_Partialcancell(data['Cancelledresponse'],data['partialcancel']);
      this.Cancels = [];
      this.Cancellations.forEach(element => {
        let upadtedate = new Date(element.Updated_time);
          var d1 = new Date();
            if(this.selectedDaysforlist == 2){
              d1.setDate(d1.getDate() - 2);
            }else if(this.selectedDaysforlist == 3){
              d1.setDate(d1.getDate() - 3);
            }else if(this.selectedDaysforlist == 5){
              d1.setDate(d1.getDate() - 5);
            }else{
              d1.setDate(d1.getDate());
            }
          let updatedates = this.getFormattedDate_WithOut_Zero_Time(upadtedate);
          let selectedDays = this.getFormattedDate_WithOut_Zero_Time(d1.toString())
        if(this.selectedDaysforlist == 24){
          if( selectedDays == updatedates)
        {
          
          var obj_s = Object();
      
          if(element.BoatDetails.length !== 0){
    
          obj_s.Boat_Image = element.BoatDetails[0].Boat_Image[0];
          obj_s.imgUrl = this.imgUrl + element.BoatDetails[0].Boat_Image[0];
          obj_s.Boat_Name = element.BoatDetails[0].Boat_Name;
          obj_s.start = element.start;
          obj_s.Boat_Id =  element.BoatDetails[0]._id;
          obj_s.end = element.end;
          obj_s.Booking_ID = element.Booking_ID;
    
          obj_s.Location_Name = element.BoatDetails[0].Location_Name;
          obj_s.Location_Id = element.BoatDetails[0].Location_Id;
          if(element.OwnerDetails.length !== 0){
    
            obj_s.First_Name = element.OwnerDetails[0].First_Name;
            obj_s.Parking_Ability = element.OwnerDetails[0].Parking_Ability;
            obj_s.OwnerDetails = element.OwnerDetails[0];
    
          } 
    
           this.Cancels.push(obj_s);
    
    
          }     
               
        } 
      } else {
        if( selectedDays <= updatedates)
        {
          
          var obj_s = Object();
      
          if(element.BoatDetails.length !== 0){
    
          obj_s.Boat_Image = element.BoatDetails[0].Boat_Image[0];
          obj_s.imgUrl = this.imgUrl + element.BoatDetails[0].Boat_Image[0];
          obj_s.Boat_Name = element.BoatDetails[0].Boat_Name;
          obj_s.start = element.start;
          obj_s.Boat_Id =  element.BoatDetails[0]._id;
          obj_s.end = element.end;
          obj_s.Booking_ID = element.Booking_ID;
    
          obj_s.Location_Name = element.BoatDetails[0].Location_Name;
          obj_s.Location_Id = element.BoatDetails[0].Location_Id;
          if(element.OwnerDetails.length !== 0){
    
            obj_s.First_Name = element.OwnerDetails[0].First_Name;
            obj_s.Parking_Ability = element.OwnerDetails[0].Parking_Ability;
            obj_s.OwnerDetails = element.OwnerDetails[0];
    
          } 
    
           this.Cancels.push(obj_s);
    
    
          }     
               
        } 
      }
    
    
      });
    
    
       //Cancell ......02
    
       this.Cancellations.forEach(element => {
        // var obj4 = Object();
        // var date = new Date(element.Updated_time);
        // var dates = date.getDate()
        // var todaysDate = new Date();
        // var todaysDates = todaysDate.getDate()
        // if(dates  == todaysDates )
        // {
          let upadtedate = new Date(element.Updated_time);
          var d1 = new Date();
            if(this.selectedDaysforlist == 2){
              d1.setDate(d1.getDate() - 2);
            }else if(this.selectedDaysforlist == 3){
              d1.setDate(d1.getDate() - 3);
            }else if(this.selectedDaysforlist == 5){
              d1.setDate(d1.getDate() - 5);
            }else{
              d1.setDate(d1.getDate());
            }
          let updatedates = this.getFormattedDate_WithOut_Zero_Time(upadtedate);
          let selectedDays = this.getFormattedDate_WithOut_Zero_Time(d1.toString())
       if(this.selectedDaysforlist == 24){
          if( selectedDays == updatedates)
        {
              
          if(element.BoatDetails.length !== 0){
    
          
          if(element.BookingStatus == "Accepted"){
    
            var obj_s = Object();
            
    
          obj_s.Boat_Image = element.BoatDetails[0].Boat_Image[0];
          obj_s.imgUrl = this.imgUrl + element.BoatDetails[0].Boat_Image[0];
          obj_s.Boat_Name = element.BoatDetails[0].Boat_Name;
          obj_s.start = element.start;
          obj_s.Boat_Id =  element.BoatDetails[0]._id;
          obj_s.end = element.end;
          obj_s.Booking_ID = element.Booking_ID;
          obj_s.BookingStatus = element.BookingStatus;
          obj_s.Approved_LOA = element.Approved_LOA;
          obj_s.LOA = element.LOA;
    
          var boatnum = element.BoatDetails[0].Boat_Number;
    
          if (typeof boatnum !== "undefined" || boatnum != null){
           
            obj_s.Boat_Number = element.BoatDetails[0].Boat_Number;
            obj_s.Boat_Number_and_Booking_ID = element.BoatDetails[0].Boat_Number +"/"+element.Booking_ID;
          }
          else{
    
            obj_s.Boat_Number = 0;
            obj_s.Boat_Number_and_Booking_ID = 0 +"/"+element.Booking_ID;
            
    
          }
    
          obj_s._id = element._id;
          obj_s.Location_Name = element.BoatDetails[0].Location_Name;
          obj_s.Location_Id = element.BoatDetails[0].Location_Id;
          if(element.OwnerDetails.length !== 0){
    
            obj_s.First_Name = element.OwnerDetails[0].First_Name;
            obj_s.Parking_Ability = element.OwnerDetails[0].Parking_Ability;
            obj_s.OwnerDetails = element.OwnerDetails[0];
    
          } 
    
          
    
           this.Cancels_Second.push(obj_s);
    
    
          }
    
          else if(element.BookingStatus != "Accepted") 
          {
    
            var obj_s = Object();
    
          obj_s.Boat_Image = element.BoatDetails[0].Boat_Image[0];
          obj_s.imgUrl = this.imgUrl + element.BoatDetails[0].Boat_Image[0];
          obj_s.Boat_Name = element.BoatDetails[0].Boat_Name;
          obj_s.start = element.start;
          obj_s.Boat_Id =  element.BoatDetails[0]._id;
          obj_s.end = element.end;
          obj_s.Booking_ID = element.Booking_ID;
          obj_s.BookingStatus = element.BookingStatus;
          obj_s.Approved_LOA = element.Approved_LOA;
          obj_s.LOA = element.LOA;
    
          obj_s.WeekDay_Count = element.WeekDay_Count;
          obj_s.WeekDay_Count_Edit = element.WeekDay_Count_Edit;
          obj_s.WeekDay_Count_Reassign = element.WeekDay_Count_Reassign;
          obj_s.WeekEnd_Count = element.WeekEnd_Count
          obj_s.WeekEnd_Count_Edit = element.WeekEnd_Count_Edit;
          obj_s.WeekEnd_Count_Reassign = element.WeekEnd_Count_Reassign;
    
          
    
          if (typeof element.BoatDetails[0].Boat_Number !== "undefined" || element.BoatDetails[0].Boat_Number != null){
            
            obj_s.Boat_Number = element.BoatDetails[0].Boat_Number;
            obj_s.Boat_Number_and_Booking_ID = element.BoatDetails[0].Boat_Number +"/"+element.Booking_ID;
          }
          else{
            
            obj_s.Boat_Number = 0;
            obj_s.Boat_Number_and_Booking_ID = 0 +"/"+element.Booking_ID;
    
          }
          
          obj_s._id = element._id;
          obj_s.Location_Name = element.BoatDetails[0].Location_Name;
          obj_s.Location_Id = element.BoatDetails[0].Location_Id;
          if(element.OwnerDetails.length !== 0){
    
            obj_s.First_Name = element.OwnerDetails[0].First_Name;
            obj_s.Parking_Ability = element.OwnerDetails[0].Parking_Ability;
            obj_s.OwnerDetails = element.OwnerDetails[0];
    
          } 
    
           this.Cancels_First.push(obj_s);
    
    
          }
    
          else
          {
    
            var obj_s = Object();
    
          obj_s.Boat_Image = element.BoatDetails[0].Boat_Image[0];
          obj_s.imgUrl = this.imgUrl + element.BoatDetails[0].Boat_Image[0];
          obj_s.Boat_Name = element.BoatDetails[0].Boat_Name;
          obj_s.start = element.start;
          obj_s.Boat_Id =  element.BoatDetails[0]._id;
          obj_s.end = element.end;
          obj_s.Booking_ID = element.Booking_ID;
          obj_s.BookingStatus = element.BookingStatus;
          obj_s.Approved_LOA = element.Approved_LOA;
          obj_s.LOA = element.LOA;
    
          
    
          if (typeof element.BoatDetails[0].Boat_Number !== "undefined" || element.BoatDetails[0].Boat_Number != null){
            obj_s.Boat_Number = element.BoatDetails[0].Boat_Number;
            obj_s.Boat_Number_and_Booking_ID = element.BoatDetails[0].Boat_Number +"/"+element.Booking_ID;
            
          }
          else{
            
            obj_s.Boat_Number = 0;
            obj_s.Boat_Number_and_Booking_ID = 0 +"/"+element.Booking_ID;
    
          }
          obj_s._id = element._id;
          obj_s.Location_Name = element.BoatDetails[0].Location_Name;
          obj_s.Location_Id = element.BoatDetails[0].Location_Id;
          if(element.OwnerDetails.length !== 0){
    
            obj_s.First_Name = element.OwnerDetails[0].First_Name;
            obj_s.Parking_Ability = element.OwnerDetails[0].Parking_Ability;
            obj_s.OwnerDetails = element.OwnerDetails[0];
    
          } 
    
           this.Cancels_Thread.push(obj_s);
    
    
          
    
          } 
          
          
    
    
        }     
          
          
          // obj4 = element       
          //     this.Cancels.push(obj4);
          
        } 
      } else {
        if( selectedDays <= updatedates)
        {
              
          if(element.BoatDetails.length !== 0){
    
          
          if(element.BookingStatus == "Accepted"){
    
            var obj_s = Object();
            
    
          obj_s.Boat_Image = element.BoatDetails[0].Boat_Image[0];
          obj_s.imgUrl = this.imgUrl + element.BoatDetails[0].Boat_Image[0];
          obj_s.Boat_Name = element.BoatDetails[0].Boat_Name;
          obj_s.start = element.start;
          obj_s.Boat_Id =  element.BoatDetails[0]._id;
          obj_s.end = element.end;
          obj_s.Booking_ID = element.Booking_ID;
          obj_s.BookingStatus = element.BookingStatus;
          obj_s.Approved_LOA = element.Approved_LOA;
          obj_s.LOA = element.LOA;
    
          var boatnum = element.BoatDetails[0].Boat_Number;
    
          if (typeof boatnum !== "undefined" || boatnum != null){
           
            obj_s.Boat_Number = element.BoatDetails[0].Boat_Number;
            obj_s.Boat_Number_and_Booking_ID = element.BoatDetails[0].Boat_Number +"/"+element.Booking_ID;
          }
          else{
    
            obj_s.Boat_Number = 0;
            obj_s.Boat_Number_and_Booking_ID = 0 +"/"+element.Booking_ID;
            
    
          }
    
          obj_s._id = element._id;
          obj_s.Location_Name = element.BoatDetails[0].Location_Name;
          obj_s.Location_Id = element.BoatDetails[0].Location_Id;
          if(element.OwnerDetails.length !== 0){
    
            obj_s.First_Name = element.OwnerDetails[0].First_Name;
            obj_s.Parking_Ability = element.OwnerDetails[0].Parking_Ability;
            obj_s.OwnerDetails = element.OwnerDetails[0];
    
          } 
    
          
    
           this.Cancels_Second.push(obj_s);
    
    
          }
    
          else if(element.BookingStatus != "Accepted") 
          {
    
            var obj_s = Object();
    
          obj_s.Boat_Image = element.BoatDetails[0].Boat_Image[0];
          obj_s.imgUrl = this.imgUrl + element.BoatDetails[0].Boat_Image[0];
          obj_s.Boat_Name = element.BoatDetails[0].Boat_Name;
          obj_s.start = element.start;
          obj_s.Boat_Id =  element.BoatDetails[0]._id;
          obj_s.end = element.end;
          obj_s.Booking_ID = element.Booking_ID;
          obj_s.BookingStatus = element.BookingStatus;
          obj_s.Approved_LOA = element.Approved_LOA;
          obj_s.LOA = element.LOA;
    
          obj_s.WeekDay_Count = element.WeekDay_Count;
          obj_s.WeekDay_Count_Edit = element.WeekDay_Count_Edit;
          obj_s.WeekDay_Count_Reassign = element.WeekDay_Count_Reassign;
          obj_s.WeekEnd_Count = element.WeekEnd_Count
          obj_s.WeekEnd_Count_Edit = element.WeekEnd_Count_Edit;
          obj_s.WeekEnd_Count_Reassign = element.WeekEnd_Count_Reassign;
    
          
    
          if (typeof element.BoatDetails[0].Boat_Number !== "undefined" || element.BoatDetails[0].Boat_Number != null){
            
            obj_s.Boat_Number = element.BoatDetails[0].Boat_Number;
            obj_s.Boat_Number_and_Booking_ID = element.BoatDetails[0].Boat_Number +"/"+element.Booking_ID;
          }
          else{
            
            obj_s.Boat_Number = 0;
            obj_s.Boat_Number_and_Booking_ID = 0 +"/"+element.Booking_ID;
    
          }
          
          obj_s._id = element._id;
          obj_s.Location_Name = element.BoatDetails[0].Location_Name;
          obj_s.Location_Id = element.BoatDetails[0].Location_Id;
          if(element.OwnerDetails.length !== 0){
    
            obj_s.First_Name = element.OwnerDetails[0].First_Name;
            obj_s.Parking_Ability = element.OwnerDetails[0].Parking_Ability;
            obj_s.OwnerDetails = element.OwnerDetails[0];
    
          } 
    
           this.Cancels_First.push(obj_s);
    
    
          }
    
          else
          {
    
            var obj_s = Object();
    
          obj_s.Boat_Image = element.BoatDetails[0].Boat_Image[0];
          obj_s.imgUrl = this.imgUrl + element.BoatDetails[0].Boat_Image[0];
          obj_s.Boat_Name = element.BoatDetails[0].Boat_Name;
          obj_s.start = element.start;
          obj_s.Boat_Id =  element.BoatDetails[0]._id;
          obj_s.end = element.end;
          obj_s.Booking_ID = element.Booking_ID;
          obj_s.BookingStatus = element.BookingStatus;
          obj_s.Approved_LOA = element.Approved_LOA;
          obj_s.LOA = element.LOA;
    
          
    
          if (typeof element.BoatDetails[0].Boat_Number !== "undefined" || element.BoatDetails[0].Boat_Number != null){
            obj_s.Boat_Number = element.BoatDetails[0].Boat_Number;
            obj_s.Boat_Number_and_Booking_ID = element.BoatDetails[0].Boat_Number +"/"+element.Booking_ID;
            
          }
          else{
            
            obj_s.Boat_Number = 0;
            obj_s.Boat_Number_and_Booking_ID = 0 +"/"+element.Booking_ID;
    
          }
          obj_s._id = element._id;
          obj_s.Location_Name = element.BoatDetails[0].Location_Name;
          obj_s.Location_Id = element.BoatDetails[0].Location_Id;
          if(element.OwnerDetails.length !== 0){
    
            obj_s.First_Name = element.OwnerDetails[0].First_Name;
            obj_s.Parking_Ability = element.OwnerDetails[0].Parking_Ability;
            obj_s.OwnerDetails = element.OwnerDetails[0];
    
          } 
    
           this.Cancels_Thread.push(obj_s);
    
    
          
    
          } 
          
          
    
    
        }     
          
          
          // obj4 = element       
          //     this.Cancels.push(obj4);
          
        } 
      }

    
    
      });
    
    
      //
    
        this.Boat_Name_dropDown = loc.Boat_Name;    
     // var cancellationsearchinfo = [];  
      if(this.public_LocationType_id == null)
      {    
        this.newBooking = this.newBooking.filter(x => x.Boat_Id == loc._id);
        this.todaysBooking = this.todaysBooking.filter(x => x.Boat_Id == loc._id);
        
        this.Cancels_Thread = this.Cancels_Thread.filter(x => x.Boat_Id == loc._id);
        this.Cancels_First = this.Cancels_First.filter(x => x.Boat_Id == loc._id);
        this.Cancels_Second = this.Cancels_Second.filter(x => x.Boat_Id == loc._id);
        
       // this.cancellationInfo = this.cancellationInfo.filter(x => x.BoatDetails[0]._id == loc._id);
      // cancellationsearchinfo = this.cancellationInfo.filter(x => x.BoatDetails[0]._id == loc._id);
        this.Cancels = this.Cancels.filter(x => x.Boat_Id == loc._id);
    
        this.Stand_by_Booking = this.Stand_by_Booking.filter(x => x.Boat_Id == loc._id);
      }
      else
      {
    
        this.newBooking = this.newBooking.filter(x => x.Boat_Id == loc._id && x.Location_Id == this.public_LocationType_id);
        this.todaysBooking = this.todaysBooking.filter(x => x.Boat_Id == loc._id && x.Location_Id == this.public_LocationType_id);
        
        this.Cancels_Thread = this.Cancels_Thread.filter(x => x.Boat_Id == loc._id && x.Location_Id == this.public_LocationType_id);
        this.Cancels_First = this.Cancels_First.filter(x => x.Boat_Id == loc._id && x.Location_Id == this.public_LocationType_id);
        this.Cancels_Second = this.Cancels_Second.filter(x => x.Boat_Id == loc._id && x.Location_Id == this.public_LocationType_id);
        
      //  this.cancellationInfo = this.cancellationInfo.filter(x => x.BoatDetails[0]._id == loc._id && x.BoatDetails[0].Location_Id == this.public_LocationType_id);
      //  cancellationsearchinfo = this.cancellationInfo.filter(x => x.BoatDetails[0]._id == loc._id && x.BoatDetails[0].Location_Id == this.public_LocationType_id);

        this.Cancels = this.Cancels.filter(x => x.Boat_Id == loc._id && x.Location_Id == this.public_LocationType_id);
        this.Stand_by_Booking = this.Stand_by_Booking.filter(x => x.Boat_Id == loc._id && x.Location_Id == this.public_LocationType_id);
    
    
      }
        
        this.New_Booking_Count = this.newBooking.length;
        this.Todays_Booking_Count = this.todaysBooking.length;
       // this.Cancellations_Count = cancellationsearchinfo.length + this.Cancels_Thread.length + this.Cancels_First.length + this.Cancels_Second.length;
        // this.Cancellations_Count = this.cancellationInfo.length + this.Cancels_Thread.length + this.Cancels_First.length + this.Cancels_Second.length;
        this.Cancellations_Count = this.Cancels_Thread.length + this.Cancels_First.length + this.Cancels_Second.length;
        this.Stand_by_Booking_Count = this.Stand_by_Booking.length;
    
       }, err => {
       });


       
      },
      (err) => {}
    );




    
  

  }

  getLoctionTypeId(loc){
    this.Boat_Name_dropDown = "Select Boat";
//this to start............
this.dropdown_Boat_List =  this.dropdown_Boat_List_static.filter(x => x.Location_Id == loc._id);

//........


  this.public_LocationType_id = loc._id;
 // this.cancellationInfo = [];
    this.newBooking = [];
    this.Stand_by_Booking = [];
    this.todaysBooking = [];

    this.Cancels_Thread = [];
    this.Cancels_First = [];
    this.Cancels_Second = [];


    this.http
    .get<any>(`${this.url}/ViewCancelledBookingNew`)
    .subscribe(
      (data_cancellBooking) => {

                  
        //this.cancellationInfo = data_cancellBooking['response'];

       // this.Cancellations_Count = this.cancellationInfo.length;

        this.http.get<any>(`${this.url}/ViewBookingDetailsWithBoatAndOwner`).subscribe(data => {
                  
    
          this.Booking = data['response']
          this.Booking.forEach(element => {
            let upadtedate = new Date(element.Updated_time);
            var d = new Date();
              if(this.selectedDaysforlist == 2){
                d.setDate(d.getDate() - 2);
              }else if(this.selectedDaysforlist == 3){
                d.setDate(d.getDate() - 3);
              }else if(this.selectedDaysforlist == 5){
                d.setDate(d.getDate() - 5);
              }else{
                d.setDate(d.getDate());
              }
            let updatedates = this.getFormattedDate_WithOut_Zero_Time(upadtedate);
            let selectedDays = this.getFormattedDate_WithOut_Zero_Time(d.toString());
      console.log(updatedates);
      console.log(selectedDays);
      if(this.selectedDaysforlist == 24){
           if(selectedDays == updatedates){ 
            var obj_s = Object();
    
            if(element.BoatDetails.length !== 0){
    
            obj_s.Boat_Image = element.BoatDetails[0].Boat_Image[0];
            obj_s.imgUrl = this.imgUrl + element.BoatDetails[0].Boat_Image[0];
            obj_s.Boat_Name = element.BoatDetails[0].Boat_Name;
            obj_s.start = element.start;
            obj_s.Boat_Id =  element.BoatDetails[0]._id;
            obj_s.end = element.end;
            obj_s.Booking_ID = element.Booking_ID;
            obj_s.Is_StandByBooking = element.Is_StandByBooking;
    
            obj_s.Boat_Number_and_Booking_ID = element.BoatDetails[0].Boat_Number +"/"+element.Booking_ID;
    
            obj_s.Location_Name = element.BoatDetails[0].Location_Name;
            obj_s.Location_Id = element.BoatDetails[0].Location_Id;
    
            if(element.OwnerDetails.length !== 0){
    
              obj_s.First_Name = element.OwnerDetails[0].First_Name;
              obj_s.Parking_Ability = element.OwnerDetails[0].Parking_Ability;
              obj_s.OwnerDetails = element.OwnerDetails[0];
    
            } 
            this.newBooking.push(obj_s);
    
            }    
          //   var obj2 = Object();
          //   var obj3 = Object();
          // var date = new Date(element.Current_Time);
          // var upadtedate = new Date(element.Updated_time);
    
          // var dates = date.getDate();
          // var todaysDate = new Date();
    
          // var updatedates = upadtedate.getDate();
          // var todaysDates = todaysDate.getDate();
    
          // var to_date = new Date();
          // var to_date_only = this.getFormattedDate_WithOut_Zero_Time(to_date);// to_date.getDay();
    
          // var start_Date = new Date(element.start);
          // var start_Date_only = this.getFormattedDate_WithOut_Zero_Time(start_Date); //start_Date.getDay();
    
          let to_date = new Date();
          let to_date_only = this.getFormattedDate_WithOut_Zero_Time(to_date);// to_date.getDay();
          let start_Date = new Date(element.start);
          let start_Date_only = this.getFormattedDate_WithOut_Zero_Time(start_Date); //start_Date.getDay();
    
          if(to_date_only  == start_Date_only ){
    
            var obj_s = Object();
      
            if(element.BoatDetails.length !== 0){
      
            obj_s.Boat_Image = element.BoatDetails[0].Boat_Image[0];
            obj_s.imgUrl = this.imgUrl + element.BoatDetails[0].Boat_Image[0];
            obj_s.Boat_Name = element.BoatDetails[0].Boat_Name;
            obj_s.start = element.start;
            obj_s.Boat_Id =  element.BoatDetails[0]._id;
            obj_s.end = element.end;
            obj_s.Booking_ID = element.Booking_ID;
            obj_s.Is_StandByBooking = element.Is_StandByBooking;
    
            obj_s.Boat_Number_and_Booking_ID = element.BoatDetails[0].Boat_Number +"/"+element.Booking_ID;
    
            obj_s.Location_Name = element.BoatDetails[0].Location_Name;
            obj_s.Location_Id = element.BoatDetails[0].Location_Id;
    
            if(element.OwnerDetails.length !== 0){
      
              obj_s.First_Name = element.OwnerDetails[0].First_Name;
              obj_s.Parking_Ability = element.OwnerDetails[0].Parking_Ability;
              obj_s.OwnerDetails = element.OwnerDetails[0];
      
            } 
      
             this.todaysBooking.push(obj_s);
    
            }      
      
           
      
            }
        
    
          } 
        } else {
          if( selectedDays <= updatedates){ 
            var obj_s = Object();
    
            if(element.BoatDetails.length !== 0){
    
            obj_s.Boat_Image = element.BoatDetails[0].Boat_Image[0];
            obj_s.imgUrl = this.imgUrl + element.BoatDetails[0].Boat_Image[0];
            obj_s.Boat_Name = element.BoatDetails[0].Boat_Name;
            obj_s.start = element.start;
            obj_s.Boat_Id =  element.BoatDetails[0]._id;
            obj_s.end = element.end;
            obj_s.Booking_ID = element.Booking_ID;
            obj_s.Is_StandByBooking = element.Is_StandByBooking;
    
            obj_s.Boat_Number_and_Booking_ID = element.BoatDetails[0].Boat_Number +"/"+element.Booking_ID;
    
            obj_s.Location_Name = element.BoatDetails[0].Location_Name;
            obj_s.Location_Id = element.BoatDetails[0].Location_Id;
    
            if(element.OwnerDetails.length !== 0){
    
              obj_s.First_Name = element.OwnerDetails[0].First_Name;
              obj_s.Parking_Ability = element.OwnerDetails[0].Parking_Ability;
              obj_s.OwnerDetails = element.OwnerDetails[0];
    
            } 
            this.newBooking.push(obj_s);
    
            }    
          //   var obj2 = Object();
          //   var obj3 = Object();
          // var date = new Date(element.Current_Time);
          // var upadtedate = new Date(element.Updated_time);
    
          // var dates = date.getDate();
          // var todaysDate = new Date();
    
          // var updatedates = upadtedate.getDate();
          // var todaysDates = todaysDate.getDate();
    
          // var to_date = new Date();
          // var to_date_only = this.getFormattedDate_WithOut_Zero_Time(to_date);// to_date.getDay();
    
          // var start_Date = new Date(element.start);
          // var start_Date_only = this.getFormattedDate_WithOut_Zero_Time(start_Date); //start_Date.getDay();
    
          let to_date = new Date();
          let to_date_only = this.getFormattedDate_WithOut_Zero_Time(to_date);// to_date.getDay();
          let start_Date = new Date(element.start);
          let start_Date_only = this.getFormattedDate_WithOut_Zero_Time(start_Date); //start_Date.getDay();
    
          if(to_date_only  == start_Date_only ){
    
            var obj_s = Object();
      
            if(element.BoatDetails.length !== 0){
      
            obj_s.Boat_Image = element.BoatDetails[0].Boat_Image[0];
            obj_s.imgUrl = this.imgUrl + element.BoatDetails[0].Boat_Image[0];
            obj_s.Boat_Name = element.BoatDetails[0].Boat_Name;
            obj_s.start = element.start;
            obj_s.Boat_Id =  element.BoatDetails[0]._id;
            obj_s.end = element.end;
            obj_s.Booking_ID = element.Booking_ID;
            obj_s.Is_StandByBooking = element.Is_StandByBooking;
    
            obj_s.Boat_Number_and_Booking_ID = element.BoatDetails[0].Boat_Number +"/"+element.Booking_ID;
    
            obj_s.Location_Name = element.BoatDetails[0].Location_Name;
            obj_s.Location_Id = element.BoatDetails[0].Location_Id;
    
            if(element.OwnerDetails.length !== 0){
      
              obj_s.First_Name = element.OwnerDetails[0].First_Name;
              obj_s.Parking_Ability = element.OwnerDetails[0].Parking_Ability;
              obj_s.OwnerDetails = element.OwnerDetails[0];
      
            } 
      
             this.todaysBooking.push(obj_s);
    
            }      
      
           
      
            }
        
    
          } 
          }
          
    
        });
    
    
        //.....
    
         //this is Start..........
         var standByBooking = data['StandbyBooking']
    
         standByBooking.forEach(element => {
    
          var to_date = new Date();
          var to_date_only = this.getFormattedDate_WithOut_Zero_Time(to_date);// to_date.getDay();
    
          var start_Date = new Date(element.Updated_time);
          var start_Date_only = this.getFormattedDate_WithOut_Zero_Time(start_Date); //start_Date.getDay();
    
          if(element.isOrginalBookingCanceled != true)
          {
    
          if(to_date_only == start_Date_only)
          {
                  
              if(element.Is_StandByBooking == true){
          
                var obj_s = Object();
          
                if(element.BoatDetails.length !== 0){
          
                  obj_s._Id = element._id;
                obj_s.Boat_Image = element.BoatDetails[0].Boat_Image[0];
                obj_s.imgUrl = this.imgUrl + element.BoatDetails[0].Boat_Image[0];
                obj_s.Boat_Name = element.BoatDetails[0].Boat_Name;
                obj_s.start = element.start;
                obj_s.Boat_Id =  element.BoatDetails[0]._id;
                obj_s.end = element.end;
                obj_s.Booking_ID = element.Booking_ID;
    
                obj_s.Boat_Number_and_Booking_ID = element.BoatDetails[0].Boat_Number +"/"+element.Booking_ID;
          
                obj_s.Boat_Number = element.BoatDetails[0].Boat_Number;
                obj_s._id = element._id;
                obj_s.Location_Name = element.BoatDetails[0].Location_Name;
                obj_s.Location_Id = element.BoatDetails[0].Location_Id;
          
                if(element.OwnerDetails.length !== 0){
          
                  obj_s.First_Name = element.OwnerDetails[0].First_Name;
                  obj_s.Parking_Ability = element.OwnerDetails[0].Parking_Ability;
                  obj_s.OwnerDetails = element.OwnerDetails[0];
          
                } 
          
                this.Stand_by_Booking.push(obj_s);
          
          
                }      
          
          
              }
          }
    
        }
     
         
     
         });
    
          
      this.Cancellations = this.cancellation_responceRemove_to_Partialcancell(data['Cancelledresponse'],data['partialcancel']);
      this.Cancels = [];
      this.Cancellations.forEach(element => {
        // var obj4 = Object();
        // var date = new Date(element.Current_Time);
        // var dates = date.getDate()
        // var todaysDate = new Date();
        // var todaysDates = todaysDate.getDate()
        // if(dates  == todaysDates )
        // {
          let upadtedate = new Date(element.Updated_time);
          var d1 = new Date();
            if(this.selectedDaysforlist == 2){
              d1.setDate(d1.getDate() - 2);
            }else if(this.selectedDaysforlist == 3){
              d1.setDate(d1.getDate() - 3);
            }else if(this.selectedDaysforlist == 5){
              d1.setDate(d1.getDate() - 5);
            }else{
              d1.setDate(d1.getDate());
            }
          let updatedates = this.getFormattedDate_WithOut_Zero_Time(upadtedate);
          let selectedDays = this.getFormattedDate_WithOut_Zero_Time(d1.toString())
       if(this.selectedDaysforlist == 24){
          if( selectedDays == updatedates)
        {
          var obj_s = Object();
      
          if(element.BoatDetails.length !== 0){
    
          obj_s.Boat_Image = element.BoatDetails[0].Boat_Image[0];
          obj_s.imgUrl = this.imgUrl + element.BoatDetails[0].Boat_Image[0];
          obj_s.Boat_Name = element.BoatDetails[0].Boat_Name;
          obj_s.start = element.start;
          obj_s.Boat_Id =  element.BoatDetails[0]._id;
          obj_s.end = element.end;
          obj_s.Booking_ID = element.Booking_ID;
    
          obj_s.Location_Name = element.BoatDetails[0].Location_Name;
          obj_s.Location_Id = element.BoatDetails[0].Location_Id;
          if(element.OwnerDetails.length !== 0){
    
            obj_s.First_Name = element.OwnerDetails[0].First_Name;
            obj_s.Parking_Ability = element.OwnerDetails[0].Parking_Ability;
            obj_s.OwnerDetails = element.OwnerDetails[0];
    
          } 
    
           this.Cancels.push(obj_s);
    
    
          }     
               
        }
      } else {
        if( selectedDays <= updatedates)
        {
          var obj_s = Object();
      
          if(element.BoatDetails.length !== 0){
    
          obj_s.Boat_Image = element.BoatDetails[0].Boat_Image[0];
          obj_s.imgUrl = this.imgUrl + element.BoatDetails[0].Boat_Image[0];
          obj_s.Boat_Name = element.BoatDetails[0].Boat_Name;
          obj_s.start = element.start;
          obj_s.Boat_Id =  element.BoatDetails[0]._id;
          obj_s.end = element.end;
          obj_s.Booking_ID = element.Booking_ID;
    
          obj_s.Location_Name = element.BoatDetails[0].Location_Name;
          obj_s.Location_Id = element.BoatDetails[0].Location_Id;
          if(element.OwnerDetails.length !== 0){
    
            obj_s.First_Name = element.OwnerDetails[0].First_Name;
            obj_s.Parking_Ability = element.OwnerDetails[0].Parking_Ability;
            obj_s.OwnerDetails = element.OwnerDetails[0];
    
          } 
    
           this.Cancels.push(obj_s);
    
    
          }     
               
        }
      }
    
    
      });
    
    
        //Cancell ......02
    
        this.Cancellations.forEach(element => {
          let upadtedate = new Date(element.Updated_time);
          var d1 = new Date();
            if(this.selectedDaysforlist == 2){
              d1.setDate(d1.getDate() - 2);
            }else if(this.selectedDaysforlist == 3){
              d1.setDate(d1.getDate() - 3);
            }else if(this.selectedDaysforlist == 5){
              d1.setDate(d1.getDate() - 5);
            }else{
              d1.setDate(d1.getDate());
            }
          let updatedates = this.getFormattedDate_WithOut_Zero_Time(upadtedate);
          let selectedDays = this.getFormattedDate_WithOut_Zero_Time(d1.toString())
       if(this.selectedDaysforlist == 24){
          if(selectedDays == updatedates)
        {
            if(element.BoatDetails.length !== 0){
            
            if(element.BookingStatus == "Accepted"){
      
              var obj_s = Object();
            obj_s.Boat_Image = element.BoatDetails[0].Boat_Image[0];
            obj_s.imgUrl = this.imgUrl + element.BoatDetails[0].Boat_Image[0];
            obj_s.Boat_Name = element.BoatDetails[0].Boat_Name;
            obj_s.start = element.start;
            obj_s.Boat_Id =  element.BoatDetails[0]._id;
            obj_s.end = element.end;
            obj_s.Booking_ID = element.Booking_ID;
            obj_s.BookingStatus = element.BookingStatus;
            obj_s.Approved_LOA = element.Approved_LOA;
            obj_s.LOA = element.LOA;
    
            obj_s.WeekDay_Count = element.WeekDay_Count;
          obj_s.WeekDay_Count_Edit = element.WeekDay_Count_Edit;
          obj_s.WeekDay_Count_Reassign = element.WeekDay_Count_Reassign;
          obj_s.WeekEnd_Count = element.WeekEnd_Count
          obj_s.WeekEnd_Count_Edit = element.WeekEnd_Count_Edit;
          obj_s.WeekEnd_Count_Reassign = element.WeekEnd_Count_Reassign;
      
            var boatnum = element.BoatDetails[0].Boat_Number;
      
            if (typeof boatnum !== "undefined" || boatnum != null){
             
              obj_s.Boat_Number = element.BoatDetails[0].Boat_Number;
              obj_s.Boat_Number_and_Booking_ID = element.BoatDetails[0].Boat_Number +"/"+element.Booking_ID;
            }
            else{
      
              obj_s.Boat_Number = 0;
              obj_s.Boat_Number_and_Booking_ID = 0 +"/"+element.Booking_ID;
              
      
            }
      
            obj_s._id = element._id;
            obj_s.Location_Name = element.BoatDetails[0].Location_Name;
            obj_s.Location_Id = element.BoatDetails[0].Location_Id;
            if(element.OwnerDetails.length !== 0){
      
              obj_s.First_Name = element.OwnerDetails[0].First_Name;
              obj_s.Parking_Ability = element.OwnerDetails[0].Parking_Ability;
              obj_s.OwnerDetails = element.OwnerDetails[0];
      
            } 
             this.Cancels_Second.push(obj_s);
      
      
            }
      
            else if(element.BookingStatus != "Accepted") 
            {
      
              var obj_s = Object();
      
            obj_s.Boat_Image = element.BoatDetails[0].Boat_Image[0];
            obj_s.imgUrl = this.imgUrl + element.BoatDetails[0].Boat_Image[0];
            obj_s.Boat_Name = element.BoatDetails[0].Boat_Name;
            obj_s.start = element.start;
            obj_s.Boat_Id =  element.BoatDetails[0]._id;
            obj_s.end = element.end;
            obj_s.Booking_ID = element.Booking_ID;
            obj_s.BookingStatus = element.BookingStatus;
            obj_s.Approved_LOA = element.Approved_LOA;
            obj_s.LOA = element.LOA;
    
            obj_s.WeekDay_Count = element.WeekDay_Count;
          obj_s.WeekDay_Count_Edit = element.WeekDay_Count_Edit;
          obj_s.WeekDay_Count_Reassign = element.WeekDay_Count_Reassign;
          obj_s.WeekEnd_Count = element.WeekEnd_Count
          obj_s.WeekEnd_Count_Edit = element.WeekEnd_Count_Edit;
          obj_s.WeekEnd_Count_Reassign = element.WeekEnd_Count_Reassign;
    
      
            if (typeof element.BoatDetails[0].Boat_Number !== "undefined" || element.BoatDetails[0].Boat_Number != null){
              
              obj_s.Boat_Number = element.BoatDetails[0].Boat_Number;
              obj_s.Boat_Number_and_Booking_ID = element.BoatDetails[0].Boat_Number +"/"+element.Booking_ID;
            }
            else{
              
              obj_s.Boat_Number = 0;
              obj_s.Boat_Number_and_Booking_ID = 0 +"/"+element.Booking_ID;
      
            }
            
            obj_s._id = element._id;
            obj_s.Location_Name = element.BoatDetails[0].Location_Name;
            obj_s.Location_Id = element.BoatDetails[0].Location_Id;
            if(element.OwnerDetails.length !== 0){
      
              obj_s.First_Name = element.OwnerDetails[0].First_Name;
              obj_s.Parking_Ability = element.OwnerDetails[0].Parking_Ability;
              obj_s.OwnerDetails = element.OwnerDetails[0];
      
            } 
      
             this.Cancels_First.push(obj_s);
      
      
            }
      
            else
            {
      
              var obj_s = Object();
      
            obj_s.Boat_Image = element.BoatDetails[0].Boat_Image[0];
            obj_s.imgUrl = this.imgUrl + element.BoatDetails[0].Boat_Image[0];
            obj_s.Boat_Name = element.BoatDetails[0].Boat_Name;
            obj_s.start = element.start;
            obj_s.Boat_Id =  element.BoatDetails[0]._id;
            obj_s.end = element.end;
            obj_s.Booking_ID = element.Booking_ID;
            obj_s.BookingStatus = element.BookingStatus;
            obj_s.Approved_LOA = element.Approved_LOA;
            obj_s.LOA = element.LOA;
      
            if (typeof element.BoatDetails[0].Boat_Number !== "undefined" || element.BoatDetails[0].Boat_Number != null){
              obj_s.Boat_Number = element.BoatDetails[0].Boat_Number;
              obj_s.Boat_Number_and_Booking_ID = element.BoatDetails[0].Boat_Number +"/"+element.Booking_ID;
              
            }
            else{
              
              obj_s.Boat_Number = 0;
              obj_s.Boat_Number_and_Booking_ID = 0 +"/"+element.Booking_ID;
      
            }
            obj_s._id = element._id;
            obj_s.Location_Name = element.BoatDetails[0].Location_Name;
            obj_s.Location_Id = element.BoatDetails[0].Location_Id;
            if(element.OwnerDetails.length !== 0){
      
              obj_s.First_Name = element.OwnerDetails[0].First_Name;
              obj_s.Parking_Ability = element.OwnerDetails[0].Parking_Ability;
              obj_s.OwnerDetails = element.OwnerDetails[0];
      
            } 
      
             this.Cancels_Thread.push(obj_s);
      
            } 
            
            
      
          }     
            
           
          } 
        } else {
          if(selectedDays <= updatedates)
          {
                  
              if(element.BoatDetails.length !== 0){
        
                
              
              if(element.BookingStatus == "Accepted"){
        
                var obj_s = Object();
                
        
              obj_s.Boat_Image = element.BoatDetails[0].Boat_Image[0];
              obj_s.imgUrl = this.imgUrl + element.BoatDetails[0].Boat_Image[0];
              obj_s.Boat_Name = element.BoatDetails[0].Boat_Name;
              obj_s.start = element.start;
              obj_s.Boat_Id =  element.BoatDetails[0]._id;
              obj_s.end = element.end;
              obj_s.Booking_ID = element.Booking_ID;
              obj_s.BookingStatus = element.BookingStatus;
              obj_s.Approved_LOA = element.Approved_LOA;
              obj_s.LOA = element.LOA;
      
              obj_s.WeekDay_Count = element.WeekDay_Count;
            obj_s.WeekDay_Count_Edit = element.WeekDay_Count_Edit;
            obj_s.WeekDay_Count_Reassign = element.WeekDay_Count_Reassign;
            obj_s.WeekEnd_Count = element.WeekEnd_Count
            obj_s.WeekEnd_Count_Edit = element.WeekEnd_Count_Edit;
            obj_s.WeekEnd_Count_Reassign = element.WeekEnd_Count_Reassign;
        
              var boatnum = element.BoatDetails[0].Boat_Number;
        
              if (typeof boatnum !== "undefined" || boatnum != null){
               
                obj_s.Boat_Number = element.BoatDetails[0].Boat_Number;
                obj_s.Boat_Number_and_Booking_ID = element.BoatDetails[0].Boat_Number +"/"+element.Booking_ID;
              }
              else{
        
                obj_s.Boat_Number = 0;
                obj_s.Boat_Number_and_Booking_ID = 0 +"/"+element.Booking_ID;
                
        
              }
        
              obj_s._id = element._id;
              obj_s.Location_Name = element.BoatDetails[0].Location_Name;
              obj_s.Location_Id = element.BoatDetails[0].Location_Id;
              if(element.OwnerDetails.length !== 0){
        
                obj_s.First_Name = element.OwnerDetails[0].First_Name;
                obj_s.Parking_Ability = element.OwnerDetails[0].Parking_Ability;
                obj_s.OwnerDetails = element.OwnerDetails[0];
        
              } 
        
              
        
               this.Cancels_Second.push(obj_s);
        
        
              }
        
              else if(element.BookingStatus != "Accepted") 
              {
        
                var obj_s = Object();
        
              obj_s.Boat_Image = element.BoatDetails[0].Boat_Image[0];
              obj_s.imgUrl = this.imgUrl + element.BoatDetails[0].Boat_Image[0];
              obj_s.Boat_Name = element.BoatDetails[0].Boat_Name;
              obj_s.start = element.start;
              obj_s.Boat_Id =  element.BoatDetails[0]._id;
              obj_s.end = element.end;
              obj_s.Booking_ID = element.Booking_ID;
              obj_s.BookingStatus = element.BookingStatus;
              obj_s.Approved_LOA = element.Approved_LOA;
              obj_s.LOA = element.LOA;
      
              obj_s.WeekDay_Count = element.WeekDay_Count;
            obj_s.WeekDay_Count_Edit = element.WeekDay_Count_Edit;
            obj_s.WeekDay_Count_Reassign = element.WeekDay_Count_Reassign;
            obj_s.WeekEnd_Count = element.WeekEnd_Count
            obj_s.WeekEnd_Count_Edit = element.WeekEnd_Count_Edit;
            obj_s.WeekEnd_Count_Reassign = element.WeekEnd_Count_Reassign;
      
        
              if (typeof element.BoatDetails[0].Boat_Number !== "undefined" || element.BoatDetails[0].Boat_Number != null){
                
                obj_s.Boat_Number = element.BoatDetails[0].Boat_Number;
                obj_s.Boat_Number_and_Booking_ID = element.BoatDetails[0].Boat_Number +"/"+element.Booking_ID;
              }
              else{
                
                obj_s.Boat_Number = 0;
                obj_s.Boat_Number_and_Booking_ID = 0 +"/"+element.Booking_ID;
        
              }
              
              obj_s._id = element._id;
              obj_s.Location_Name = element.BoatDetails[0].Location_Name;
              obj_s.Location_Id = element.BoatDetails[0].Location_Id;
              if(element.OwnerDetails.length !== 0){
        
                obj_s.First_Name = element.OwnerDetails[0].First_Name;
                obj_s.Parking_Ability = element.OwnerDetails[0].Parking_Ability;
                obj_s.OwnerDetails = element.OwnerDetails[0];
        
              } 
        
               this.Cancels_First.push(obj_s);
        
        
              }
        
              else
              {
        
                var obj_s = Object();
        
              obj_s.Boat_Image = element.BoatDetails[0].Boat_Image[0];
              obj_s.imgUrl = this.imgUrl + element.BoatDetails[0].Boat_Image[0];
              obj_s.Boat_Name = element.BoatDetails[0].Boat_Name;
              obj_s.start = element.start;
              obj_s.Boat_Id =  element.BoatDetails[0]._id;
              obj_s.end = element.end;
              obj_s.Booking_ID = element.Booking_ID;
              obj_s.BookingStatus = element.BookingStatus;
              obj_s.Approved_LOA = element.Approved_LOA;
              obj_s.LOA = element.LOA;
        
              if (typeof element.BoatDetails[0].Boat_Number !== "undefined" || element.BoatDetails[0].Boat_Number != null){
                obj_s.Boat_Number = element.BoatDetails[0].Boat_Number;
                obj_s.Boat_Number_and_Booking_ID = element.BoatDetails[0].Boat_Number +"/"+element.Booking_ID;
                
              }
              else{
                
                obj_s.Boat_Number = 0;
                obj_s.Boat_Number_and_Booking_ID = 0 +"/"+element.Booking_ID;
        
              }
              obj_s._id = element._id;
              obj_s.Location_Name = element.BoatDetails[0].Location_Name;
              obj_s.Location_Id = element.BoatDetails[0].Location_Id;
              if(element.OwnerDetails.length !== 0){
        
                obj_s.First_Name = element.OwnerDetails[0].First_Name;
                obj_s.Parking_Ability = element.OwnerDetails[0].Parking_Ability;
                obj_s.OwnerDetails = element.OwnerDetails[0];
        
              } 
        
               this.Cancels_Thread.push(obj_s);
        
        
              
        
              } 
              
              
        
        
            }     
              
              
              // obj4 = element       
              //     this.Cancels.push(obj4);
              
            } 
        }
      
      
        });
      
    
    
        //.......
    
         
        this.Location_Name_dropDown = loc.Boat_Location;   
       // var cancellationsearchinfo = []; 
      if(this.public_baotType_Single_id == null){
    
        this.newBooking = this.newBooking.filter(x => x.Location_Id == loc._id);
        this.todaysBooking = this.todaysBooking.filter(x => x.Location_Id == loc._id);
    
        this.Cancels_Thread = this.Cancels_Thread.filter(x => x.Location_Id == loc._id);
        this.Cancels_First = this.Cancels_First.filter(x => x.Location_Id == loc._id);
        this.Cancels_Second = this.Cancels_Second.filter(x => x.Location_Id == loc._id);
        
      //  this.cancellationInfo = this.cancellationInfo.filter(x => x.BoatDetails[0].Location_Id == loc._id);
      // cancellationsearchinfo = this.cancellationInfo.filter(x => x.BoatDetails[0].Location_Id == loc._id);
        this.Cancels = this.Cancels.filter(x => x.Location_Id == loc._id);
        this.Stand_by_Booking = this.Stand_by_Booking.filter(x => x.Location_Id == loc._id);
    
      }
      else
      {
    
        this.newBooking = this.newBooking.filter(x => x.Location_Id == loc._id && x.Boat_Id == this.public_baotType_Single_id);
        this.todaysBooking = this.todaysBooking.filter(x => x.Location_Id == loc._id && x.Boat_Id == this.public_baotType_Single_id);
       
        this.Cancels_Thread = this.Cancels_Thread.filter(x => x.Location_Id == loc._id && x.Boat_Id == this.public_baotType_Single_id);
        this.Cancels_First = this.Cancels_First.filter(x => x.Location_Id == loc._id && x.Boat_Id == this.public_baotType_Single_id);
        this.Cancels_Second = this.Cancels_Second.filter(x => x.Location_Id == loc._id && x.Boat_Id == this.public_baotType_Single_id);
         
       
      //  this.cancellationInfo = this.cancellationInfo.filter(x => x.BoatDetails[0].Location_Id == loc._id && x.BoatDetails[0]._id == this.public_baotType_Single_id);
      //  cancellationsearchinfo = this.cancellationInfo.filter(x => x.BoatDetails[0].Location_Id == loc._id && x.BoatDetails[0]._id == this.public_baotType_Single_id);

        this.Cancels = this.Cancels.filter(x => x.Location_Id == loc._id && x.Boat_Id == this.public_baotType_Single_id);
        this.Stand_by_Booking = this.Stand_by_Booking.filter(x => x.Location_Id == loc._id && x.Boat_Id == this.public_baotType_Single_id);
    
    
      }   
    
        this.New_Booking_Count = this.newBooking.length;
        this.Todays_Booking_Count = this.todaysBooking.length;
        this.Cancellations_Count =  this.Cancels_Thread.length + this.Cancels_First.length + this.Cancels_Second.length;
      //  this.Cancellations_Count = this.cancellationInfo.length + this.Cancels_Thread.length + this.Cancels_First.length + this.Cancels_Second.length;
     // this.Cancellations_Count = cancellationsearchinfo.length + this.Cancels_Thread.length + this.Cancels_First.length + this.Cancels_Second.length;
      this.Stand_by_Booking_Count = this.Stand_by_Booking.length;
    
    
    
       }, err => {
       });
        
      },
      (err) => {}
    );

    
   
 
 
  }

  Stand_by_Booking_Accept(datas){    

    
    var obj = Object();
    obj._id = datas._Id;
    obj.action_todo = "Accept";
    obj.timeZone = environment.timeZone;// jjjj //Intl.DateTimeFormat().resolvedOptions().timeZone;       

    this.http.post<any>(`${this.url}/StandByBooking_AcceptReject`,  obj  ).subscribe(data => {
   
      if(data.status == true)
      {
        
        this.CommenMessages =  data.message;
        $('#btn-CommenMessage-save-disp-btns').trigger('click');

        
            
        
      }
      else if(data.status == false)
      {
        
        this.CommenMessages = data.message;
        $('#btn-CommenMessage-disp-btns').trigger('click');
        


      }
        }, err => {

          this.CommenMessages = err.message;
          $('#btn-CommenMessage-disp-btns').trigger('click');

         
        })


  }

 
  Stand_by_Booking_Reject(datas){
    
    var obj = Object();
    obj._id = datas._Id;
    obj.action_todo = "Reject"; 
    obj.timeZone = environment.timeZone;//Intl.DateTimeFormat().resolvedOptions().timeZone;      

    this.http.post<any>(`${this.url}/StandByBooking_AcceptReject`,  obj  ).subscribe(data => {
    
      if(data.status == true)
      {
               
        this.CommenMessages ="This standby booking has been rejected.";
        $('#btn-CommenMessage-save-disp-btns').trigger('click');
        
      }
      else if(data.status == false)
      {
        
        this.CommenMessages ="No responce";
        $('#btn-CommenMessage-disp-btns').trigger('click');

      }
        }, err => {

         
          this.CommenMessages = err.message;
        $('#btn-CommenMessage-disp-btns').trigger('click');
         
        })




  }

  pageRefresh(){
    location.reload();
  }
  selectedTab(tab){
    if(tab =='overview'){
          this.activeTab = 'Overview';
        }else {
          this.activeTab = 'showUpdate';
        }
        //this.activeTab=$('.nav-tabs .active').text();
        console.log('active tabgh'+this.activeTab);
    
  }
   Angular_string_to_Date_Convert(dateString){   

    var dateArray = dateString.split("/");
    var dateObj = new Date(`${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`);
  
    return dateObj;

  }
  changeDays(e){
     console.log(e.target.value); 
     this.Location_Name_dropDown = "Select Location";
     this.Boat_Name_dropDown = "Select Boat";
     this.selectedDaysforlist = e.target.value;
     this.todaysBooking = [];
     this.newBooking = [];
     this.cancellationInfo= this.cancellationInfoForupdates;
     this.Booking.forEach(element => {
      let upadtedate = new Date(element.Updated_time);
      var d = new Date();
        if(e.target.value == 2){
          d.setDate(d.getDate() - 2);
        }else if(e.target.value == 3){
          d.setDate(d.getDate() - 3);
        }else if(e.target.value == 5){
          d.setDate(d.getDate() - 5);
        }else{
          d.setDate(d.getDate());
        }
      let updatedates = this.getFormattedDate_WithOut_Zero_Time(upadtedate);
      let selectedDays = this.getFormattedDate_WithOut_Zero_Time(d.toString());
console.log(updatedates);
console.log(selectedDays);
if(e.target.value == 24){
     if( selectedDays == updatedates){      
      let obj_s = Object();

      if(element.BoatDetails.length !== 0){

      obj_s.Boat_Image = element.BoatDetails[0].Boat_Image[0];
      obj_s.imgUrl = this.imgUrl + element.BoatDetails[0].Boat_Image[0];
      obj_s.Boat_Name = element.BoatDetails[0].Boat_Name;
      obj_s.start = element.start;
      obj_s.Boat_Id =  element.BoatDetails[0]._id;
      obj_s.end = element.end;
      obj_s.Booking_ID = element.Booking_ID;
      obj_s.Is_StandByBooking = element.Is_StandByBooking;
      obj_s.Boat_Number_and_Booking_ID = element.BoatDetails[0].Boat_Number +"/"+element.Booking_ID;

      obj_s.Boat_Number = element.BoatDetails[0].Boat_Number;
      obj_s._id = element._id;
      obj_s.Location_Name = element.BoatDetails[0].Location_Name;
      obj_s.Location_Id = element.BoatDetails[0].Location_Id;

      if(element.OwnerDetails.length !== 0){
        obj_s.First_Name = element.OwnerDetails[0].First_Name;
        obj_s.Parking_Ability = element.OwnerDetails[0].Parking_Ability;
        obj_s.OwnerDetails = element.OwnerDetails[0];

      } 
      this.newBooking.push(obj_s);
      }  

      let to_date = new Date();
      let to_date_only = this.getFormattedDate_WithOut_Zero_Time(to_date);// to_date.getDay();
      let start_Date = new Date(element.start);
      let start_Date_only = this.getFormattedDate_WithOut_Zero_Time(start_Date); //start_Date.getDay();
      if(to_date_only  == start_Date_only ){
        let obj_stoday = Object();
        if(element.BoatDetails.length !== 0){
  
          obj_stoday.Boat_Image = element.BoatDetails[0].Boat_Image[0];
          obj_stoday.imgUrl = this.imgUrl + element.BoatDetails[0].Boat_Image[0];
          obj_stoday.Boat_Name = element.BoatDetails[0].Boat_Name;
          obj_stoday.Boat_Number = element.BoatDetails[0].Boat_Number;
        obj_stoday._id = element._id;
  
        obj_stoday.Boat_Number_and_Booking_ID = element.BoatDetails[0].Boat_Number +"/"+element.Booking_ID;
  
        obj_stoday.start = element.start;
        obj_stoday.Boat_Id =  element.BoatDetails[0]._id;
        obj_stoday.end = element.end;
        obj_stoday.Booking_ID = element.Booking_ID;
        obj_stoday.Is_StandByBooking = element.Is_StandByBooking;
  
        obj_stoday.Location_Name = element.BoatDetails[0].Location_Name;
        obj_stoday.Location_Id = element.BoatDetails[0].Location_Id;
  
        if(element.OwnerDetails.length !== 0){
  
          obj_stoday.First_Name = element.OwnerDetails[0].First_Name;
          obj_stoday.Parking_Ability = element.OwnerDetails[0].Parking_Ability;
          obj_stoday.OwnerDetails = element.OwnerDetails[0];
  
        } 
  
        this.todaysBooking.push(obj_stoday);
        }      
  
            }
      
    }
    
} else{
  if( selectedDays <= updatedates){      
    let obj_s = Object();

    if(element.BoatDetails.length !== 0){

    obj_s.Boat_Image = element.BoatDetails[0].Boat_Image[0];
    obj_s.imgUrl = this.imgUrl + element.BoatDetails[0].Boat_Image[0];
    obj_s.Boat_Name = element.BoatDetails[0].Boat_Name;
    obj_s.start = element.start;
    obj_s.Boat_Id =  element.BoatDetails[0]._id;
    obj_s.end = element.end;
    obj_s.Booking_ID = element.Booking_ID;
    obj_s.Is_StandByBooking = element.Is_StandByBooking;
    obj_s.Boat_Number_and_Booking_ID = element.BoatDetails[0].Boat_Number +"/"+element.Booking_ID;

    obj_s.Boat_Number = element.BoatDetails[0].Boat_Number;
    obj_s._id = element._id;
    obj_s.Location_Name = element.BoatDetails[0].Location_Name;
    obj_s.Location_Id = element.BoatDetails[0].Location_Id;

    if(element.OwnerDetails.length !== 0){
      obj_s.First_Name = element.OwnerDetails[0].First_Name;
      obj_s.Parking_Ability = element.OwnerDetails[0].Parking_Ability;
      obj_s.OwnerDetails = element.OwnerDetails[0];

    } 
    this.newBooking.push(obj_s);
    }  

    let to_date = new Date();
    let to_date_only = this.getFormattedDate_WithOut_Zero_Time(to_date);// to_date.getDay();
    let start_Date = new Date(element.start);
    let start_Date_only = this.getFormattedDate_WithOut_Zero_Time(start_Date); //start_Date.getDay();
    if(to_date_only  == start_Date_only ){
      let obj_stoday = Object();
      if(element.BoatDetails.length !== 0){

        obj_stoday.Boat_Image = element.BoatDetails[0].Boat_Image[0];
        obj_stoday.imgUrl = this.imgUrl + element.BoatDetails[0].Boat_Image[0];
        obj_stoday.Boat_Name = element.BoatDetails[0].Boat_Name;
        obj_stoday.Boat_Number = element.BoatDetails[0].Boat_Number;
      obj_stoday._id = element._id;

      obj_stoday.Boat_Number_and_Booking_ID = element.BoatDetails[0].Boat_Number +"/"+element.Booking_ID;

      obj_stoday.start = element.start;
      obj_stoday.Boat_Id =  element.BoatDetails[0]._id;
      obj_stoday.end = element.end;
      obj_stoday.Booking_ID = element.Booking_ID;
      obj_stoday.Is_StandByBooking = element.Is_StandByBooking;

      obj_stoday.Location_Name = element.BoatDetails[0].Location_Name;
      obj_stoday.Location_Id = element.BoatDetails[0].Location_Id;

      if(element.OwnerDetails.length !== 0){

        obj_stoday.First_Name = element.OwnerDetails[0].First_Name;
        obj_stoday.Parking_Ability = element.OwnerDetails[0].Parking_Ability;
        obj_stoday.OwnerDetails = element.OwnerDetails[0];

      } 

      this.todaysBooking.push(obj_stoday);
      }      

          }
    
  }
}
        
  })
  this.Cancels_Thread = [];
  this.Cancels_Second  = [];
  this.Cancels_First  = [];
  this.Cancellations.forEach(element => {
    let upadtedate = new Date(element.Updated_time);
      var d1 = new Date();
        if(e.target.value == 2){
          d1.setDate(d1.getDate() - 2);
        }else if(e.target.value == 3){
          d1.setDate(d1.getDate() - 3);
        }else if(e.target.value == 5){
          d1.setDate(d1.getDate() - 5);
        }else{
          d1.setDate(d1.getDate());
        }
      let updatedates = this.getFormattedDate_WithOut_Zero_Time(upadtedate);
      let selectedDays = this.getFormattedDate_WithOut_Zero_Time(d1.toString())
      if(e.target.value == 24){
      if(selectedDays == updatedates)
    {
          
      if(element.BoatDetails.length !== 0){

      
      if(element.BookingStatus == "Accepted"){

        var obj_s = Object();
        

      obj_s.Boat_Image = element.BoatDetails[0].Boat_Image[0];
      obj_s.imgUrl = this.imgUrl + element.BoatDetails[0].Boat_Image[0];
      obj_s.Boat_Name = element.BoatDetails[0].Boat_Name;
      obj_s.start = element.start;
      obj_s.Boat_Id =  element.BoatDetails[0]._id;
      obj_s.end = element.end;
      obj_s.Booking_ID = element.Booking_ID;
      obj_s.BookingStatus = element.BookingStatus;
      obj_s.Approved_LOA = element.Approved_LOA;
      obj_s.LOA = element.LOA;


      var boatnum = element.BoatDetails[0].Boat_Number;

      if (typeof boatnum !== "undefined" || boatnum != null){
       
        obj_s.Boat_Number = element.BoatDetails[0].Boat_Number;
        obj_s.Boat_Number_and_Booking_ID = element.BoatDetails[0].Boat_Number +"/"+element.Booking_ID;
      }
      else{

        obj_s.Boat_Number = 0;
        obj_s.Boat_Number_and_Booking_ID = 0 +"/"+element.Booking_ID;
        

      }

      obj_s._id = element._id;
      obj_s.Location_Name = element.BoatDetails[0].Location_Name;
      obj_s.Location_Id = element.BoatDetails[0].Location_Id;
      if(element.OwnerDetails.length !== 0){

        obj_s.First_Name = element.OwnerDetails[0].First_Name;
        obj_s.Parking_Ability = element.OwnerDetails[0].Parking_Ability;
        obj_s.OwnerDetails = element.OwnerDetails[0];

      } 

      

       this.Cancels_Second.push(obj_s);


      }

      else if(element.BookingStatus != "Accepted") 
      {

        var obj_s = Object();

      obj_s.Boat_Image = element.BoatDetails[0].Boat_Image[0];
      obj_s.imgUrl = this.imgUrl + element.BoatDetails[0].Boat_Image[0];
      obj_s.Boat_Name = element.BoatDetails[0].Boat_Name;
      obj_s.start = element.start;
      obj_s.Boat_Id =  element.BoatDetails[0]._id;
      obj_s.end = element.end;
      obj_s.Booking_ID = element.Booking_ID;
      obj_s.BookingStatus = element.BookingStatus;
      obj_s.Approved_LOA = element.Approved_LOA;
      obj_s.LOA = element.LOA;

      obj_s.WeekDay_Count = element.WeekDay_Count;
    obj_s.WeekDay_Count_Edit = element.WeekDay_Count_Edit;
    obj_s.WeekDay_Count_Reassign = element.WeekDay_Count_Reassign;
    obj_s.WeekEnd_Count = element.WeekEnd_Count
    obj_s.WeekEnd_Count_Edit = element.WeekEnd_Count_Edit;
    obj_s.WeekEnd_Count_Reassign = element.WeekEnd_Count_Reassign;
      

      if (typeof element.BoatDetails[0].Boat_Number !== "undefined" || element.BoatDetails[0].Boat_Number != null){
        
        obj_s.Boat_Number = element.BoatDetails[0].Boat_Number;
        obj_s.Boat_Number_and_Booking_ID = element.BoatDetails[0].Boat_Number +"/"+element.Booking_ID;

      }
      else{
        
        obj_s.Boat_Number = 0;
        obj_s.Boat_Number_and_Booking_ID = 0 +"/"+element.Booking_ID;

      }
      
      obj_s._id = element._id;
      obj_s.Location_Name = element.BoatDetails[0].Location_Name;
      obj_s.Location_Id = element.BoatDetails[0].Location_Id;
      if(element.OwnerDetails.length !== 0){

        obj_s.First_Name = element.OwnerDetails[0].First_Name;
        obj_s.Parking_Ability = element.OwnerDetails[0].Parking_Ability;
        obj_s.OwnerDetails = element.OwnerDetails[0];

      } 

       this.Cancels_First.push(obj_s);


      }

      else
      {

        var obj_s1 = Object();

        obj_s1.Boat_Image = element.BoatDetails[0].Boat_Image[0];
        obj_s1.imgUrl = this.imgUrl + element.BoatDetails[0].Boat_Image[0];
        obj_s1.Boat_Name = element.BoatDetails[0].Boat_Name;
        obj_s1.start = element.start;
        obj_s1.Boat_Id =  element.BoatDetails[0]._id;
        obj_s1.end = element.end;
        obj_s1.Booking_ID = element.Booking_ID;
        obj_s1.BookingStatus = element.BookingStatus;
        obj_s1.Approved_LOA = element.Approved_LOA;
        obj_s1.LOA = element.LOA;

      if (typeof element.BoatDetails[0].Boat_Number !== "undefined" || element.BoatDetails[0].Boat_Number != null){
        obj_s1.Boat_Number = element.BoatDetails[0].Boat_Number;
        obj_s1.Boat_Number_and_Booking_ID = element.BoatDetails[0].Boat_Number +"/"+element.Booking_ID;
      }
      else{
        
        obj_s1.Boat_Number = 0;
        obj_s1.Boat_Number_and_Booking_ID = 0 +"/"+element.Booking_ID;

      }
      obj_s1._id = element._id;
      obj_s1.Location_Name = element.BoatDetails[0].Location_Name;
      obj_s1.Location_Id = element.BoatDetails[0].Location_Id;
      if(element.OwnerDetails.length !== 0){

        obj_s1.First_Name = element.OwnerDetails[0].First_Name;
        obj_s1.Parking_Ability = element.OwnerDetails[0].Parking_Ability;
        obj_s1.OwnerDetails = element.OwnerDetails[0];

       } 

       this.Cancels_Thread.push(obj_s1);


      

      } 
      
      


    }     
      
      
      
    }
  } else {
    if( selectedDays <= updatedates)
    {
          
      if(element.BoatDetails.length !== 0){

      
      if(element.BookingStatus == "Accepted"){

        var obj_s = Object();
        

      obj_s.Boat_Image = element.BoatDetails[0].Boat_Image[0];
      obj_s.imgUrl = this.imgUrl + element.BoatDetails[0].Boat_Image[0];
      obj_s.Boat_Name = element.BoatDetails[0].Boat_Name;
      obj_s.start = element.start;
      obj_s.Boat_Id =  element.BoatDetails[0]._id;
      obj_s.end = element.end;
      obj_s.Booking_ID = element.Booking_ID;
      obj_s.BookingStatus = element.BookingStatus;
      obj_s.Approved_LOA = element.Approved_LOA;
      obj_s.LOA = element.LOA;


      var boatnum = element.BoatDetails[0].Boat_Number;

      if (typeof boatnum !== "undefined" || boatnum != null){
       
        obj_s.Boat_Number = element.BoatDetails[0].Boat_Number;
        obj_s.Boat_Number_and_Booking_ID = element.BoatDetails[0].Boat_Number +"/"+element.Booking_ID;
      }
      else{

        obj_s.Boat_Number = 0;
        obj_s.Boat_Number_and_Booking_ID = 0 +"/"+element.Booking_ID;
        

      }

      obj_s._id = element._id;
      obj_s.Location_Name = element.BoatDetails[0].Location_Name;
      obj_s.Location_Id = element.BoatDetails[0].Location_Id;
      if(element.OwnerDetails.length !== 0){

        obj_s.First_Name = element.OwnerDetails[0].First_Name;
        obj_s.Parking_Ability = element.OwnerDetails[0].Parking_Ability;
        obj_s.OwnerDetails = element.OwnerDetails[0];

      } 

      

       this.Cancels_Second.push(obj_s);


      }

      else if(element.BookingStatus != "Accepted") 
      {

        var obj_s = Object();

      obj_s.Boat_Image = element.BoatDetails[0].Boat_Image[0];
      obj_s.imgUrl = this.imgUrl + element.BoatDetails[0].Boat_Image[0];
      obj_s.Boat_Name = element.BoatDetails[0].Boat_Name;
      obj_s.start = element.start;
      obj_s.Boat_Id =  element.BoatDetails[0]._id;
      obj_s.end = element.end;
      obj_s.Booking_ID = element.Booking_ID;
      obj_s.BookingStatus = element.BookingStatus;
      obj_s.Approved_LOA = element.Approved_LOA;
      obj_s.LOA = element.LOA;

      obj_s.WeekDay_Count = element.WeekDay_Count;
    obj_s.WeekDay_Count_Edit = element.WeekDay_Count_Edit;
    obj_s.WeekDay_Count_Reassign = element.WeekDay_Count_Reassign;
    obj_s.WeekEnd_Count = element.WeekEnd_Count
    obj_s.WeekEnd_Count_Edit = element.WeekEnd_Count_Edit;
    obj_s.WeekEnd_Count_Reassign = element.WeekEnd_Count_Reassign;
      

      if (typeof element.BoatDetails[0].Boat_Number !== "undefined" || element.BoatDetails[0].Boat_Number != null){
        
        obj_s.Boat_Number = element.BoatDetails[0].Boat_Number;
        obj_s.Boat_Number_and_Booking_ID = element.BoatDetails[0].Boat_Number +"/"+element.Booking_ID;

      }
      else{
        
        obj_s.Boat_Number = 0;
        obj_s.Boat_Number_and_Booking_ID = 0 +"/"+element.Booking_ID;

      }
      
      obj_s._id = element._id;
      obj_s.Location_Name = element.BoatDetails[0].Location_Name;
      obj_s.Location_Id = element.BoatDetails[0].Location_Id;
      if(element.OwnerDetails.length !== 0){

        obj_s.First_Name = element.OwnerDetails[0].First_Name;
        obj_s.Parking_Ability = element.OwnerDetails[0].Parking_Ability;
        obj_s.OwnerDetails = element.OwnerDetails[0];

      } 

       this.Cancels_First.push(obj_s);


      }

      else
      {

        var obj_s1 = Object();

        obj_s1.Boat_Image = element.BoatDetails[0].Boat_Image[0];
        obj_s1.imgUrl = this.imgUrl + element.BoatDetails[0].Boat_Image[0];
        obj_s1.Boat_Name = element.BoatDetails[0].Boat_Name;
        obj_s1.start = element.start;
        obj_s1.Boat_Id =  element.BoatDetails[0]._id;
        obj_s1.end = element.end;
        obj_s1.Booking_ID = element.Booking_ID;
        obj_s1.BookingStatus = element.BookingStatus;
        obj_s1.Approved_LOA = element.Approved_LOA;
        obj_s1.LOA = element.LOA;

      if (typeof element.BoatDetails[0].Boat_Number !== "undefined" || element.BoatDetails[0].Boat_Number != null){
        obj_s1.Boat_Number = element.BoatDetails[0].Boat_Number;
        obj_s1.Boat_Number_and_Booking_ID = element.BoatDetails[0].Boat_Number +"/"+element.Booking_ID;
      }
      else{
        
        obj_s1.Boat_Number = 0;
        obj_s1.Boat_Number_and_Booking_ID = 0 +"/"+element.Booking_ID;

      }
      obj_s1._id = element._id;
      obj_s1.Location_Name = element.BoatDetails[0].Location_Name;
      obj_s1.Location_Id = element.BoatDetails[0].Location_Id;
      if(element.OwnerDetails.length !== 0){

        obj_s1.First_Name = element.OwnerDetails[0].First_Name;
        obj_s1.Parking_Ability = element.OwnerDetails[0].Parking_Ability;
        obj_s1.OwnerDetails = element.OwnerDetails[0];

       } 

       this.Cancels_Thread.push(obj_s1);


      

      } 
      
      


    }     
  }
  }

  });
  this.Cancels = [];
  this.Cancellations.forEach(element => {
    let upadtedate = new Date(element.Updated_time);
    var d2 = new Date();
      if(e.target.value == 2){
        d2.setDate(d2.getDate() - 2);
      }else if(e.target.value == 3){
        d2.setDate(d2.getDate() - 3);
      }else if(e.target.value == 5){
        d2.setDate(d2.getDate() - 5);
      }else{
        d2.setDate(d2.getDate());
      }
    let updatedates = this.getFormattedDate_WithOut_Zero_Time(upadtedate);
    let selectedDays = this.getFormattedDate_WithOut_Zero_Time(d2.toString())
    if(e.target.value == 24){
    if( selectedDays == updatedates)
    {
      
      var obj_s2 = Object();
  
      if(element.BoatDetails.length !== 0){

       

        obj_s2.Boat_Image = element.BoatDetails[0].Boat_Image[0];
        obj_s2.imgUrl = this.imgUrl + element.BoatDetails[0].Boat_Image[0];
        obj_s2.Boat_Name = element.BoatDetails[0].Boat_Name;
        obj_s2.start = element.start;
        obj_s2.Boat_Id =  element.BoatDetails[0]._id;
        obj_s2.end = element.end;
        obj_s2.Booking_ID = element.Booking_ID;
        obj_s2.BookingStatus = element.BookingStatus;
        obj_s2.Approved_LOA = element.Approved_LOA;

        obj_s2.Boat_Number = element.BoatDetails[0].Boat_Number;
        obj_s2._id = element._id;
        obj_s2.Location_Name = element.BoatDetails[0].Location_Name;
        obj_s2.Location_Id = element.BoatDetails[0].Location_Id;
      if(element.OwnerDetails.length !== 0){

        obj_s2.First_Name = element.OwnerDetails[0].First_Name;
        obj_s2.Parking_Ability = element.OwnerDetails[0].Parking_Ability;
        obj_s2.OwnerDetails = element.OwnerDetails[0];

      } 

       this.Cancels.push(obj_s2);


      } 
      
    }
  } else{
    if( selectedDays <= updatedates)
    {
      
      var obj_s2 = Object();
  
      if(element.BoatDetails.length !== 0){

       

        obj_s2.Boat_Image = element.BoatDetails[0].Boat_Image[0];
        obj_s2.imgUrl = this.imgUrl + element.BoatDetails[0].Boat_Image[0];
        obj_s2.Boat_Name = element.BoatDetails[0].Boat_Name;
        obj_s2.start = element.start;
        obj_s2.Boat_Id =  element.BoatDetails[0]._id;
        obj_s2.end = element.end;
        obj_s2.Booking_ID = element.Booking_ID;
        obj_s2.BookingStatus = element.BookingStatus;
        obj_s2.Approved_LOA = element.Approved_LOA;

        obj_s2.Boat_Number = element.BoatDetails[0].Boat_Number;
        obj_s2._id = element._id;
        obj_s2.Location_Name = element.BoatDetails[0].Location_Name;
        obj_s2.Location_Id = element.BoatDetails[0].Location_Id;
      if(element.OwnerDetails.length !== 0){

        obj_s2.First_Name = element.OwnerDetails[0].First_Name;
        obj_s2.Parking_Ability = element.OwnerDetails[0].Parking_Ability;
        obj_s2.OwnerDetails = element.OwnerDetails[0];

      } 

       this.Cancels.push(obj_s2);


      } 
      
    }
  }


  });

 // this.Cancellations_Count =this.cancellationInfo.length + this.Cancels_Thread.length + this.Cancels_First.length + this.Cancels_Second.length;
 this.Cancellations_Count =this.cancellationInfoForupdates.length + this.Cancels_Thread.length + this.Cancels_First.length + this.Cancels_Second.length;
// this.Cancellations_Count = this.Cancels.length + this.Cancels_Thread.length + this.Cancels_First.length + this.Cancels_Second.length;
 this.New_Booking_Count = this.newBooking.length;
 this.Todays_Booking_Count = this.todaysBooking.length;


  }




  


}
