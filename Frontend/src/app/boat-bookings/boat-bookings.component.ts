import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormGroup, FormControl,FormBuilder, Validators} from '@angular/forms';
// import environment for boat bookings Done By Alagesan	on 06.07.2021
import { environment } from '../../environments/environment';
declare var $: any;
declare var jQuery: any; 
@Component({
  selector: 'app-boat-bookings',
  templateUrl: './boat-bookings.component.html',
  styleUrls: ['./boat-bookings.component.css']
})
// Create Component for boat bookings//Done By Alagesan on 20.05.2021
export class BoatBookingsComponent implements OnInit {
  // Add Base URL for boat bookings  Done By Alagesan	on 06.07.2021
  EnvironmentURL:string = environment.url;
  BookingUrl = this.EnvironmentURL+"api/Schedule";
  imagePath= this.EnvironmentURL+"api/uploads/";
  url = this.EnvironmentURL+"api/Boat";
  standByBooking = this.EnvironmentURL+"api/StandByBooking";
  //url = this.EnvironmentURL+"hapi/Schedule"

  bookingInfo: any;
  bookingInfo_Admin:any;

  bookingInfo_Admin_orginal:any;

  bookingInfo_Maintenance: any;
  bookingInfo_Maintenance_orginal:any;

  bookingInfo_Maintenance_Second: any;
  searchLoction: any = '';
  searchLoctions: any = '';
  CommenMessages:any;

  previousDate:any;
  launchDate:any;
  launchDates: string;
  preLaunchDates: string;
  form: FormGroup;
  boatbookingform: FormGroup;
  submitted = false;
  LanchTYpe: any;
  allBookings: any;

  Location_Name_dropDown: any = "Location";
  Launch_Date_DropDown: any = "Launch Date";
  AllBookig_pastBooking_CurrentBooking: any = "All Booking";
  adminlogin: any;
  loctions: any=[];
  AllBookings_pastBooking_CurrentBooking_Array: any=[];
  bookingPushData: any=[];
  bookingDatas: any=[];
  listBooking: any=[];
  Stand_by_Booking: any=[];
  Stand_by_Booking_orginal: any=[];
  Stand_by_Booking_Completed: any=[];

  Public_Stand_by_Booking: any = []; 
  public_Stand_by_Booking_Completed: any = []; 

  datas_log:any;
  permissions:any;

  Booking= false;
  StandByBooking= false;
  BoatBookings= false;
  BookingAdminBooking= false;
  BookingMaintenanceBooking= false;

  constructor(private http: HttpClient, private fb: FormBuilder, private router: Router,) { }

// Create Component for boat bookings//Done By Alagesan on 20.05.2021
  ngOnInit(): void {

    $(".mobile-menu-icon").click(function(){
      $(".side-menu").toggleClass("mobile-sidebar");
    });
    
    this.adminlogin = JSON.parse(sessionStorage.getItem("adminLogin"));
    if(this.adminlogin == false){
      this.router.navigate(['/session-Expire']); 
    }
    else if(this.adminlogin == null){
      this.router.navigate(['']);
    }


    this.boatbookingform = this.fb.group({
      Datetype: new FormControl('', [Validators.required,]),
    Launch_Date1: new FormControl('', [Validators.required,]),
    Launch_Date2: new FormControl('', []),
    });

    sessionStorage.setItem("relodePg_book-for-owner","1");
    sessionStorage.setItem("Adminbooking-relodePg","1");
    sessionStorage.setItem("boat-maintenance-reload","1");
    sessionStorage.setItem("view-boat-reload","1");
    this.permissions_menuItems();

  

  $('#datepicker-1-boat-bookings').Zebra_DatePicker({
    format: 'd/m/Y',
    pair: $('#datepicker-2-boat-bookings')
    

});

$('#datepicker-2-boat-bookings').Zebra_DatePicker({
  format: 'd/m/Y'

});
 
this.getBooking();
this.getLoction();
this.AllBooking_past_Current_fun();
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

    this.Booking= true;
    this.StandByBooking=true;
    this.BoatBookings= true;
    this.BookingAdminBooking= true;
    this.BookingMaintenanceBooking= true;
    
  }

