import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl,FormBuilder, Validators} from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';//'ng-multiselect-dropdown';
// import environment for all owners Done By Alagesan	on 06.07.2021
import { environment } from '../../environments/environment';
//import * as moment from 'moment';
declare var $: any;
declare var jQuery: any;
declare var moment: any;

@Component({
  selector: 'app-book-for-owner',
  templateUrl: './book-for-owner.component.html',
  styleUrls: ['./book-for-owner.component.css']
})
// Create Component for book for owner //Done By Alagesan on 21.05.2021	
export class BookForOwnerComponent implements OnInit {

 // moment:any;
   tui:any;
    // Add Base URL for all owners  Done By Alagesan	on 06.07.2021
    EnvironmentURL:string = environment.url;
   url = this.EnvironmentURL+"api/Schedule/";
   url_Owner = this.EnvironmentURL+"api/Owner/";
   url_Days = this.EnvironmentURL+"api/Days/";
   url_Suspend = this.EnvironmentURL+"api/Suspend/";
   //public_Day_URL = this.EnvironmentURL+"api/Days/";
   dropdownList = [];
   SelectOwner_dropdownList = [];
   dropdownList_filted = [];
   dropdownList_filted_Owner = [];
   selectedItemsRoot_BoatName =[];
   selectedItems = [];
   dropdownSettings : IDropdownSettings ;
   dropdownSettings_Owner : IDropdownSettings;
   set_BoatType = "";
   public_selectBoatId :any;

   Maximum_Length_DAYS_ALLOWED: string = "00-00-0000";
   Total_DAYS_ALLOWED: any = "0";

   PENDING_SUMMER_WEEKDAYS:any = 0;
   PENDING_SUMMER_WEEKENDS: any = 0;
   PENDING_WINTER_WEEKDAYS: any = 0;
   PENDING_WINTER_WEEKENDS: any = 0;

   PENDING_SUMMER_WEEKDAYS_second:any = 0;
   PENDING_SUMMER_WEEKENDS_second: any = 0;
   PENDING_WINTER_WEEKDAYS_second: any = 0;
   PENDING_WINTER_WEEKENDS_second: any = 0;

   //_second

   spn_years: any = 0;

   dropdownList_filted_model: any;
   boat_anniversary_date: string;
   pre_launch_date: string;
   cheking_prelonch = false;
   CommenMessages:any;

   current_Selected_Boat:any;
   partialcancelldays: any = 0;
   current_selectedOwner:any;
   timeszon_Set = "Australia/Sydney";


  constructor(private fb: FormBuilder,private http: HttpClient) { }

// Create Component for book for owner //Done By Alagesan on 21.05.2021	

  ngOnInit(): void {

    //var 

    $(".mobile-menu-icon").click(function(){
      $(".side-menu").toggleClass("mobile-sidebar");
    });

    $("#shown-loader-commen").css("display", "block");
    
   sessionStorage.setItem("Adminbooking-relodePg","1");
   sessionStorage.setItem("boat-maintenance-reload","1");
   sessionStorage.setItem("view-boat-reload","1");
    //ReloadPages_book_for_owner();

    var getbrwserType = sessionStorage.getItem("browserType");
    
      if(getbrwserType == "Safari")
      {    
       
       this.ReloadPages_book_for_owner();   
      }
      else{

        ReloadPages_book_for_owner();
        

      }
    
 
     sessionStorage.removeItem('AdminSelectBoat');
     sessionStorage.removeItem('Owner_SelectOwner');
     sessionStorage.setItem("pageIdentiFiction","book-for-owner");

    
        

       function ReloadPages_book_for_owner(){
           
           //var sss = public_URL;//
          
           var datasessions = sessionStorage.getItem("relodePg_book-for-owner");
           
           if(datasessions == null)
           {
               
               sessionStorage.setItem("relodePg_book-for-owner","0");
               location.reload();
 
           }
           else if(datasessions == "1"){
             sessionStorage.setItem("relodePg_book-for-owner","0");
               location.reload();
 
           }
          
 
       }

       
       this.Fun_getallDropDownDatas_Owner();
       this.currentYearSet();

       this.dropdownSettings = {
        singleSelection: true,
        idField: 'item_id',
        textField: 'item_text',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 3,
        allowSearchFilter: true,
        closeDropDownOnSelection : true,
        noDataAvailablePlaceholderText : "No data available" 
        //maxHeight : 100        
       
      };

       

       this.dropdownSettings_Owner = {
        singleSelection: true,
        idField: 'item_id',
        textField: 'item_text',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 3,
        allowSearchFilter: true,
        closeDropDownOnSelection : true,
        noDataAvailablePlaceholderText : "No data available" 
        //maxHeight : 100        
       
      };
        
      this.ExiCutionTimer_On_partially_cancelled_days();  

  }

 

