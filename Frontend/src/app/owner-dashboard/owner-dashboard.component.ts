import { AfterContentInit, AfterViewInit, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';//'ng-multiselect-dropdown';
// import environment for owner dashboard Done By Alagesan	on 06.07.2021
import { environment } from '../../environments/environment';
declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-owner-dashboard',
  templateUrl: './owner-dashboard.component.html',
  styleUrls: ['./owner-dashboard.component.css']
})
// Create Component for owner dashboard //Done By Alagesan on 17.05.2021

export class OwnerDashboardComponent implements OnInit{
  ownerlogin: boolean;
  dropdownSettings : IDropdownSettings ;
  // Add Base URL for owner dashboard  Done By Alagesan	on 06.07.2021
  EnvironmentURL:string = environment.url;
  url_Owner = this.EnvironmentURL+"api/Owner/";
  url_Days = this.EnvironmentURL+"api/Days/";
  imgUrl = this.EnvironmentURL+"api/uploads/";
  urlViewBookingDetails = this.EnvironmentURL+"api/Schedule";
  url_Suspend = this.EnvironmentURL+"api/Suspend/";
  

  dropdownList_filted = [];
  dropdownList = [];
  viewBookingDetailsdata: any=[];
  viewBookingByOwnerIddata: any=[];
  viewCancelBookingByOwnerIddata: any=[];
  searchText: any = '';
  url = this.EnvironmentURL+"api/Schedule/";
  PENDING_SUMMER_WEEKDAYS:any = 0;
  PENDING_SUMMER_WEEKENDS: any = 0;
  PENDING_WINTER_WEEKDAYS: any = 0;
  PENDING_WINTER_WEEKENDS: any = 0;
  PENDING_SUMMER_WEEKDAYS_second:any = 0;
   PENDING_SUMMER_WEEKENDS_second: any = 0;
   PENDING_WINTER_WEEKDAYS_second: any = 0;
   PENDING_WINTER_WEEKENDS_second: any = 0;
  Global_BoatId: any;
  current_Selected_Boat:any;

  Maximum_Length_DAYS_ALLOWED: any = "00-00-0000";
  Total_DAYS_ALLOWED: any = "0";

  cheking_prelonch = false;
  partialcancelldays: any = 0;
  

  dropdownList_filted_model=[];
  boat_anniversary_date: string ;
  pre_launch_date: string ;
  ConformationMessage: any;
  Conformation_Id:any;
  commenMessages:any;
  listBoats: any = [];
  spn_years: any = 0;
  boat_anniversary_datemonth: string;
  singleboat ='';
  isgreater: boolean;
  // customOptions: OwlOptions = {
  //   loop: true,
  //   mouseDrag: false,
  //   touchDrag: false,
  //   pullDrag: false,
  //   dots: false,
  //   navSpeed: 700,
  //   navText: ['', ''],
  //   responsive: {
  //     0: {
  //       items: 1
  //     },
  //     400: {
  //       items: 2
  //     },
  //     740: {
  //       items: 3
  //     },
  //     940: {
  //       items: 4
  //     }
  //   },
  //   nav: true
  // }

  constructor(private router: Router,private http: HttpClient) {
   }

// Create Component for owner dashboard //Done By Alagesan on 17.05.2021

  ngOnInit(): void {

    $(".mobile-menu-icon").click(function(){
      $(".side-menu").toggleClass("mobile-sidebar");
    });
    

    $("#shown-loader-commen").css("display", "block");
   

    var session_Chek = JSON.parse(sessionStorage.getItem("userToken"));
    if(session_Chek == null){
     // this.router.navigate(['/session-Expire/']);
      this.router.navigate(['']);

    }

    this.ownerlogin = JSON.parse(sessionStorage.getItem("userlogin"));

   
    
    if(this.ownerlogin==false){
      this.router.navigate(['/owner-login/']);
    }

  

    var getbrwserType = sessionStorage.getItem("browserType");
   
      if(getbrwserType == "Safari")
      {    
       // ReloadPages();
       this.ReloadPages_safari();   
      }
      else{

        ReloadPages();
        

      }

    function ReloadPages(){
       
     
      var datasessions = sessionStorage.getItem("owner-dashboard-relodePg");
      
      if(datasessions == null)
      {
          
          sessionStorage.setItem("owner-dashboard-relodePg","0");
         // location.reload();
          window.location.href = window.location.href;
         

      }
      else if(datasessions == "1"){
        sessionStorage.setItem("owner-dashboard-relodePg","0");
          //location.reload();
          window.location.href = window.location.href;

      }
      //sessionStorage.setItem("relodePg","1");//

    }

    function ReloadPages_safari()
    {
     
          var datasessions = sessionStorage.getItem("owner-dashboard-relodePg-safari");
        
        if(datasessions == null)
        {
            
            sessionStorage.setItem("owner-dashboard-relodePg-safari","0");
            window.location.href = window.location.href;

        }
        else if(datasessions == "1"){
          sessionStorage.setItem("owner-dashboard-relodePg-safari","0");
          window.location.href = window.location.href;

        } 

  }
  this.currentYearSet();

  sessionStorage.removeItem('SettNextBookingDays_boat');
    sessionStorage.setItem("pageIdentiFiction","owner-dashboard-Reservation");
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

    this.Owner_Log_getallDropDownDatas_Boat();
    this.ExiCutionTimer_On_partially_cancelled_days();
    
 setTimeout(() => {
             console.log(this.dropdownList_filted);
       if(this.dropdownList_filted.length == 1)
        { 
          this.singleboat = this.dropdownList_filted[0].item_text;
          var BoatDatas_tmp = this.dropdownList_filted[0];
          var Filterboat = this.dropdownList.find(x => x._id == BoatDatas_tmp.item_id);    
          sessionStorage.setItem("Owner_pg_boatListed",JSON.stringify(Filterboat));
          sessionStorage.setItem("AdminSelectBoat",JSON.stringify(Filterboat));
          
          this.current_Selected_Boat = BoatDatas_tmp;
          this.dropdownList_filted_model = this.dropdownList_filted;
          this.Global_BoatId = BoatDatas_tmp.item_id;
            this.GetNextBookingDaysByBoatId(BoatDatas_tmp.item_id);   
            console.log(this.Global_BoatId);
            this.GetNextBookingDaysByBoatId_display(BoatDatas_tmp.item_id);
            console.log(BoatDatas_tmp);
            this.Binding_partially_cancelled_days("Currentyear");
            this.getBoatDetails(BoatDatas_tmp.item_id);

        }
         }, 400);
  }
 