  SubAdmin(permis){
    
    this.Booking= permis.BoatBooking.Booking;
    this.StandByBooking= permis.BoatBooking.StandByBooking;
    this.BoatBookings= permis.BoatBooking.BoatBookings;
    this.BookingAdminBooking= permis.BoatBooking.BookingAdminBooking;
    this.BookingMaintenanceBooking= permis.BoatBooking.BookingMaintenanceBooking;
    
  }



  //...............................



  getLoction(){
    this.http.get<any>(`${this.url}/GetLocation`).subscribe(data => {
     
  this.loctions = data['response']
  
   }, err => {
   })
  }
  setLanDates(obj){

    


    this.LanchTYpe = obj

    this.Launch_Date_DropDown = obj

   

  }
  

  getSearchData(){

    this.submitted = true;
    this.boatbookingform.get('Datetype').setValue(this.LanchTYpe);
    // this.boatbookingform.get('Launch_Date1').setValue(this.launchDates);
    // this.boatbookingform.get('Launch_Date2').setValue(this.preLaunchDates);

  
    if (this.boatbookingform.invalid) {
      return;
  }
   this.listBooking =[]
   this.bookingInfo=[]
    this.http.post<any>(`${this.BookingUrl}/ViewBookingDetailsFilterByDates`,  this.boatbookingform.value   ).subscribe(data => {
      this.bookingInfo = data['response']
     

      this.bookingInfo.forEach(element => {         
        if(element.BoatDetails.length==0){
  
        }else{
           this.listBooking.push(element);
  
        }
  
      });

this.bookingInfo = this.listBooking



        }, err => {
          
        })

  }
  