   ReloadPages_book_for_owner(){
           
    //var sss = public_URL;//
   
    var datasessions = sessionStorage.getItem("relodePg_book-for-owner");
    
    if(datasessions == null)
    {
      $("#shown-loader-commen").css("display", "block");
      alert("Please reload the page if you find any difficulties with your booking schedules.");
        sessionStorage.setItem("relodePg_book-for-owner","0");
        //location.reload();
        window.location.href = window.location.href;

    }
    else if(datasessions == "1"){

      $("#shown-loader-commen").css("display", "block");
      alert("Please reload the page if you find any difficulties with your booking schedules.");
      sessionStorage.setItem("relodePg_book-for-owner","0");
        //location.reload();
        window.location.href = window.location.href;

    }
   

}



  onItemSelect_Owner(item: any) {

    this.dropdownList_filted_model ="";
    this.current_selectedOwner = item;
     
    this.dropdownList_filted = []; 
    sessionStorage.removeItem('AdminSelectBoat');
     var details = this.SelectOwner_dropdownList.find(x => x._id == item.item_id);     
     this.public_selectBoatId = details._id; 
     this.Fun_getallDropDownDatas(details._id);   
     sessionStorage.setItem("Owner_SelectOwner",JSON.stringify(details));
     sessionStorage.removeItem('SettNextBookingDays_boat');
   
   
  }

  onItemSelect(item: any) {
    
    this.current_Selected_Boat = item;
    var finddate = this.dropdownList.find(x => x._id == item.item_id);
    this.set_BoatType = finddate.Boattype_Name;
    sessionStorage.setItem("AdminSelectBoat",JSON.stringify(finddate)); 
    this.GetNextBookingDaysByBoatId(item.item_id);
    this.Binding_partially_cancelled_days("Currentyear");  

   // this.getpendingDays_Calculation_second();
   
  }

  onDeSelect_boat(items: any) {
    sessionStorage.removeItem('AdminSelectBoat');
     
  }
  //onDeSelect_Owner
  onDeSelect_Owner(items: any) {
    sessionStorage.removeItem('Owner_SelectOwner');
     
  }

  GetNextBookingDaysByBoatId(Boat_Id){

    
    sessionStorage.removeItem('SettNextBookingDays_boat');

    var obj = Object();
        obj.Boat_Id = Boat_Id;
        //url_Days = this.EnvironmentURL+"api/Days/GetNextBookingDaysByBoatId"
      this.http.post<any>(`${this.url_Days}GetNextBookingDaysByBoatId`, obj).subscribe(results => { 
               
        if(results.status == true)
        {
          var temp_resp = results.response;
          if (typeof temp_resp  !== 'undefined' && temp_resp.length > 0) {
            sessionStorage.setItem("SettNextBookingDays_boat",JSON.stringify(temp_resp[0]));
            this.GetNextBookingDaysByBoatId_display(Boat_Id);
            
          }
          else
          {

            var mess_Tmp = "The maximum days to book in advance for the boat have not been updated. Please navigate to settings and allocate this setting before making a booking";
            $("#p-message-save-content").text(mess_Tmp);
            $('#btn-CommenMessage-save-disp-btns').trigger('click');


          }
           
        }
                
      
        }, err => {
          
        })

  }

 

  Fun_getallDropDownDatas_Owner(){ 
   
    this.http.get<any>(`${this.url_Owner}ViewAllOwners`).subscribe(data => { 
      this.SelectOwner_dropdownList = data.response;   
                             
      var tempArry = [];
      data.response.forEach(element => {
            var obj2 = Object();
            obj2.item_id = element._id,
            // Concatination firstname and lastname for book for owner//Done By Alagesan on 29.06.2021
            obj2.item_text = (element.First_Name).concat(" ", element.Last_Name);
            tempArry.push(obj2);

      });
      this.dropdownList_filted_Owner = tempArry;
      
      this.GetAllUnAvailableDays();
    
      }, err => {
       
      })
}