  openLink(link){
    window.open(link);
  }
  //ngAfterContentInit() {
    // console.log(this.dropdownList_filted);
  //      if(this.dropdownList_filted.length == 1)
  //       { 
  //         this.singleboat = this.dropdownList_filted[0].item_text;
  //         var BoatDatas_tmp = this.dropdownList_filted[0];
  //         var Filterboat = this.dropdownList.find(x => x._id == BoatDatas_tmp.item_id);    
  //         sessionStorage.setItem("Owner_pg_boatListed",JSON.stringify(Filterboat));
  //         sessionStorage.setItem("AdminSelectBoat",JSON.stringify(Filterboat));
          
  //         this.current_Selected_Boat = BoatDatas_tmp;
  //         this.dropdownList_filted_model = this.dropdownList_filted;
  //         this.Global_BoatId = BoatDatas_tmp.item_id;
  //           this.GetNextBookingDaysByBoatId(BoatDatas_tmp.item_id);   
  //           console.log(this.Global_BoatId);
  //           this.GetNextBookingDaysByBoatId_display(BoatDatas_tmp.item_id);
  //           console.log(BoatDatas_tmp);
  //           this.Binding_partially_cancelled_days("Currentyear");
  //           this.getBoatDetails(BoatDatas_tmp.item_id);

  //       }
  // }
  //session-Expire
  //this.router.navigate(['dashboard/']);

  //

 // sss;
 openSmartBoating(){
  //alert();
  $('#btn-Iframe-save-disp-btns').trigger('click');
}
 toCalender() {
  document.getElementById("calScroll").scrollIntoView();
}
  ReloadPages_safari()
  {
    
    
        var datasessions = sessionStorage.getItem("owner-dashboard-relodePg-safari");
      
      if(datasessions == null)
      {

        $("#shown-loader-commen").css("display", "block");
        alert("Please reload the page if you find any difficulties with your booking schedules.");
          
          sessionStorage.setItem("owner-dashboard-relodePg-safari","0");
          window.location.href = window.location.href;
          //location.reload(true);

      }
      else if(datasessions == "1"){

        $("#shown-loader-commen").css("display", "block");

        alert("Please reload the page if you find any difficulties with your booking schedules.");

        sessionStorage.setItem("owner-dashboard-relodePg-safari","0");
        window.location.href = window.location.href;
        //location.reload(true);

      } 

}
  








  //




  

  onItemSelect(item: any) {

   
    var Filterboat = this.dropdownList.find(x => x._id == item.item_id);    
   sessionStorage.setItem("Owner_pg_boatListed",JSON.stringify(Filterboat));
   sessionStorage.setItem("AdminSelectBoat",JSON.stringify(Filterboat));
   
   this.current_Selected_Boat = item;

   this.GetNextBookingDaysByBoatId(item.item_id)    
   this.Global_BoatId = item.item_id;
  // console.log(this.Global_BoatId);
   //this.getpendingDays_Calculation(item.item_id);
   this.GetNextBookingDaysByBoatId_display(item.item_id);
  // console.log(item);
   this.Binding_partially_cancelled_days("Currentyear");
   this.getBoatDetails(item.item_id);
  // this.getpendingDays_Calculation_second(item.item_id);
  }

 
getBoatDetails(boatid){
  let owner_drp_Id = JSON.parse(sessionStorage.getItem("Ownerlogin"));
    let obj = Object();
      obj.owner_id = owner_drp_Id._id;
 
  this.http.post<any>(`${this.url_Owner}/GetBoatDetailsByOwner`,obj  ).subscribe(data => { 
    this.listBoats = data['response'];
    for(let boat of this.listBoats){
      if(boat.Boat_Id == boatid && boat.Block == false){
      $('#suspend-ownerboat-popup-message-btn').trigger('click'); 
          
      }
    }
  }, err => {
       
  })
}