  getBooking(){
    this.http.get<any>(`${this.BookingUrl}/ViewBookingDetailsWithBoatAndOwner`).subscribe(data => {
    
    this.bookingInfo = data['response'];
    this.bookingDatas = this.bookingInfo
   
    this.bookingInfo_Admin = this.bookingInfo.filter(x => x.User_RoleType == "Admin" && x.Is_StandByBooking != true);
    this.bookingInfo_Maintenance = this.bookingInfo.filter(x => x.User_RoleType == "Maintenance");
    this.bookingInfo.forEach(element => {

      var tmp1 = element.BoatDetails[0].Boat_Number.toString();
      var tmp2 = element.Booking_ID.toString();
      var temp3 = tmp1+"/"+tmp2;

      element.bookingInformation = temp3;
      
    });

    this.bookingInfo_Admin.forEach(element => {

      
     // if(element.Is_StandByBooking != true){

          var tmp1 = element.BoatDetails[0].Boat_Number.toString();
          var tmp2 = element.Booking_ID.toString();
          var temp3 = tmp1+"/"+tmp2;
          element.bookingInformation = temp3;

      
      
    });

    this.bookingInfo_Admin_orginal = this.bookingInfo_Admin;

    this.bookingInfo_Maintenance.forEach(element => {

      var tmp1 = element.BoatDetails[0].Boat_Number.toString();
      var tmp2 = element.Booking_ID.toString();
      var temp3 = tmp1+"/"+tmp2;

      element.bookingInformation = temp3;
      
    });

  
    this.bookingInfo_Maintenance_Second = this.bookingInfo_Maintenance;
    this.bookingInfo_Maintenance_orginal = this.bookingInfo_Maintenance;

    //////////////////////////

    this.http.get<any>(`${this.standByBooking}/ViewStandByBooking`).subscribe(data => {
     

    //this is Start..........
    var standByBooking = data['response'];
    

    standByBooking.forEach(element => {
       
    if(element.IsActive == true){

      var obj_s = Object();

      if(element.BoatDetails.length !== 0){

        obj_s._Id = element._id;
      obj_s.Boat_Image = element.BoatDetails[0].Boat_Image[0];
      obj_s.imgUrl = this.imagePath + element.BoatDetails[0].Boat_Image[0];
      obj_s.Boat_Name = element.BoatDetails[0].Boat_Name;
      obj_s.start = element.start;
      obj_s.Boat_Id =  element.BoatDetails[0]._id;
      obj_s.end = element.end;
      obj_s.Booking_ID = element.Booking_ID;

      obj_s.Boat_Number = element.BoatDetails[0].Boat_Number;
      obj_s._id = element._id;
      obj_s.Location_Name = element.BoatDetails[0].Location_Name;
      obj_s.Location_Id = element.BoatDetails[0].Location_Id;
      obj_s.BookingStatus = element.BookingStatus;

      if(element.OwnerDetails.length !== 0){

        obj_s.First_Name = element.OwnerDetails[0].First_Name;
        obj_s.Parking_Ability = element.OwnerDetails[0].Parking_Ability;
        obj_s.Housekeeping = element.OwnerDetails[0].Housekeeping;
        obj_s.Sailing_Ability = element.OwnerDetails[0].Sailing_Ability;
        obj_s.OwnerDetails = element.OwnerDetails[0];

      } 

      this.Stand_by_Booking.push(obj_s);


      }      


    }

    

    });

    standByBooking.forEach(element => {
       
       if(element.IsActive == false){
   
         var obj_s = Object();
   
         if(element.BoatDetails.length !== 0){
   
           obj_s._Id = element._id;
         obj_s.Boat_Image = element.BoatDetails[0].Boat_Image[0];
         obj_s.imgUrl = this.imagePath + element.BoatDetails[0].Boat_Image[0];
         obj_s.Boat_Name = element.BoatDetails[0].Boat_Name;
         obj_s.start = element.start;
         obj_s.Boat_Id =  element.BoatDetails[0]._id;
         obj_s.end = element.end;
         obj_s.Booking_ID = element.Booking_ID;
   
         obj_s.Boat_Number = element.BoatDetails[0].Boat_Number;
         obj_s._id = element._id;
         obj_s.Location_Name = element.BoatDetails[0].Location_Name;
         obj_s.Location_Id = element.BoatDetails[0].Location_Id;
         obj_s.BookingStatus = element.BookingStatus;
   
         if(element.OwnerDetails.length !== 0){
   
           obj_s.First_Name = element.OwnerDetails[0].First_Name;
           obj_s.Parking_Ability = element.OwnerDetails[0].Parking_Ability;
           obj_s.Housekeeping = element.OwnerDetails[0].Housekeeping;
           obj_s.Sailing_Ability = element.OwnerDetails[0].Sailing_Ability;
           obj_s.OwnerDetails = element.OwnerDetails[0];
   
         } 
   
         this.Stand_by_Booking_Completed.push(obj_s);
   
   
         }      
   
   
       }
   
       
   
       });


       this.Stand_by_Booking.forEach(element => {

        var tmp1 =element.Boat_Number.toString();
        var tmp2 = element.Booking_ID.toString();
        var temp3 = tmp1+"/"+tmp2;
  
        element.bookingInformation = temp3;
        
      });


       this.Public_Stand_by_Booking = this.Stand_by_Booking;
       this.public_Stand_by_Booking_Completed = this.Stand_by_Booking;
       
       this.Stand_by_Booking_orginal = this.Stand_by_Booking;
       
       this.public_Stand_by_Booking_Completed.forEach(element => {

        var tmp1 =element.Boat_Number.toString();
        var tmp2 = element.Booking_ID.toString();
        var temp3 = tmp1+"/"+tmp2;
  
        element.bookingInformation = temp3;
        
      });
   


    ////End................... Stand_by_Booking_Completed

   
  
   

   }, err => {
   })


    ////////////////////





   }, err => {
   })
  }

  
 getFormattedDate_WithOut_Zero_Time(dateVal) {
   
  var newDate = new Date(dateVal);

  var sMonth = this.padValue(newDate.getMonth() + 1);
  var sDay = this.padValue(newDate.getDate());
  var sYear = newDate.getFullYear();  
    
  return sYear + "/" + sMonth + "/" + sDay;
}

 


AllBooking_past_Current_fun()
{

  var dats =
  {
    "status":true,
    "response":
    [
      {
        _id:"1001",
        booking_type:"All Booking",
        booking_Type_Filter:true
        
      },
      {
        _id:"1002",
        booking_type:"Current booking",
        booking_Type_Filter:true
      },
      {
        _id:"1003",
        booking_type:"Past Booking",
        booking_Type_Filter:true
      }
    ]
  }
  

  this.AllBookings_pastBooking_CurrentBooking_Array = dats['response'];

}



