import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormGroup, FormControl,FormBuilder, Validators} from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner"; 
// import environment for  archive boat Done By Alagesan	on 06.07.2021
import { environment } from '../../environments/environment';

declare var $: any;
declare var jQuery: any; 
@Component({
  selector: 'app-archive-boat',
  templateUrl: './archive-boat.component.html',
  styleUrls: ['./archive-boat.component.css']
})
// CreateComponent for archive boat//Done By Alagesan on 20.05.2021

export class ArchiveBoatComponent implements OnInit {
  // Add Base URL for archive boat Done  By Alagesan	on 06.07.2021
  EnvironmentURL:string = environment.url;
  url = this.EnvironmentURL+"api/Boat"
  allBoats: any=[];
  searchText: any = '';
  imgUrl = this.EnvironmentURL+"api/uploads/"
  Location_Name_dropDown: any = "Location";
  loctions: any=[];
  searchLoction: any = '';
  adminlogin: any;
  boatId: any;
  getResponce: any;
  Suspend_URL = this.EnvironmentURL+ "api/Suspend/";
  CommenMessages: any;

  constructor(private http: HttpClient ,private fb: FormBuilder, private router: Router,private SpinnerService: NgxSpinnerService) { 
   
  }
  // CreateComponent for archive boat//Done By Alagesan on 20.05.2021
  ngOnInit(): void {

    $(".mobile-menu-icon").click(function(){
      $(".side-menu").toggleClass("mobile-sidebar");
    });
    
    this.adminlogin = JSON.parse(sessionStorage.getItem("adminLogin"));
    if(this.adminlogin==false){
      this.router.navigate(['']);
    }
    this.sidemenuloder();
    sessionStorage.setItem("relodePg_book-for-owner","1");
sessionStorage.setItem("Adminbooking-relodePg","1");
 sessionStorage.setItem("boat-maintenance-reload","1");
 sessionStorage.setItem("view-boat-reload","1");
    this.getArchiveBoat()
    this.getLoction()
  }
  
  sidemenuloder(){
    $("#a-menu-boat-main").attr("aria-expanded","true");        
    $("#a-menu-boat-main").removeClass("collapsed");
    $("#id-submenu-child-boat-Archive-Boats").
    css({"background": "white", "color": "black",
    "padding": "inherit","border-radius": "inherit","margin-right": "-9px"});
    $("#boat").addClass("show");
  }
getArchiveBoat(){
  this.SpinnerService.show();  
  var obj={
    Boat_Status: "Archive"
  }
  this.http.post<any>(`${this.url}/GetAllArchieveBoatDetails`,  obj   ).subscribe(data => {
    this.http.get<any>(`${this.url}/GetTotal_PendingAllocatedDays`).subscribe(data2 => {



      var commen = data2['Response']
      var BookedDays = commen.BookedDays;
      var AllocatedDays = commen.AllocatedDays;      
      var responce =  data['response'];

      BookedDays.forEach(element1 => {
        responce.forEach(element2 => {
          ///this to start..............
          if(element2._id == element1.Boat_Id)
          {
            var datasint = parseInt(element2.BookedDaystotal?element2.BookedDaystotal:'0');
            element2.BookedDaystotal = parseInt(element1.total) + datasint;
          }
  
          
          
        });
        
      });

      AllocatedDays.forEach(element1 => {
        responce.forEach(element2 => {
          ///this to start..............
          if(element2._id == element1.Boat_Id)
          {
            var datasint = parseInt(element2.AllocatedDaystotal?element2.AllocatedDaystotal:'0');
            element2.AllocatedDaystotal = parseInt(element1.total) + datasint;
            console.log(element2.AllocatedDaystotal);
          }
  
          
          
        });
        
      });
      
      this.allBoats = responce;
     
       // this.allBoats = responce;//data['response'];
       //this.allBoats = responce.filter(x => x.Boat_Status != 2);
       // this.Public_allBoats = responce;//data['response'];
       // this.Public_allBoats = responce.filter(x => x.Boat_Status != 2);
       // $("#shown-loader-commen").css("display", "none");
       
         }, err => {

        //  $("#shown-loader-commen").css("display", "none");

         })
    
    if(data.status == true){
      this.SpinnerService.hide();  
    } 
      if(data.status==false){
        this.SpinnerService.hide();  
        alert(data.message)
      }
      }, err => {
       
      })
}

deleteBoat(){
  var boadtId = {
    _id : this.boatId
  }
  this.http.post<any>(`${this.url}/DeleteBoat`,  boadtId   ).subscribe(data => {
    
      if(data.status==false){
        $('#removeBoat').trigger('click');
        $('#removeBookedBoat').trigger('click');  
      }
      if(data.status==true){
        this.getResponce = data.message
        $('#removeBoat').trigger('click');
        $('#pop-up-btn').trigger('click');
        this.getArchiveBoat()
      } 
      }, err => {
       
      })
}

getLoction(){
  this.http.get<any>(`${this.url}/GetLocation`).subscribe(data => {
   
this.loctions = data['response']

 }, err => {
 })
}
getLoctionTypeId(id){

  this.Location_Name_dropDown = id.Boat_Location;

 
 var boadtId = {
   Location_Id : id._id,
   Boat_Status: "Archive"
 }
 this.http.post<any>(`${this.url}/GetArchieveBoatDetailsInLocation`,  boadtId   ).subscribe(data => {
   
   this.allBoats = data['response']
     }, err => {
       
     })

  }