  GetNextBookingDaysByBoatId(Boat_Id){

   
    sessionStorage.removeItem('SettNextBookingDays_boat');

    var obj = Object();
        obj.Boat_Id = Boat_Id;        
      this.http.post<any>(`${this.url_Days}GetNextBookingDaysByBoatId`, obj).subscribe(results => {           
        if(results.status == true)
        {
          sessionStorage.setItem("SettNextBookingDays_boat_ownerLog",JSON.stringify(results));

          var temp_resp = results.response;
          if (typeof temp_resp  !== 'undefined' && temp_resp.length > 0) {
            sessionStorage.setItem("SettNextBookingDays_boat",JSON.stringify(temp_resp[0]));
          }
          else
          {

           // $("#h4-message-save-type").text("Message");
           var mess_Tmp = "The maximum days to book in advance for the boat have not been updated. Please navigate to settings and allocate this setting before making a booking";
            $("#p-message-save-content").text(mess_Tmp);
            $('#btn-CommenMessage-save-disp-btns').trigger('click');


            

          }
           
        }
                
      
        }, err => {
         
        })

  }






  onDeSelect_boat(items: any) {
    sessionStorage.removeItem('AdminSelectBoat');
     
  }


  Owner_Log_getallDropDownDatas_Boat_shaedulerBase(){     
   
    var owner_drp_Id = JSON.parse(sessionStorage.getItem("Ownerlogin"));
   
         
     this.dropdownList = [];       
    // this.set_BoatType = "";
       var obj = Object();
         obj.owner_id = owner_drp_Id._id;
       this.http.post<any>(`${this.url_Owner}GetBoatNameByOwnerId`, obj).subscribe(data => { 
                                     
         var tempArry = [];
         var tempArry2 = [];
                
         data.response.forEach(element => {
 
           element.BoatDetails.forEach(element2 => {
             var obj2 = Object();
               obj2.item_id = element2._id,
               obj2.item_text = element2.Boat_Name
               tempArry.push(obj2);
 
               var obj3 = Object();
               obj3._id = element2._id,
               obj3.Boattype_Name = element2.Boattype_Name,
               obj3.Boat_Name = element2.Boat_Name
               tempArry2.push(obj3)
 
           });
               
 
         });
         this.dropdownList_filted = tempArry;
         this.dropdownList = tempArry2;
         sessionStorage.setItem("Owner_pg_boatListed",JSON.stringify(tempArry2)); 
 
        //  if(this.dropdownList_filted.length == 1)
        // { 
        //   this.singleboat = this.dropdownList_filted[0].item_text;
        //   var BoatDatas_tmp = this.dropdownList_filted[0];
        //   var Filterboat = this.dropdownList.find(x => x._id == BoatDatas_tmp.item_id);    
        //   sessionStorage.setItem("Owner_pg_boatListed",JSON.stringify(Filterboat));
        //   sessionStorage.setItem("AdminSelectBoat",JSON.stringify(Filterboat));
          
        //   this.current_Selected_Boat = BoatDatas_tmp;
        //   this.dropdownList_filted_model = this.dropdownList_filted;
        //   this.Global_BoatId = BoatDatas_tmp.item_id;
        //   setTimeout(() => {
        //     this.GetNextBookingDaysByBoatId(BoatDatas_tmp.item_id);   
        //     console.log(this.Global_BoatId);
        //     this.GetNextBookingDaysByBoatId_display(BoatDatas_tmp.item_id);
        //     console.log(BoatDatas_tmp);
        //     this.Binding_partially_cancelled_days("Currentyear");
        //     this.getBoatDetails(BoatDatas_tmp.item_id);
        //   }, 2000);
          

        // }
 
         //var Filterboat = this.dropdownList.find(x => x._id == this.Global_BoatId);
    
         //sessionStorage.setItem("Owner_pg_boatListed",JSON.stringify(Filterboat));
         sessionStorage.setItem("Owner_pg_boatListed_Sheduler_tmp",JSON.stringify(this.Global_BoatId));

         var Filterboat = this.dropdownList.find(x => x._id == this.Global_BoatId);
    
         sessionStorage.setItem("Owner_pg_boatListed_Temp_List",JSON.stringify(Filterboat));


         $('.id-manual-reload').trigger('click');
         
       
         }, err => {
         
         })
   }
 