 GetAllUnAvailableDays(){


  this.http.get<any>(`${this.url_Days}GetUnAvailabeDaysOfBoats`).subscribe(data => { 
   

    sessionStorage.setItem("GetAllUnAvailableDays_Owners",JSON.stringify(data));             


    this.http.get<any>(`${this.url_Days}GetUnAvailabeDaysOfBoats`).subscribe(datas => { 
   
      if(datas.status == true){
    
        var tmp_1 = datas.response;
        var tmp_arry_1 = [];

        $.each(datas.response, function(index, val) {        

          var obj = Object();
          obj.Boat_Id =  val.Boat_Id[0];//a1.toString();
          obj.Boat_Name = val.Boat_Name[0];//a2.toString();
          obj.UnAvailableDates = val.UnAvailableDates;
          obj._id = val._id;
          tmp_arry_1.push(obj);

        });
        sessionStorage.setItem("GetUnAvailabeDaysOfBoats_Owners",JSON.stringify(tmp_arry_1));
         
       }    
  
    }, err => {
      
    })

  
    }, err => {
      
    })

    
   }

   


  Fun_getallDropDownDatas(owner_drp_Id){ 
    
     this.PENDING_SUMMER_WEEKDAYS = 0; 
     this.PENDING_SUMMER_WEEKENDS = 0;
     this.PENDING_WINTER_WEEKDAYS = 0;
     this.PENDING_WINTER_WEEKENDS = 0;
    
     
    this.dropdownList = [];       
    this.set_BoatType = "";
      var obj = Object();
        obj.owner_id = owner_drp_Id;
      this.http.post<any>(`${this.url_Owner}GetBoatNameByOwnerId`, obj).subscribe(data => { 
        
                            
        var tempArry = [];
        var tempArry2 = [];
               
        data.response.forEach(element => {

          element.BoatDetails.forEach(element2 => {
            if(element2.IsActive == true){

            
            var obj2 = Object();
              obj2.item_id = element2._id,
              obj2.item_text = element2.Boat_Name
              tempArry.push(obj2);

              var obj3 = Object();
              obj3._id = element2._id,
              obj3.Boattype_Name = element2.Boattype_Name,
              obj3.Boat_Name = element2.Boat_Name
              tempArry2.push(obj3);
            }

          });
              

        });

        
        this.dropdownList_filted = tempArry; 
        this.dropdownList = tempArry2;  

        if(this.dropdownList.length == 1)
        {
          var BoatDatas_tmp = this.dropdownList_filted[0];
          //var ssss = 


           var finddate = this.dropdownList.find(x => x._id == BoatDatas_tmp.item_id);
           this.set_BoatType = finddate.Boattype_Name;
           sessionStorage.setItem("AdminSelectBoat",JSON.stringify(finddate)); 
           this.GetNextBookingDaysByBoatId(BoatDatas_tmp.item_id);

           this.dropdownList_filted_model = this.dropdownList_filted;
           $('.multiselect-dropdown').trigger('click');
        }
       
      
        }, err => {
          
        })
  }


