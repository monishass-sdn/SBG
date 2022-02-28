import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

declare var $: any;
declare var jQuery: any;
declare var Swal: any;

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.css']
})
export class SidemenuComponent implements OnInit {
  permissions:any;
  datas_log:any;

  //allBoatsDisplay:any;

  Overview= false;
  NewBooking=false;
  TodaysBooking= false;
  Cancellations= false;
  StandbyBooking= false;
  NeedAssistance= false;

  //Settings...........

  BoatType= false;
  Location= false;
  UnavailableDays= false;
  ConsecutiveDays= false;
  NextBookingDays= false;
  ShareAllocation= false;
  SpecialDays= false;

  //Boat........

  AllBoats= false;
  AddBoat= false;
  ArchivedBoats=false;
  //Owners..........

  AllOwners=false;
  AddOwner= false;
  OwnerDuration=false;
  ManageOwner= false;      
  OwnershipTransfer= false;

  //BoatBooking........

  Booking= false;
  StandByBooking=false;
  BoatBookings= false;
  BookingAdminBooking = false;
  BookingMaintenanceBooking = false;
  //BoatMaintenance......

  BoatMaintenance= false;

  //AdminBooking.....

  BookforAdmin= false;
  BookforanOwner =false;
  AdminBooking=false;
  //Cancellation
  
  Cancellation= false;
  
  //Reports.............

  BoatDatesOverview= false;
  BoatUsageOverview= false;
  OwnerUsageOverview= false;
  OwnerDetailsOverview= false;
  ReportCleaningSchedule = false;

  //SmartBoating

  SmartBoating= false;

  //SubAdmin

  AddSubAdmin=false;
  MaintenanceComponent = false;


  constructor(private router: Router) { }

  ngOnInit(): void {

    var session_Chek = JSON.parse(sessionStorage.getItem("userToken"));
    console.log(session_Chek);
    if(session_Chek == null){
      // this.router.navigate(['/session-Expire/']);
      this.router.navigate(['']);
    }

   // this.allBoatsDisplay = 'background: white; color: black; padding: inherit; border-radius: inherit; margin-right: -9px;'
   
    this.permissions_menuItems();
    // $(document).ready(function(){
    //   $(".menu-list li a").click(function(){
    //     console.log('click');
    //     $(".owner-sidemenu-second").scrollTop(200);
    //   });
    // });
  }
  

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
    this.Cancellations= true;
    this.StandbyBooking= true;
    this.NeedAssistance= true;

  //Settings...........

  this.BoatType= true;
  this.Location= true;
  this.UnavailableDays= true;
  this.ConsecutiveDays= true;
  this.NextBookingDays= true;
  this.ShareAllocation= true;
  this.SpecialDays= true;

  //Boat........

  this.AllBoats= true;
  this.AddBoat= true;
  this.ArchivedBoats=true;
  //Owners..........

  this.AllOwners=true;
  this.AddOwner= true;
  this.OwnerDuration=true;
  this.ManageOwner= true;      
  this.OwnershipTransfer= true;

  //BoatBooking........

  this.Booking= true;
  this.StandByBooking=true;
  this.BoatBookings= true;

  this.BookingAdminBooking = true;
  this.BookingMaintenanceBooking = true;

  //BoatMaintenance......

  this.BoatMaintenance= true;

  //AdminBooking.....

  this.BookforAdmin= true;
  this.BookforanOwner =true;
  this.AdminBooking=true;
  //Cancellation
  
  this.Cancellation= true;
  
  //Reports.............

  this.BoatDatesOverview= true;
  this.BoatUsageOverview= true;
  this.OwnerUsageOverview= true;
  this.OwnerDetailsOverview= true;
  this.MaintenanceComponent = true;
  this.ReportCleaningSchedule =true;

  //SmartBoating

  this.SmartBoating= true;

  //SubAdmin

  this.AddSubAdmin=true;

  }
  SubAdmin(permis){

    
    //this.Overview= false;
    //this.NewBooking= false;
    //this.TodaysBooking= false;
    //this.Cancellations= false;
    //this.StandbyBooking= false;
    //this.NeedAssistance= false;

  //Settings...........

  //this.BoatType= true;
  //this.Location= true;
 // this.UnavailableDays= true;
  //this.ConsecutiveDays= true;
  //this.NextBookingDays= true;
 // this.ShareAllocation= true;
  //this.SpecialDays= true;

  //Boat........

  this.AllBoats= permis.Boat.AllBoats;
  this.AddBoat= permis.Boat.AddBoat;
  this.ArchivedBoats= permis.Boat.ArchivedBoats;
  //Owners..........

  this.AllOwners= permis.Owners.AllOwners;
  this.AddOwner= permis.Owners.AddOwner;
  this.OwnerDuration= permis.Owners.OwnerDuration;
  this.ManageOwner= permis.Owners.ManageOwner;     
  this.OwnershipTransfer= permis.Owners.OwnershipTransfer;

  //BoatBooking........

  this.Booking= permis.BoatBooking.Booking;
  this.StandByBooking= permis.BoatBooking.StandByBooking;
  this.BoatBookings= permis.BoatBooking.BoatBookings;

  this.BookingAdminBooking = permis.BoatBooking.BookingAdminBooking;
  this.BookingMaintenanceBooking = permis.BoatBooking.BookingMaintenanceBooking;


  //BoatMaintenance......

  this.BoatMaintenance= permis.BoatMaintenance.BoatMaintenance;

  //AdminBooking.....

  this.BookforAdmin= permis.AdminBooking.BookforAdmin;
  this.BookforanOwner = permis.AdminBooking.BookforanOwner;
  this.AdminBooking = permis.AdminBooking.AdminBooking;
  //Cancellation
  
  this.Cancellation= permis.Cancellation.Cancellation;
  
  //Reports.............

  this.BoatDatesOverview= permis.Reports.BoatDatesOverview;
  this.BoatUsageOverview= permis.Reports.BoatUsageOverview;
  this.OwnerUsageOverview= permis.Reports.OwnerUsageOverview;
  this.OwnerDetailsOverview= permis.Reports.OwnerDetailsOverview;
  this.MaintenanceComponent = permis.Reports.MaintenanceComponent;
  this.ReportCleaningSchedule = permis.Reports.ReportCleaningSchedule;

  //SmartBoating

  this.SmartBoating= permis.SmartBoating.SmartBoating;

  //SubAdmin

  this.AddSubAdmin= permis.SubAdmin.AddSubAdmin;



  }


 
  setManageOwnerData(){
    sessionStorage.setItem('manageOwnerData', JSON.stringify(''));   // if it's object

  }

  openSmartBoating(){
    //alert();
    $('#btn-Iframe-save-disp-btns').trigger('click');
  }



}