  Owner_Log_getallDropDownDatas_Boat(){     
   
   var owner_drp_Id = JSON.parse(sessionStorage.getItem("Ownerlogin"));
   
        
    this.dropdownList = [];       
   // this.set_BoatType = "";
      var obj = Object();
        obj.owner_id = owner_drp_Id._id;
      this.http.post<any>(`${this.url_Owner}GetBoatNameByOwnerId`, obj).subscribe(data => { 
        
                          
        var tempArry = [];
        var tempArry2 = [];
               
        data.response.forEach(element => {

          element.BoatDetails.forEach(element2 => {
            var obj2 = Object();
              obj2.item_id = element2._id,
              obj2.item_text = element2.Boat_Name
              tempArry.push(obj2);

              var obj3 = Object();
              obj3._id = element2._id,
              obj3.Boattype_Name = element2.Boattype_Name,
              obj3.Boat_Name = element2.Boat_Name
              tempArry2.push(obj3)

          });
              

        });
        this.dropdownList_filted = tempArry;
       // console.log(this.dropdownList_filted);
        this.dropdownList = tempArry2;

       
        sessionStorage.setItem("Owner_pg_boatListed",JSON.stringify(tempArry2));
       
        //  if(this.dropdownList_filted.length == 1)
        // { 
        //   this.singleboat = this.dropdownList_filted[0].item_text;
        //   var BoatDatas_tmp = this.dropdownList_filted[0];
        //   var Filterboat = this.dropdownList.find(x => x._id == BoatDatas_tmp.item_id);    
        //   sessionStorage.setItem("Owner_pg_boatListed",JSON.stringify(Filterboat));
        //   sessionStorage.setItem("AdminSelectBoat",JSON.stringify(Filterboat));
          
        //   this.current_Selected_Boat = BoatDatas_tmp;
        //  this.dropdownList_filted_model = this.dropdownList_filted;
        //  this.Global_BoatId = BoatDatas_tmp.item_id;
        //  setTimeout(() => {
        //    this.GetNextBookingDaysByBoatId(BoatDatas_tmp.item_id);   
        //    console.log(this.Global_BoatId);
        //    this.GetNextBookingDaysByBoatId_display(BoatDatas_tmp.item_id);
        //    console.log(BoatDatas_tmp);
        //    this.Binding_partially_cancelled_days("Currentyear");
        //    this.getBoatDetails(BoatDatas_tmp.item_id);
        //  }, 2000);
        // }

        if(this.dropdownList.length == 1)
        {
          

          /*
           var BoatDatas_tmp = this.dropdownList_filted[0];

           var Filterboat = this.dropdownList.find(x => x._id == BoatDatas_tmp.item_id);    
           sessionStorage.setItem("Owner_pg_boatListed",JSON.stringify(Filterboat));
           this.GetNextBookingDaysByBoatId(BoatDatas_tmp.item_id)    
           this.Global_BoatId = BoatDatas_tmp.item_id;
           console.log(this.Global_BoatId);
           this.getpendingDays_Calculation(BoatDatas_tmp.item_id);
           this.GetNextBookingDaysByBoatId_display(BoatDatas_tmp.item_id);


           this.dropdownList_filted_model = this.dropdownList_filted;
            $('.multiselect-dropdown').trigger('click');

            */
        }
        
        this.getViewBookingDetailsWithBoatAndOwner();




      
        }, err => {
        
        })
  }

  

  getviewbookingByOwnerId(){
    

    var currentDate = this.Jqueary_string_to_Date_Convert(this.getFormattedDate_WithOut_Zero_Time(new Date()));

    var owner_drp_Id = JSON.parse(sessionStorage.getItem("Ownerlogin"));
   
    let obj = {
      User_Id:owner_drp_Id._id
    }
   // Cancel booking for owner dashboard Done By Alagesan on 21.07.2021
   this.http.post<any>(`${this.urlViewBookingDetails}/ViewCancelledBookingById`, obj).subscribe(data => { 
    
    var tmpData_1 = data['response'];
    var tmpDta_2 =[];
    
      tmpData_1.forEach(element => {
      
        try{

          var obj = Object();
          obj.Boat_Image = element.BoatDetails[0].Boat_Image[0];
          obj.Booking_ID = element.Booking_ID;
          obj.Boat_Name  = element.BoatDetails[0].Boat_Name;
          obj.start      = element.start;
          obj.end        = element.end;
          obj._id        = element._id;

          var chekCancelDate = this.Jqueary_string_to_Date_Convert(this.getFormattedDate_WithOut_Zero_Time(obj.end));
          if(chekCancelDate > currentDate)
          {
            tmpDta_2.push(obj);
          }
          


        }catch{

        }
       

      });

     


      this.viewCancelBookingByOwnerIddata  = tmpDta_2;//[];//tmpData.filter();
      

      this.http.post<any>(`${this.urlViewBookingDetails}/ViewBookingById`, obj).subscribe(data => { 

        var tmpData_3 = data['response'];
        var tmpDta_4 =[];
       
      tmpData_3.forEach(element => {

        try{

          var obj = Object();
          obj.Boat_Image = element.BoatDetails[0].Boat_Image[0];
          obj.Booking_ID = element.Booking_ID;
          obj.Boat_Name  = element.BoatDetails[0].Boat_Name;
          obj.start      = element.start;
          obj.end        = element.end;
          obj._id        = element._id;

          var chekbookingDate = this.Jqueary_string_to_Date_Convert(this.getFormattedDate_WithOut_Zero_Time(obj.end));
          if(chekbookingDate > currentDate)
          {
            tmpDta_4.push(obj);
          }

         

        }catch{

        }

      });

        this.viewBookingByOwnerIddata  = tmpDta_4;//data['response'];

        this.GetAllUnAvailableDays();
      
      }, err => {

        $("#shown-loader-commen").css("display", "none");
       
      })


    }, err => {

      $("#shown-loader-commen").css("display", "none");
     
    })
   // Owner booking for owner dashboard Done By Alagesan on 21.07.2021
   
  }