  getpendingDays_Calculation()
  {

    

    var current_month_year = this.passing_year_month();

       
    this.PENDING_SUMMER_WEEKDAYS = 0; 
    this.PENDING_SUMMER_WEEKENDS = 0;
    this.PENDING_WINTER_WEEKDAYS = 0;
    this.PENDING_WINTER_WEEKENDS = 0;
    this.boat_anniversary_date = "";
    this.pre_launch_date = "";
    var Owner_tmp = JSON.parse(sessionStorage.getItem("Owner_SelectOwner")); 

    var Boat_tmp = JSON.parse(sessionStorage.getItem("AdminSelectBoat")); 
   // console.log(current_month_year)
    var obj = Object();
        obj.Owner_Id = Owner_tmp._id;
        obj.Boat_Id = Boat_tmp._id;
        obj.year = current_month_year.year;
        obj.month = current_month_year.month;


      this.http.post<any>(`${this.url}GetAllPendingDaysOfOwner`, obj).subscribe(data => { 

               
        if(data.status == true){

          var dt = data.Response;
          
          var BookedDays = dt.BookedDays;
          var AllocatedDays = dt.AllocatedDays;
          
          //Pre launch date and boat anniversary date for book for owner Done By Alagesan on 29.07.2021
          try
          {
          if(BookedDays[0].BoatDetails.length > 0){
            this.boat_anniversary_date = BookedDays[0].BoatDetails[0].Launch_Date;
            
            this.pre_launch_date = BookedDays[0].BoatDetails[0].PreLaunch_Date;
            
          }
        }
        catch{

         // if(AllocatedDays[0].length > 0){
            this.boat_anniversary_date = AllocatedDays[0].Launch_Date;
           
            this.pre_launch_date = AllocatedDays[0].PreLaunch_Date;
            
         // }

        }
          if(BookedDays.length == 0){
          this.PENDING_SUMMER_WEEKDAYS = AllocatedDays[0].Summer_WeekDays ; 
          this.PENDING_SUMMER_WEEKENDS = AllocatedDays[0].Summer_WeekEndDays ;
          this.PENDING_WINTER_WEEKDAYS = AllocatedDays[0].Winter_WeekDays ;
          this.PENDING_WINTER_WEEKENDS = AllocatedDays[0].Winter_WeekEndDays ;

          }
          
          else{

            var a1 = AllocatedDays[0].Summer_WeekDays;
            var a2 = BookedDays[0].Summer_WeekDays;
            var a3 = parseInt(a1) - parseInt(a2); 

          this.PENDING_SUMMER_WEEKDAYS = a3; 
          this.PENDING_SUMMER_WEEKENDS = AllocatedDays[0].Summer_WeekEndDays - BookedDays[0].Summer_WeekEndDays;
          this.PENDING_WINTER_WEEKDAYS = AllocatedDays[0].Winter_WeekDays - BookedDays[0].Winter_WeekDays;
          this.PENDING_WINTER_WEEKENDS = AllocatedDays[0].Winter_WeekEndDays - BookedDays[0].Winter_WeekEndDays;
           
          if(this.PENDING_SUMMER_WEEKDAYS < 0){
              this.PENDING_SUMMER_WEEKDAYS = 0;
            }

            if(this.PENDING_SUMMER_WEEKENDS < 0){
              this.PENDING_SUMMER_WEEKENDS = 0;
            }
            if(this.PENDING_WINTER_WEEKDAYS < 0){
              this.PENDING_WINTER_WEEKDAYS = 0;
            }

            if(this.PENDING_WINTER_WEEKENDS < 0){
              this.PENDING_WINTER_WEEKENDS = 0;
            }
            

          }


          var obj_days = Object();
          if(this.PENDING_SUMMER_WEEKDAYS == null){
            this.PENDING_SUMMER_WEEKDAYS = 0;
          }
          if(this.PENDING_SUMMER_WEEKENDS == null){
            this.PENDING_SUMMER_WEEKENDS = 0;

          }
          if(this.PENDING_WINTER_WEEKDAYS == null){
            this.PENDING_WINTER_WEEKDAYS = 0;

          }
          if(this.PENDING_WINTER_WEEKENDS == null){
            this.PENDING_WINTER_WEEKENDS = 0;

          }

          obj_days.PENDING_SUMMER_WEEKDAYS = this.PENDING_SUMMER_WEEKDAYS; 
          obj_days.PENDING_SUMMER_WEEKENDS =this.PENDING_SUMMER_WEEKENDS;
          obj_days.PENDING_WINTER_WEEKDAYS =this.PENDING_WINTER_WEEKDAYS;
          obj_days.PENDING_WINTER_WEEKENDS = this.PENDING_WINTER_WEEKENDS;

          



          sessionStorage.setItem("daysMoreDan",JSON.stringify(obj_days));


          this.getpendingDays_Calculation_second();

        }
        else{
         

         this.CommenMessages = "data not fount";
         $('#btn-CommenMessage-disp-btns-angular').trigger('click');


        }
        
        
       
      
        }, err => {
          
        })
    

  }