  getLoctionTypeId(ids){
        
    this.bookingPushData =[];
    var Stand_by_Booking_Temp =[];
    var Stand_by_Booking_Completed =[];
    this.searchLoction ="";

    var bookingInfo_Admin_temp = [];
    var bookingInfo_Maintenance_tmp = [];

    this.bookingInfo_Admin = this.bookingInfo_Admin_orginal;
    this.bookingInfo_Maintenance = this.bookingInfo_Maintenance_orginal;
    this.Stand_by_Booking = this.Stand_by_Booking_orginal;


    if(ids.booking_Type_Filter == true){

      var currwntDate_stringFormate = new Date().toString();
      var currentDate = new Date(this.getFormattedDate_WithOut_Zero_Time(currwntDate_stringFormate));
      this.Location_Name_dropDown = "Location";

     this.AllBookig_pastBooking_CurrentBooking = ids.booking_type;
     this.bookingDatas.forEach(boat => {      
       if(ids._id == "1002"){ 
         var endDate = new Date(this.getFormattedDate_WithOut_Zero_Time(boat.end));
         if(currentDate <= endDate){

            this.bookingPushData.push(boat)

         }                 
       }
       else if(ids._id == "1003")
       {

        

        var endDate = new Date(this.getFormattedDate_WithOut_Zero_Time(boat.end));
         if(currentDate > endDate){

            this.bookingPushData.push(boat)

         }   

       }
       else{

        this.bookingPushData.push(boat);

       }
     });

     this.Public_Stand_by_Booking.forEach(boat1 => {      
      if(ids._id == "1002"){ 
        var endDate = new Date(this.getFormattedDate_WithOut_Zero_Time(boat1.end));
        if(currentDate <= endDate){      

         Stand_by_Booking_Temp.push(boat1);

        }        
       }
       else if(ids._id == "1003"){
        var endDate = new Date(this.getFormattedDate_WithOut_Zero_Time(boat1.end));
        if(currentDate > endDate){

          Stand_by_Booking_Temp.push(boat1);
        
        }

       }
       else{

        Stand_by_Booking_Temp.push(boat1);
         
      }
     });

     this.public_Stand_by_Booking_Completed.forEach(boat1 => {      
      if(ids._id == "1002"){  
        var endDate = new Date(this.getFormattedDate_WithOut_Zero_Time(boat1.end));
        if(currentDate <= endDate){       

         Stand_by_Booking_Completed.push(boat1); 

        }       
       }
       else if(ids._id == "1003"){

        var endDate = new Date(this.getFormattedDate_WithOut_Zero_Time(boat1.end));
        if(currentDate > endDate){

          Stand_by_Booking_Completed.push(boat1);


        }

       }
       else{

        Stand_by_Booking_Completed.push(boat1);
         
      }
     });


     ////New items



     this.bookingInfo_Admin.forEach(boat => {      
      if(ids._id == "1002"){ 
        var endDate = new Date(this.getFormattedDate_WithOut_Zero_Time(boat.end));
        if(currentDate <= endDate){

           bookingInfo_Admin_temp.push(boat)

        }                 
      }
      else if(ids._id == "1003")
      {

       

       var endDate = new Date(this.getFormattedDate_WithOut_Zero_Time(boat.end));
        if(currentDate > endDate){

          bookingInfo_Admin_temp.push(boat)

        }   

      }
      else{

        bookingInfo_Admin_temp.push(boat);

      }
    });


    this.bookingInfo_Maintenance.forEach(boat => {      
      if(ids._id == "1002"){ 
        var endDate = new Date(this.getFormattedDate_WithOut_Zero_Time(boat.end));
        if(currentDate <= endDate){

          bookingInfo_Maintenance_tmp.push(boat)

        }                 
      }
      else if(ids._id == "1003")
      {

       

       var endDate = new Date(this.getFormattedDate_WithOut_Zero_Time(boat.end));
        if(currentDate > endDate){

          bookingInfo_Maintenance_tmp.push(boat)

        }   

      }
      else{

        bookingInfo_Maintenance_tmp.push(boat);

      }
    });

     


       //Location_Id

       debugger;

       this.Stand_by_Booking = Stand_by_Booking_Temp;
       this.Stand_by_Booking_Completed = Stand_by_Booking_Completed;

         
       

       this.bookingInfo = this.bookingPushData
       this.bookingInfo_Admin = bookingInfo_Admin_temp;
       this.bookingInfo_Maintenance = bookingInfo_Maintenance_tmp;







    }
    else{

      this.AllBookig_pastBooking_CurrentBooking = "All Booking";

        this.Location_Name_dropDown = ids.Boat_Location;
        this.bookingDatas.forEach(boat => {      
          if(ids._id == boat.BoatDetails[0].Location_Id){      

            this.bookingPushData.push(boat)        
          }
        });

        this.Public_Stand_by_Booking.forEach(boat1 => {      
          if(ids._id == boat1.Location_Id){      

            Stand_by_Booking_Temp.push(boat1)        
          }
        });

        this.public_Stand_by_Booking_Completed.forEach(boat1 => {      
          if(ids._id == boat1.Location_Id){      

            Stand_by_Booking_Completed.push(boat1)        
          }
        });


        //new.............

        this.bookingInfo_Admin.forEach(boat => {      
          if(ids._id == boat.BoatDetails[0].Location_Id){      

            bookingInfo_Admin_temp.push(boat);        
          }
        });

        this.bookingInfo_Maintenance.forEach(boat => {      
          if(ids._id == boat.BoatDetails[0].Location_Id){      

            bookingInfo_Maintenance_tmp.push(boat);        
          }
        });




          //Location_Id
          this.Stand_by_Booking = Stand_by_Booking_Temp;
          this.Stand_by_Booking_Completed = Stand_by_Booking_Completed;

            
          this.bookingInfo_Maintenance = bookingInfo_Maintenance_tmp;
          this.bookingInfo_Admin = bookingInfo_Admin_temp;
          this.bookingInfo = this.bookingPushData

  }

  }