  getViewBookingDetailsWithBoatAndOwner(){
   
    $("#shown-loader-commen").css("display", "block");
   // View booking details  API integrations for owner dashboard Done By Alagesan on 13.07.2021
    this.http.get<any>(`${this.urlViewBookingDetails}/ViewBookingDetailsWithBoatAndOwner`).subscribe(data => {
    
      this.viewBookingDetailsdata = data['response']
      

      this.getviewbookingByOwnerId();
      $("#shown-loader-commen").css("display", "none");
 
   }, err => {
    $("#shown-loader-commen").css("display", "none");
   })
  }

  locationReload(){
    
    this.getpendingDays_Calculation_Sheduler(this.Global_BoatId);
    

  }


  
  Jqueary_string_to_Date_Convert(dateString){   
       
    var dateArray = dateString.split("-");
    var dateObj = new Date(`${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`);
  
    return dateObj;

  }

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


  

getpendingDays_Calculation(boatId?)
  {
    
   // console.log(boatId);
    var current_month_year = this.passing_year_month();
    //Pre launch date and boat anniversary date for book for owner Done By Alagesan on 29.07.2021
    this.PENDING_SUMMER_WEEKDAYS = 0; 
    this.PENDING_SUMMER_WEEKENDS = 0;
    this.PENDING_WINTER_WEEKDAYS = 0;
    this.PENDING_WINTER_WEEKENDS = 0;
    this.boat_anniversary_date = "";
    this.pre_launch_date = "";
    // var Owner_tmp = JSON.parse(sessionStorage.getItem("Owner_SelectOwner")); 

    // var Boat_tmp = JSON.parse(sessionStorage.getItem("AdminSelectBoat")); 
    var owner_drp_Id = JSON.parse(sessionStorage.getItem("Ownerlogin"));
   
   // console.log(current_month_year);
    var Boat_tmp = JSON.parse(sessionStorage.getItem("Owner_pg_boatListed"));
   if(boatId){
    var obj = Object();
        obj.Owner_Id = owner_drp_Id._id;
        obj.Boat_Id = boatId;
        obj.year = current_month_year.year;
        obj.month = current_month_year.month;
       
      this.http.post<any>(`${this.url}GetAllPendingDaysOfOwner`, obj).subscribe(data => { 

      
       
        if(data.status == true){

          var dt = data.Response;
         
          var BookedDays = dt.BookedDays;

          if(BookedDays.length > 0)
          {          

          var AllocatedDays = dt.AllocatedDays;
        

          if(BookedDays[0].BoatDetails.length > 0){
            this.boat_anniversary_date = BookedDays[0].BoatDetails[0].Launch_Date;
            this.boat_anniversary_datemonth =this.boatAnniversaryDateYearly(this.boat_anniversary_date);
            this.pre_launch_date = BookedDays[0].BoatDetails[0].PreLaunch_Date;
            console.log(this.pre_launch_date);
            const d2 = new Date(this.pre_launch_date);
            console.log(d2);
            if(new Date() > d2){
              console.log('greater');
              this.isgreater = false;
            } else {
              this.isgreater = true;
            }
          
          }
          if(BookedDays.length == 0){
          this.PENDING_SUMMER_WEEKDAYS = AllocatedDays[0].Summer_WeekDays ; 
          this.PENDING_SUMMER_WEEKENDS = AllocatedDays[0].Summer_WeekEndDays ;
          this.PENDING_WINTER_WEEKDAYS = AllocatedDays[0].Winter_WeekDays ;
          this.PENDING_WINTER_WEEKENDS = AllocatedDays[0].Winter_WeekEndDays ;

          }
          
          else{

          this.PENDING_SUMMER_WEEKDAYS = AllocatedDays[0].Summer_WeekDays - BookedDays[0].Summer_WeekDays; 
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

        }
        else
        {
          var AllocatedDays = dt.AllocatedDays;

          this.PENDING_SUMMER_WEEKDAYS = AllocatedDays[0].Summer_WeekDays ; 
          this.PENDING_SUMMER_WEEKENDS = AllocatedDays[0].Summer_WeekEndDays ;
          this.PENDING_WINTER_WEEKDAYS = AllocatedDays[0].Winter_WeekDays ;
          this.PENDING_WINTER_WEEKENDS = AllocatedDays[0].Winter_WeekEndDays ;

          this.boat_anniversary_date = AllocatedDays[0].Launch_Date;
          this.boat_anniversary_datemonth =this.boatAnniversaryDateYearly(this.boat_anniversary_date);
           
          this.pre_launch_date = AllocatedDays[0].PreLaunch_Date;
          const d2 = new Date(this.pre_launch_date);
            console.log(d2);
            if(new Date() > d2){
              console.log('greater');
              this.isgreater = false;
            } else {
              this.isgreater = true;
            }
          console.log(this.pre_launch_date);

        }




        var obj_days = Object();

          obj_days.PENDING_SUMMER_WEEKDAYS = this.PENDING_SUMMER_WEEKDAYS; 
          obj_days.PENDING_SUMMER_WEEKENDS =this.PENDING_SUMMER_WEEKENDS;
          obj_days.PENDING_WINTER_WEEKDAYS =this.PENDING_WINTER_WEEKDAYS;
          obj_days.PENDING_WINTER_WEEKENDS = this.PENDING_WINTER_WEEKENDS;

          sessionStorage.setItem("daysMoreDan",JSON.stringify(obj_days));


          this.getpendingDays_Calculation_second(boatId);
         


        }
        else{
          
          this.commenMessages = "data not fount";
          $('#btn-CommenMessage-disp-btns_angular').trigger('click');
        }
        
        
       
      
        }, err => {
         
        })
    
      }
  }

  getpendingDays_Calculation_second(boatId?)
  {
    
   // console.log(boatId);
    var current_month_year = this.passing_year_month_second();
    //Pre launch date and boat anniversary date for book for owner Done By Alagesan on 29.07.2021
      
    this.PENDING_SUMMER_WEEKDAYS_second = 0; 
    this.PENDING_SUMMER_WEEKENDS_second = 0;
    this.PENDING_WINTER_WEEKDAYS_second = 0;
    this.PENDING_WINTER_WEEKENDS_second = 0;
    // this.boat_anniversary_date = "";
    // this.pre_launch_date = "";
    // var Owner_tmp = JSON.parse(sessionStorage.getItem("Owner_SelectOwner")); 

    // var Boat_tmp = JSON.parse(sessionStorage.getItem("AdminSelectBoat")); 
    var owner_drp_Id = JSON.parse(sessionStorage.getItem("Ownerlogin"));
   
    
    var Boat_tmp = JSON.parse(sessionStorage.getItem("Owner_pg_boatListed"));
   if(boatId){
    var obj = Object();
        obj.Owner_Id = owner_drp_Id._id;
        obj.Boat_Id = boatId;
        obj.year = current_month_year.year;
        obj.month = current_month_year.month;
       
      this.http.post<any>(`${this.url}GetAllPendingDaysOfOwner`, obj).subscribe(data => { 

      
       
        if(data.status == true){

          var dt = data.Response;
         
          var BookedDays = dt.BookedDays;
          var AllocatedDays = dt.AllocatedDays;

          // if(BookedDays.length > 0)
          // {          

          // var AllocatedDays = dt.AllocatedDays;
        

          // if(BookedDays[0].BoatDetails.length > 0){
          //   this.boat_anniversary_date = BookedDays[0].BoatDetails[0].Launch_Date;
           
          //   this.pre_launch_date = BookedDays[0].BoatDetails[0].PreLaunch_Date;
          
          // }
          if(BookedDays.length == 0){
            this.PENDING_SUMMER_WEEKDAYS_second = AllocatedDays[0].Summer_WeekDays ; 
            this.PENDING_SUMMER_WEEKENDS_second = AllocatedDays[0].Summer_WeekEndDays ;
            this.PENDING_WINTER_WEEKDAYS_second = AllocatedDays[0].Winter_WeekDays ;
            this.PENDING_WINTER_WEEKENDS_second = AllocatedDays[0].Winter_WeekEndDays ;
          }  else{

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

          
        //   else{

        //   this.PENDING_SUMMER_WEEKDAYS = AllocatedDays[0].Summer_WeekDays - BookedDays[0].Summer_WeekDays; 
        //   this.PENDING_SUMMER_WEEKENDS = AllocatedDays[0].Summer_WeekEndDays - BookedDays[0].Summer_WeekEndDays;
        //   this.PENDING_WINTER_WEEKDAYS = AllocatedDays[0].Winter_WeekDays - BookedDays[0].Winter_WeekDays;
        //   this.PENDING_WINTER_WEEKENDS = AllocatedDays[0].Winter_WeekEndDays - BookedDays[0].Winter_WeekEndDays;
          
        
        //   if(this.PENDING_SUMMER_WEEKDAYS < 0){
        //     this.PENDING_SUMMER_WEEKDAYS = 0;
        //   }

        //   if(this.PENDING_SUMMER_WEEKENDS < 0){
        //     this.PENDING_SUMMER_WEEKENDS = 0;
        //   }
        //   if(this.PENDING_WINTER_WEEKDAYS < 0){
        //     this.PENDING_WINTER_WEEKDAYS = 0;
        //   }

        //   if(this.PENDING_WINTER_WEEKENDS < 0){
        //     this.PENDING_WINTER_WEEKENDS = 0;
        //   }
          
        
        // }

       // }
        // else
        // {
        //   var AllocatedDays = dt.AllocatedDays;

        //   this.PENDING_SUMMER_WEEKDAYS = AllocatedDays[0].Summer_WeekDays ; 
        //   this.PENDING_SUMMER_WEEKENDS = AllocatedDays[0].Summer_WeekEndDays ;
        //   this.PENDING_WINTER_WEEKDAYS = AllocatedDays[0].Winter_WeekDays ;
        //   this.PENDING_WINTER_WEEKENDS = AllocatedDays[0].Winter_WeekEndDays ;

        //   this.boat_anniversary_date = AllocatedDays[0].Launch_Date;
           
        //   this.pre_launch_date = AllocatedDays[0].PreLaunch_Date;

        // }


         


        }
        else{
          
          this.commenMessages = "data not fount";
          $('#btn-CommenMessage-disp-btns_angular').trigger('click');
        }
        
        
       
      
        }, err => {
         
        })
    
      }
  }

  getpendingDays_Calculation_Sheduler(boatId)
  {
        
    //Pre launch date and boat anniversary date for book for owner Done By Alagesan on 29.07.2021
    this.PENDING_SUMMER_WEEKDAYS = 0; 
    this.PENDING_SUMMER_WEEKENDS = 0;
    this.PENDING_WINTER_WEEKDAYS = 0;
    this.PENDING_WINTER_WEEKENDS = 0;
    this.boat_anniversary_date = "";
    this.pre_launch_date = "";

    var current_month_year = this.passing_year_month();


    // var Owner_tmp = JSON.parse(sessionStorage.getItem("Owner_SelectOwner")); 

    // var Boat_tmp = JSON.parse(sessionStorage.getItem("AdminSelectBoat")); 
    var owner_drp_Id = JSON.parse(sessionStorage.getItem("Ownerlogin"));
   
    
    var Boat_tmp = JSON.parse(sessionStorage.getItem("Owner_pg_boatListed"));
   
    // var obj = Object();
    //     obj.Owner_Id = owner_drp_Id._id;
    //     obj.Boat_Id = boatId;


    if(boatId){
      var obj = Object();
          obj.Owner_Id = owner_drp_Id._id;
          obj.Boat_Id = boatId;
          obj.year = current_month_year.year;
          obj.month = current_month_year.month;

       
      this.http.post<any>(`${this.url}GetAllPendingDaysOfOwner`, obj).subscribe(data => { 

     
       
        if(data.status == true){

          var dt = data.Response;
         
          var BookedDays = dt.BookedDays;

          if(BookedDays.length > 0)
          {          

          var AllocatedDays = dt.AllocatedDays;
        

          if(BookedDays[0].BoatDetails.length > 0){
            this.boat_anniversary_date = BookedDays[0].BoatDetails[0].Launch_Date;
            this.boat_anniversary_datemonth =this.boatAnniversaryDateYearly(this.boat_anniversary_date);
           
            this.pre_launch_date = BookedDays[0].BoatDetails[0].PreLaunch_Date;
            console.log(this.pre_launch_date);
            const d2 = new Date(this.pre_launch_date);
            console.log(d2);
            if(new Date() > d2){
              console.log('greater');
              this.isgreater = false;
            } else {
              this.isgreater = true;
            }
          
          }
          if(BookedDays.length == 0){
          this.PENDING_SUMMER_WEEKDAYS = AllocatedDays[0].Summer_WeekDays ; 
          this.PENDING_SUMMER_WEEKENDS = AllocatedDays[0].Summer_WeekEndDays ;
          this.PENDING_WINTER_WEEKDAYS = AllocatedDays[0].Winter_WeekDays ;
          this.PENDING_WINTER_WEEKENDS = AllocatedDays[0].Winter_WeekEndDays ;

          }
          
          else{

          this.PENDING_SUMMER_WEEKDAYS = AllocatedDays[0].Summer_WeekDays - BookedDays[0].Summer_WeekDays; 
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

        }
        else
        {
          var AllocatedDays = dt.AllocatedDays;

          this.PENDING_SUMMER_WEEKDAYS = AllocatedDays[0].Summer_WeekDays ; 
          this.PENDING_SUMMER_WEEKENDS = AllocatedDays[0].Summer_WeekEndDays ;
          this.PENDING_WINTER_WEEKDAYS = AllocatedDays[0].Winter_WeekDays ;
          this.PENDING_WINTER_WEEKENDS = AllocatedDays[0].Winter_WeekEndDays ;

          this.boat_anniversary_date = AllocatedDays[0].Launch_Date;
          this.boat_anniversary_datemonth =this.boatAnniversaryDateYearly(this.boat_anniversary_date);
           
          this.pre_launch_date = AllocatedDays[0].PreLaunch_Date;
          const d2 = new Date(this.pre_launch_date);
            console.log(d2);
            if(new Date() > d2){
              console.log('greater');
              this.isgreater = false;
            } else {
              this.isgreater = true;
            }

        }




        var obj_days = Object();

          obj_days.PENDING_SUMMER_WEEKDAYS = this.PENDING_SUMMER_WEEKDAYS; 
          obj_days.PENDING_SUMMER_WEEKENDS =this.PENDING_SUMMER_WEEKENDS;
          obj_days.PENDING_WINTER_WEEKDAYS =this.PENDING_WINTER_WEEKDAYS;
          obj_days.PENDING_WINTER_WEEKENDS = this.PENDING_WINTER_WEEKENDS;

          sessionStorage.setItem("daysMoreDan",JSON.stringify(obj_days));

          this.Owner_Log_getallDropDownDatas_Boat_shaedulerBase();
         


        }
        else{
          
          this.commenMessages = "data not fount";
          $('#btn-CommenMessage-disp-btns_angular').trigger('click');
        }
        
        
       
      
        }, err => {
         
        })

      }
    

  }


 
  
  Canceld_Booking_check(booking){
    try
    {
      $("#shown-loader-commen").css("display", "block");
     
     
      var obj = Object();
        obj._id = booking._id;        
      this.http.post<any>(`${this.urlViewBookingDetails}/DeleteScheduleForOwner`, obj).subscribe(results => {           
        if(results.status == true)
        {
         
         
          this.ConformationMessage = results.message;
          this.Conformation_Id = booking._id;

          this.getViewBookingDetailsWithBoatAndOwner();
          $("#shown-loader-commen").css("display", "none");
          $('#btn-Cancel-Booking-Conformation').trigger('click');
           
        }
                
      
        }, err => {

          $("#shown-loader-commen").css("display", "none");
        
        })


    }
    catch(ex)
    {
     
    }
  }


  Canceld_Booking_Confirm_OK(id){
    try
    {
      

      //dynamicaly-close-btn
      $('#dynamicaly-close-btn').trigger('click');

        var obj = Object();
        obj._id = id;
        obj.User_RoleType = "Owner";

      this.http.post<any>(`${this.urlViewBookingDetails}/DeleteSchedule`, obj).subscribe(results => {           
        if(results.status == true)
        {
          
          //this.ConformationMessage = results.message;
          //this.Conformation_Id = booking._id;
          this.commenMessages =results.message;

          $('#btn-CommenMessage-delete-msg').trigger('click');
           
        }
                
      
        }, err => {
         
        })


    }
    catch(ex)
    {
      
    }
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
            obj.Boat_Id =  val.Boat_Id;//a1.toString();
            obj.Boat_Name = val.Boat_Name;//a2.toString();
            obj.UnAvailableDates = val.UnAvailableDates;
            obj._id = val._id;
            tmp_arry_1.push(obj);
  
          });
          sessionStorage.setItem("GetUnAvailabeDaysOfBoats_Owners",JSON.stringify(tmp_arry_1));
           
         }    
    
      }, err => {
        $("#shown-loader-commen").css("display", "none");
      })
  
    
      }, err => {
        $("#shown-loader-commen").css("display", "none");
      })
  
      
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
          //this.Bookingform.get('Next_BookingDay').setValue(temp_res[0].Next_BookingDay);
  
          
        }
        else if(data.status == false){
        }
          }, err => {
           
          })
    }
      

     adding_MultipleDays(numberOfdays,Launch_Date,createdDaste){
      
      var launch_date_temp = new Date(Launch_Date);
      var newdate = new Date();
      var created_date = null; 
         
  
      if(launch_date_temp < newdate){
        //////api next start.......
  
        if(createdDaste != null){
         // created_date =  new Date(createdDaste.Current_Time);
         created_date =  new Date();

         
          if(launch_date_temp < created_date)
          {
            created_date.setDate(created_date.getDate() + numberOfdays);
            return new Date(created_date);
  
          }
          else
          {
            newdate.setDate(newdate.getDate() + numberOfdays);
            return new Date(newdate);
  
          }
    
        }
        else
        {
          newdate.setDate(newdate.getDate() + numberOfdays);
          return new Date(newdate);
        } 
        
  
  
        
      }
      else
      {
        launch_date_temp.setDate(launch_date_temp.getDate() + numberOfdays );
        return new Date(launch_date_temp);
  
      }
      
     }
     passing_year_month_second(){


      let obj = {
        year : this.spn_years,
        month : new Date(this.boat_anniversary_date).getMonth() + 2
      }
  
      return obj
  
    }
  
     currentYearSet(){

      let dt = new Date();
      this.spn_years = dt.getFullYear();
  
    }
  
  
  
    totaldays_PreVious(boatId){
  
      this.spn_years = this.spn_years - 1;
      this.getpendingDays_Calculation_second(boatId);
  
    }
  
    totaldays_Next(boatId){
      console.log(new Date(this.boat_anniversary_date).getMonth() + 1);
      this.spn_years = this.spn_years + 1;
      this.getpendingDays_Calculation_second(boatId);
  
    }
    
      boatAnniversaryDateYearly(date){
        let formatedDate = this.Days_Genarator(new Date(date));
        return (formatedDate.day < 10 ? '0'+formatedDate.day : formatedDate.day )+'-'+formatedDate.month_Number;
      }
      Days_Genarator(data){ 
      //var result = [];
      var days = ['Su','Mo','Tu','We','Th','Fr','Sa'];
      var monthNames = [ "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December" ];
      var monthNames_Number = [ "01", "02", "03", "04", "05", "06",
          "07", "08", "09", "10", "11", "12" ];
  
            
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
  
      return obj.day +"-"+ obj.month_Number +"-"+ obj.year;
  
    }

    Tab_Data_Binding(){
      this.getViewBookingDetailsWithBoatAndOwner();
    }


    generate_partially_cancelled_days_Next(){
      var passing = "Next";
      this.Binding_partially_cancelled_days(passing);
    }
    generate_partially_cancelled_days_PreVious(){
      var passing = "PreVious";
      this.Binding_partially_cancelled_days(passing);
    }

    
    Binding_partially_cancelled_days(passing){

     

      var get_OWNER_Details = JSON.parse(sessionStorage.getItem("Ownerlogin")); 
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
              Owner_Id: get_OWNER_Details._id,
              Boat_Id: get_boat_Data.item_id,
              Cancellationyear:renderRange
            };
      
            this.http.post<any>(`${this.url_Suspend}PartialDaysCount`,  obj  ).subscribe(data => {            
            
            if(data.status == true){

              this.partialcancelldays = data.cancelcount;
              this.getpendingDays_Calculation(this.Global_BoatId);
      
            }
            else{
              this.partialcancelldays = 0;
              this.getpendingDays_Calculation(this.Global_BoatId);
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
    

//CurrentYear
  



}

// Create Component for owner dashboard //Done By Alagesan on 17.05.2021