  getpendingDays_Calculation_second()
  {

    

    var current_month_year = this.passing_year_month_second();

       
    this.PENDING_SUMMER_WEEKDAYS_second = 0; 
    this.PENDING_SUMMER_WEEKENDS_second = 0;
    this.PENDING_WINTER_WEEKDAYS_second = 0;
    this.PENDING_WINTER_WEEKENDS_second = 0;
    
    //this.boat_anniversary_date = "";
    //this.pre_launch_date = "";
    var Owner_tmp = JSON.parse(sessionStorage.getItem("Owner_SelectOwner")); 

    var Boat_tmp = JSON.parse(sessionStorage.getItem("AdminSelectBoat")); 
    //console.log(current_month_year)
    var obj = Object();
        obj.Owner_Id = Owner_tmp._id;
        obj.Boat_Id = Boat_tmp._id;
        obj.year = current_month_year.year;
        obj.month = current_month_year.month;


      this.http.post<any>(`${this.url}GetAllPendingDaysOfOwner`, obj).subscribe(data => { 

               
        if(data.status == true){

          var dt = data.Response;
          
          var BookedDays = dt.BookedDays;
          var AllocatedDays = dt.AllocatedDays;
          
          //Pre launch date and boat anniversary date for book for owner Done By Alagesan on 29.07.2021
          try
          {
          if(BookedDays[0].BoatDetails.length > 0){
           // this.boat_anniversary_date = BookedDays[0].BoatDetails[0].Launch_Date;
            
            // this.pre_launch_date = BookedDays[0].BoatDetails[0].PreLaunch_Date;
            
          }
        }
        catch{

         
           // this.boat_anniversary_date = AllocatedDays[0].Launch_Date;
           
           // this.pre_launch_date = AllocatedDays[0].PreLaunch_Date;
            
        

        }
          if(BookedDays.length == 0){
          this.PENDING_SUMMER_WEEKDAYS_second = AllocatedDays[0].Summer_WeekDays ; 
          this.PENDING_SUMMER_WEEKENDS_second = AllocatedDays[0].Summer_WeekEndDays ;
          this.PENDING_WINTER_WEEKDAYS_second = AllocatedDays[0].Winter_WeekDays ;
          this.PENDING_WINTER_WEEKENDS_second = AllocatedDays[0].Winter_WeekEndDays ;

          }
          
          else{

            var a1 = AllocatedDays[0].Summer_WeekDays;
            var a2 = BookedDays[0].Summer_WeekDays;
            var a3 = parseInt(a1) - parseInt(a2); 

          this.PENDING_SUMMER_WEEKDAYS_second = a3; 
          this.PENDING_SUMMER_WEEKENDS_second = AllocatedDays[0].Summer_WeekEndDays - BookedDays[0].Summer_WeekEndDays;
          this.PENDING_WINTER_WEEKDAYS_second = AllocatedDays[0].Winter_WeekDays - BookedDays[0].Winter_WeekDays;
          this.PENDING_WINTER_WEEKENDS_second = AllocatedDays[0].Winter_WeekEndDays - BookedDays[0].Winter_WeekEndDays;
           
          if(this.PENDING_SUMMER_WEEKDAYS_second < 0){
              this.PENDING_SUMMER_WEEKDAYS_second = 0;
            }

            if(this.PENDING_SUMMER_WEEKENDS_second < 0){
              this.PENDING_SUMMER_WEEKENDS_second = 0;
            }
            if(this.PENDING_WINTER_WEEKDAYS_second < 0){
              this.PENDING_WINTER_WEEKDAYS_second = 0;
            }

            if(this.PENDING_WINTER_WEEKENDS_second < 0){
              this.PENDING_WINTER_WEEKENDS_second = 0;
            }
            

          }


         // var obj_days = Object();

          if(this.PENDING_SUMMER_WEEKDAYS_second == null){
            this.PENDING_SUMMER_WEEKDAYS_second = 0;
          }
          if(this.PENDING_SUMMER_WEEKENDS_second == null){
            this.PENDING_SUMMER_WEEKENDS_second = 0;

          }
          if(this.PENDING_WINTER_WEEKDAYS_second == null){
            this.PENDING_WINTER_WEEKDAYS_second = 0;

          }
          if(this.PENDING_WINTER_WEEKENDS_second == null){
            this.PENDING_WINTER_WEEKENDS_second = 0;

          }

         // obj_days.PENDING_SUMMER_WEEKDAYS = this.PENDING_SUMMER_WEEKDAYS_second; 
         // obj_days.PENDING_SUMMER_WEEKENDS =this.PENDING_SUMMER_WEEKENDS_second;
         // obj_days.PENDING_WINTER_WEEKDAYS =this.PENDING_WINTER_WEEKDAYS_second;
         // obj_days.PENDING_WINTER_WEEKENDS = this.PENDING_WINTER_WEEKENDS_second;

          



          //sessionStorage.setItem("daysMoreDan",JSON.stringify(obj_days));


          

        }
        else{
         

         this.CommenMessages = "data not fount";
         $('#btn-CommenMessage-disp-btns-angular').trigger('click');


        }
        
        
       
      
        }, err => {
          
        })
    

  }


  