  // Location dropdown clear for boat bookings  //Done By Alagesan on 25.06.2021	
  pageRefresh(){
    location.reload();
  }


  
  Stand_by_Booking_Accept(datas){    

    var obj = Object();
    obj._id = datas._Id;
    obj.action_todo = "Accept";       

    this.http.post<any>(`${this.BookingUrl}/StandByBooking_AcceptReject`,  obj  ).subscribe(data => {
    
      if(data.status == true)
      {
        //alert("Booking is Accepted");
        //location.reload(); 
        this.CommenMessages = data.message;
        $('#btn-CommenMessage-save-disp-btns').trigger('click');
            
        
      }
      else if(data.status == false)
      {
        //alert("No responce");
        this.CommenMessages =  data.message;
        $('#btn-CommenMessage-save-disp-btns').trigger('click');

      }
        }, err => {

         // alert(err.message);
         
        })


  }

 
  Stand_by_Booking_Reject(datas){
    
    var obj = Object();
    obj._id = datas._Id;
    obj.action_todo = "Reject";       

    this.http.post<any>(`${this.BookingUrl}/StandByBooking_AcceptReject`,  obj  ).subscribe(data => {
    
      if(data.status == true)
      {
        //alert("Booking is Reject");
       // location.reload();
       this.CommenMessages ="This standby booking has been rejected.";
       $('#btn-CommenMessage-save-disp-btns').trigger('click');      
        
      }
      else if(data.status == false)
      {
        //alert("No responce");
        this.CommenMessages ="No responce";
        $('#btn-CommenMessage-save-disp-btns').trigger('click');

      }
        }, err => {

         // alert(err.message);
         
        })




  }