  viewBoat(boat){
    sessionStorage.setItem('boatData', JSON.stringify(boat));   // if it's object

    this.router.navigate(['view-boat/']);
  }
  editBoat(boat){
    sessionStorage.setItem('boatData', JSON.stringify(boat));   // if it's object
    this.router.navigate(['edit-boat/']);
  }

  deleteBoatModel(id){
    this.boatId = id
    $('#removeBoat').trigger('click');

  }

  // Location dropdown clear for archive boat page //Done By Alagesan on 25.06.2021	
  pageRefresh(){
    location.reload();
  }

  Enabled_Boat(boatdatas){
   
    var obj = 
    {
      Boat_Id: boatdatas._id,
      Boat_Status: "1"
    }

    this.http.post<any>(`${this.Suspend_URL}SetBoatStatus`, obj).subscribe((data) => {
      
        if (data.status == true) {
          this.CommenMessages = data.message;
          $('#btn-CommenMessage-disp-btns-angular').trigger('click');
        }
        else{

          this.CommenMessages = data.message;
          $('#btn-CommenMessage-disp-btns-angular').trigger('click');

        }
      },
      (err) => {}
    );

  }

  Disable_Boat(boatdatas){
   
    var obj = 
    {
      Boat_Id: boatdatas._id,
      Boat_Status: "0"
    }

    this.http.post<any>(`${this.Suspend_URL}SetBoatStatus`, obj).subscribe((data) => {
     
        if (data.status == true) {
          this.CommenMessages = data.message;
          $('#btn-CommenMessage-disp-btns-angular').trigger('click');
        }
        else{

          this.CommenMessages = data.message;
          $('#btn-CommenMessage-disp-btns-angular').trigger('click');

        }
      },
      (err) => {}
    );

  }

  Archived_Boat(boatdatas){
   
    var obj = 
    {
      Boat_Id: boatdatas._id,
      Boat_Status: "2"
    }

    this.http.post<any>(`${this.Suspend_URL}SetBoatStatus`, obj).subscribe((data) => {
     
        if (data.status == true) {
          this.CommenMessages = data.message;
          $('#btn-CommenMessage-disp-btns-angular').trigger('click');
        }
        else{

          this.CommenMessages = data.message;
          $('#btn-CommenMessage-disp-btns-angular').trigger('click');

        }
      },
      (err) => {}
    );

  }



}