  locationReload(){
    //location.reload();
    this.getpendingDays_Calculation();

    $('.id-manual-reload').trigger('click');


  }


  GetNextBookingDaysByBoatId_display(id){
   
    var dattr = Object();
    dattr.Boat_Id = id;
    //this.NEXT_BOOKING_DAYS_ALLOWED ="";
    

    this.http.post<any>(`${this.url_Days}GetNextBookingDaysByBoatId`,  dattr  ).subscribe(data => {
    
     
      if(data.status == true){
        var temp_res = data.response; 
        var tmp_date_responce = data.Dateresponse;
        try
        {
        this.Total_DAYS_ALLOWED = temp_res[0].Next_BookingDay; 
        var lonchdate =  temp_res[0].BoatDetails[0].Launch_Date
        this.cheking_prelonch = this.adding_MultipleDays_cheking_lounchDate(temp_res[0].Next_BookingDay,lonchdate,tmp_date_responce); 
        

        
        this.Maximum_Length_DAYS_ALLOWED = this.display_Date_for_maximumLength_Date(this.Days_Genarator(this.adding_MultipleDays(temp_res[0].Next_BookingDay,lonchdate,tmp_date_responce)));// temp_res[0].Next_BookingDay;
        }
        catch{

        }
        this.getpendingDays_Calculation();
        
      }
      else if(data.status == false)
      {
        var ssss="";
      }
    },        
        err => {
         
        })
  }


   adding_MultipleDays(numberOfdays,Launch_Date,createdDaste){
    
    // var launch_date_temp = new Date(Launch_Date);//ashly
    var launch_date_temp = new Date(Launch_Date.replace(/-/g, '\/').replace(/T.+/, ''));
    //var newdate = new Date(); //ashly
    var newdate = new Date(this.MomentConvert_currentDay_Date().replace(/-/g, '\/').replace(/T.+/, ''));
    console.log(newdate);
    var created_date = null;
    console.log(new Date(Launch_Date.replace(/-/g, '\/').replace(/T.+/, '')));
        if(launch_date_temp < newdate){
      //////api next start.......

      if(createdDaste != null){
        //created_date =  new Date(createdDaste.Current_Time);
       // created_date =  new Date(); //ashly
        created_date = new Date(this.MomentConvert_currentDay_Date().replace(/-/g, '\/').replace(/T.+/, ''));
       
        if(launch_date_temp < created_date)
        {
          created_date.setDate(created_date.getDate() + numberOfdays);
          console.log(created_date);
          console.log(new Date(created_date));
          return new Date(created_date);

        }
        else
        {
          newdate.setDate(newdate.getDate() + numberOfdays);
          console.log(newdate);
          return new Date(newdate);

        }
  
      }
      else
      {
        newdate.setDate(newdate.getDate() + numberOfdays);
        console.log(newdate);
        return new Date(newdate);
      }
    }
    else
    {
      launch_date_temp.setDate(launch_date_temp.getDate() + numberOfdays);
      console.log(launch_date_temp);
      return new Date(launch_date_temp);

    }
   }


   adding_MultipleDays_cheking_lounchDate(numberOfdays,Launch_Date,createdDaste)
   {
    
    var launch_date_temp = new Date(Launch_Date);
    var newdate = new Date();
    var created_date = null; 
       
    if(launch_date_temp < newdate)
    {
       return false;
      
    }
    else
    {
       return true;
    }

   }



    Days_Genarator(data){        
    
    //var result = [];
    var days = ['Su','Mo','Tu','We','Th','Fr','Sa'];
    var monthNames = [ "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December" ];
    var monthNames_Number = [ "01", "02", "03", "04", "05", "06",
        "07", "08", "09", "10", "11", "12" ];

    
     // let data = new Date(this.MomentConvert(dat));
      var obj = Object();
      obj.Day_week = data.getDate() +" "+ days[data.getDay()] ;
      obj.day = data.getDate();
      obj.month = monthNames[data.getMonth()];
      obj.month_Number = monthNames_Number[data.getMonth()];
      obj.year = data.getFullYear();       
      
      //result.push(obj);
    
      return obj;

  } 

