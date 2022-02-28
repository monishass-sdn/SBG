import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
declare var $: any;
declare var jQuery: any; 
@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
// Create Component for history //Done By Alagesan on 17.05.2021
export class HistoryComponent implements OnInit {
  ownerlogin: any;
  EnvironmentURL:string = environment.url;
  urlViewBookingDetails = this.EnvironmentURL+"api/Schedule";
  viewBookingByOwnerIddata: any=[];
  viewCancelBookingByOwnerIddata: any=[];
  imgUrl = this.EnvironmentURL+"api/uploads/";
  searchText: any = '';

  constructor(private router: Router ,private http: HttpClient) { }

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

    sessionStorage.setItem("owner-dashboard-relodePg","1");
    sessionStorage.setItem("owner-dashboard-relodePg-safari","1");
    this.ownerlogin = JSON.parse(sessionStorage.getItem("userlogin"));
    if(this.ownerlogin==false){
      this.router.navigate(['/owner-login/']);
    }
    sessionStorage.setItem("relodePg_book-for-owner","1");
    sessionStorage.setItem("Adminbooking-relodePg","1");
    sessionStorage.setItem("boat-maintenance-reload","1");
    sessionStorage.setItem("view-boat-reload","1");

    this.getviewbookingByOwnerId();


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

          var chekCancelDate = this.Jqueary_string_to_Date_Convert(this.getFormattedDate_WithOut_Zero_Time(obj.end));
          if(chekCancelDate < currentDate)
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

          var chekbookingDate = this.Jqueary_string_to_Date_Convert(this.getFormattedDate_WithOut_Zero_Time(obj.end));
          if(chekbookingDate < currentDate)
          {
            tmpDta_4.push(obj);
          }

         

        }catch{

        }

      });

        this.viewBookingByOwnerIddata  = tmpDta_4;//data['response'];

        //this.GetAllUnAvailableDays();
        $("#shown-loader-commen").css("display", "none");
      
      }, err => {

        $("#shown-loader-commen").css("display", "none");
       
      })


    }, err => {

      $("#shown-loader-commen").css("display", "none");
     
    })
   // Owner booking for owner dashboard Done By Alagesan on 21.07.2021
   
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

openLink(link){
  window.open(link);
}

}

// Create Component for history //Done By Alagesan on 17.05.2021
