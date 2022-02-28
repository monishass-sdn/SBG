import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormGroup, FormControl,FormBuilder, Validators} from '@angular/forms';


import { environment } from '../../environments/environment';
declare var $: any;
declare var jQuery: any; 
@Component({
  selector: 'app-owner-booking-details',
  templateUrl: './owner-booking-details.component.html',
  styleUrls: ['./owner-booking-details.component.css']
})
export class OwnerBookingDetailsComponent implements OnInit {

  form: FormGroup;
  // Add Base URL for booking details  Done By Alagesan	on 06.07.2021
  EnvironmentURL:string = environment.url;

  url = this.EnvironmentURL+"api/Owner";
  Scheduleurl = this.EnvironmentURL+"api/Schedule/";
  pathImage = this.EnvironmentURL+"api/uploads/";
  allOwners: any=[];
  allBoats: any=[];
  allBookingDetails: any=[];
  allBookingDetailsFilter: any=[];
  imgUrl = this.EnvironmentURL+"api/uploads/"
  Boaturl = this.EnvironmentURL+"api/Boat"

  
  constructor(private http: HttpClient ,private router: Router,) { 
  }

 ngOnInit(): void {
  $(".mobile-menu-icon").click(function(){
    $(".side-menu").toggleClass("mobile-sidebar");
  });

   this.getAllOwners();
   this.getAllBoat();
   this.getAllBookingDetailsWithBoatAndOwner();
 }

 getAllOwners(){
   this.http.get<any>(`${this.url}/ViewAllOwners`).subscribe(data => {
     console.log(data)
     this.allOwners = data['response']

  }, err => {
  })
 }

 getAllBoat(){
   this.http.get<any>(`${this.Boaturl}/GetallBoatDetails`).subscribe(data => {
     
 this.allBoats = data['response']
 console.log(this.allBoats);
  console.log(this.allBoats)
  }, err => {
  })
 }

 getAllBookingDetailsWithBoatAndOwner(){
   this.http.get<any>(`${this.Scheduleurl}/ViewBookingDetailsWithBoatAndOwner`).subscribe(data => {
    
 this.allBookingDetails = data['response']
 var datas = sessionStorage.getItem("view-Booking-id");
 var ssss = sessionStorage.getItem("view-Booking-id-another");
 console.log(datas);
   if (typeof datas !== "undefined" && datas != null)
   {

    
   this.allBookingDetailsFilter = this.allBookingDetails.filter(x => x._id == datas);
 
   
   }
 console.log(this.allBookingDetailsFilter);
  //console.log(this.allBookingDetails)
  }, err => {
  })
 }

 viewAdminBooking(){
   sessionStorage.setItem('view-Booking-id', '');

  // this.router.navigate(['AdminBooking/']);
 }

 getBookingType(type){
  let bookingTYPE = '';
  if(type =='Winter booking'){
    bookingTYPE = 'Winter standby booking';
  } else if(type =='Summer booking'){
    bookingTYPE = 'Summer standby booking';
  } else if(type =='prelaunch and launch booking'){
    bookingTYPE = 'Prelaunch and launch standby booking';
  } else {
    bookingTYPE = type;
  }
  return bookingTYPE;
    }
}