  display_Date_for_maximumLength_Date(obj){
    var datss = obj.day +" - "+ obj.month_Number +" - "+ obj.year;
    return datss;

  }


  // ........................


  
  generate_partially_cancelled_days_Next(){
    var passing = "Next";
    this.Binding_partially_cancelled_days(passing);
  }
  generate_partially_cancelled_days_PreVious(){
    var passing = "PreVious";
    this.Binding_partially_cancelled_days(passing);
  }

  
  Binding_partially_cancelled_days(passing){

   

    var get_OWNER_Details = this.current_selectedOwner; 
    var get_boat_Data = this.current_Selected_Boat;
    if(passing == "Next"){
      var renderRange = this.String_Split_Poit_vaice_Next($("#renderRange").text());
    }
    else if(passing == "PreVious"){
      var renderRange = this.String_Split_Poit_vaice_PreVious($("#renderRange").text());
    }
    else{

      var renderRange = this.String_Split_Poit_vaice_CurrentYear($("#renderRange").text());

    }
   

    try
    {

          var obj =
          {
            Owner_Id: get_OWNER_Details.item_id,
            Boat_Id: get_boat_Data.item_id,
            Cancellationyear:renderRange
          };
    
          this.http.post<any>(`${this.url_Suspend}PartialDaysCount`,  obj  ).subscribe(data => {            
          
          if(data.status == true){

            this.partialcancelldays = data.cancelcount;
            this.getpendingDays_Calculation();
    
          }
          else{
            this.partialcancelldays = 0;
            this.getpendingDays_Calculation();
          }
    
            
          }, err => {
              
              })

    }
    catch{

      

    }

   

  }





  String_Split_Poit_vaice_Next(dateString){
    
    var dateArray = dateString.split(".");          
    var dateObj =dateArray[0]; 
    if(dateArray[1] == "December"){

      dateObj = parseInt(dateObj) + 1;
      dateObj = dateObj.toString();

    }      
    return dateObj;
  }

  String_Split_Poit_vaice_PreVious(dateString){
    
    var dateArray = dateString.split(".");          
    var dateObj =dateArray[0];      
    if(dateArray[1] == "January"){

      dateObj = parseInt(dateObj) - 1;
      dateObj = dateObj.toString();

    } 
    return dateObj;
  }

  String_Split_Poit_vaice_CurrentYear(dateString){
    
    var dateArray = dateString.split(".");          
    var dateObj =dateArray[0];     
    
    return dateObj;
  }

  

  passing_year_month(){

    let year_month = $("#renderRange").text();
    let split_datas = year_month.split(".");
    const monthNames = [ "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December" ];

    let monthIndex = monthNames.findIndex(x => x == split_datas[1]); 
        monthIndex = monthIndex + 1;
    let monthIndex_str = monthIndex.toString();     

    let obj = {
      year : split_datas[0],
      month : monthIndex_str 
    }

    return obj

  }


  passing_year_month_second(){

    let obj = {
      year : this.spn_years,
      month : new Date(this.boat_anniversary_date).getMonth() + 2
    }

    return obj

  }

  //_second

  MomentConvert(dates){


    var results = moment(dates).tz(this.timeszon_Set).format();
   

    return results;

}
 MomentConvert_currentDay_Date(){

  var results = moment().tz(this.timeszon_Set).format();
 
  return results;

}

  ExiCutionTimer_On_partially_cancelled_days() {
    setInterval(() => {
      var temp_data = sessionStorage.getItem('datatrrigerd_ownerlogin');
      if (typeof temp_data !== 'undefined' && temp_data != null) {
        if(temp_data == "1"){
          sessionStorage.removeItem('datatrrigerd_ownerlogin');          
          this.Binding_partially_cancelled_days("CurrentDate");
        }  
      }
    }, 100);
  }

  currentYearSet(){

    let dt = new Date();
    this.spn_years = dt.getFullYear();

  }



  totaldays_PreVious(){

    this.spn_years = this.spn_years - 1;
    this.getpendingDays_Calculation_second();

  }

  totaldays_Next(){
    console.log(new Date(this.boat_anniversary_date).getMonth() + 1);
    this.spn_years = this.spn_years + 1;
    this.getpendingDays_Calculation_second();

  }





}