  string_to_Date_Convert(dateString){ 
    
        
    var dateArray = dateString.split("/");
    var dateObj = new Date(`${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`);
  
    //return this.getFormattedDate_second(dateObj)//dateObj;
    return dateObj;

  }

   getFormattedDate_second(dateVal) {

    
     
    var newDate = new Date(dateVal);

    var sMonth = this.padValue(newDate.getMonth() + 1);
    var sDay = this.padValue(newDate.getDate());
    var sYear = newDate.getFullYear();
    var sHour = newDate.getHours();
    var sMinute = this.padValue(newDate.getMinutes());
    var sAMPM = "AM";

    var iHourCheck = Number(sHour);

    if (iHourCheck > 12) {
        sAMPM = "PM";
        sHour = iHourCheck - 12;
    }
    else if (iHourCheck === 0) {
        sHour = 12;
    }

    sHour = this.padValue(sHour);

    //return sDay + "-" + sMonth + "-" + sYear + " " + sHour + ":" + sMinute + " " + sAMPM;
    return sDay + "/" + sMonth + "/" + sYear;

}

 padValue(value) {
  return (value < 10) ? "0" + value : value;

}

ConvertDateOnley(dt)
{
  var date = dt.getFullYear()+'-'+(dt.getMonth()+1)+'-'+dt.getDate();
  var data2 = new Date(date);
  return data2;
}


get_Search_Data_From_To(){

  

  this.bookingPushData =[];
  var Stand_by_Booking_Temp =[];
  var Stand_by_Booking_Completed_Temp =[];
  this.searchLoction ="";

  this.boatbookingform.value.Launch_Date1 = $("#datepicker-1-boat-bookings").val();
  this.boatbookingform.value.Launch_Date2 = $("#datepicker-2-boat-bookings").val();

  var StartDate = this.ConvertDateOnley(this.string_to_Date_Convert(this.boatbookingform.value.Launch_Date1));
  var EndDate = this.ConvertDateOnley(this.string_to_Date_Convert(this.boatbookingform.value.Launch_Date2));
  var a1 = this.bookingDatas;
  var a2 = this.Public_Stand_by_Booking; //start
  var a3 = this.public_Stand_by_Booking_Completed; //start

  //

  

  
  this.bookingDatas.forEach(boat => {      
    
    var date_Start_Server = this.ConvertDateOnley(this.string_to_Date_Convert(this.getFormattedDate_second(boat.start)));
    
    if(date_Start_Server >= StartDate && date_Start_Server <= EndDate)
    {
      this.bookingPushData.push(boat)
    }
     else{

       

     }



  });

   

  this.Public_Stand_by_Booking.forEach(boat1 => {   
    
    var date_Start_Server = this.ConvertDateOnley(this.string_to_Date_Convert(this.getFormattedDate_second(boat1.start)));
    
    if(date_Start_Server >= StartDate && date_Start_Server <= EndDate)
    {
      Stand_by_Booking_Temp.push(boat1)
    }
     else{

       

     }
    
    
    //if()
    
  });

  this.public_Stand_by_Booking_Completed.forEach(boat2 => {      
    
    var date_Start_Server = this.ConvertDateOnley(this.string_to_Date_Convert(this.getFormattedDate_second(boat2.start)));
    //var StartDate_1 =StartDate;
    //var StartDate_2 =EndDate;
    if(date_Start_Server >= StartDate && date_Start_Server <= EndDate)
    {
      Stand_by_Booking_Completed_Temp.push(boat2)
    }
    else{

      

    }


  });
    
     this.Stand_by_Booking = Stand_by_Booking_Temp;
     this.Stand_by_Booking_Completed = Stand_by_Booking_Completed_Temp;

     this.bookingInfo = this.bookingPushData

     

}


// pageRefresh(){
//   location.reload();
// }





}
