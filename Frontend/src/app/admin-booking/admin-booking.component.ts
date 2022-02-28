import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl,FormBuilder, Validators} from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';//'ng-multiselect-dropdown';
import { Router } from '@angular/router';
// import environment for admin booking Done By Alagesan	on 06.07.2021
import { environment } from '../../environments/environment';

declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-admin-booking',
  templateUrl: './admin-booking.component.html',
  styleUrls: ['./admin-booking.component.css']
})
export class AdminBookingComponent implements OnInit {

  
   moment:any;
   tui:any;
   // Add Base URL for admin booking  Done By Alagesan	on 06.07.2021
   EnvironmentURL:string = environment.url;
  
   url = this.EnvironmentURL+"api/Schedule/";
   dropdownList = [];
   dropdownList_filted = [];
   selectedItems = [];
   dropdownSettings : IDropdownSettings ;
 
   set_BoatType = "";
  adminlogin: any;
 
   constructor(private fb: FormBuilder,private http: HttpClient, private router: Router,) { 
     //this.createForm();
   }
 
   ngOnInit(): void {

    $(".mobile-menu-icon").click(function(){
      $(".side-menu").toggleClass("mobile-sidebar");
    });

    $("#shown-loader-commen").css("display", "block");
    
    this.adminlogin = JSON.parse(sessionStorage.getItem("adminLogin"));
    if(this.adminlogin==false){
      this.router.navigate(['']);
    }
    sessionStorage.setItem("relodePg_book-for-owner","1");
 sessionStorage.setItem("boat-maintenance-reload","1");
 sessionStorage.setItem("view-boat-reload","1");
     //ReloadPages();

     var getbrwserType = sessionStorage.getItem("browserType");
     debugger;
       if(getbrwserType == "Safari")
       {    
        
        this.ReloadPages();   
       }
       else{
 
         ReloadPages();
         
 
       }


 
     sessionStorage.removeItem('AdminSelectBoat');
     sessionStorage.setItem("pageIdentiFiction","AdminBooking");

     //$('#Footer-Success-disp-btns').trigger('click');

     

       function ReloadPages(){
           
           //var sss = public_URL;
          
           var datasessions = sessionStorage.getItem("Adminbooking-relodePg");
           
           if(datasessions == null)
           {
               
               sessionStorage.setItem("Adminbooking-relodePg","0");
               location.reload();
 
           }
           else if(datasessions == "1"){
             sessionStorage.setItem("Adminbooking-relodePg","0");
               location.reload();
 
           }
           //sessionStorage.setItem("relodePg","1");//
 
       }
 
        this.Fun_getallDropDownDatas();
        
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
         
       }

        ReloadPages(){
           
        //var sss = public_URL;
       
        var datasessions = sessionStorage.getItem("Adminbooking-relodePg");
        
        if(datasessions == null)
        {
          $("#shown-loader-commen").css("display", "block");
          alert("Please reload the page if you find any difficulties with your booking schedules.");
            sessionStorage.setItem("Adminbooking-relodePg","0");
            //location.reload();
            window.location.href = window.location.href;

        }
        else if(datasessions == "1"){

          $("#shown-loader-commen").css("display", "block");
          alert("Please reload the page if you find any difficulties with your booking schedules.");
          sessionStorage.setItem("Adminbooking-relodePg","0");
            //location.reload();
            window.location.href = window.location.href;

        }
        //sessionStorage.setItem("relodePg","1");//

    }






       onItemSelect(item: any) {
 
         var finddate = this.dropdownList.find(x => x._id == item.item_id);
         this.set_BoatType = finddate.Boattype_Name;
         sessionStorage.setItem("AdminSelectBoat",JSON.stringify(finddate));
        
        
       }
       //onDeSelect
       onDeSelect(items: any) {
        sessionStorage.removeItem('AdminSelectBoat');
         
      }
       onSelectAll(items: any) {
         
       }

       
 
        
         Fun_getallDropDownDatas(){
           var obj = Object();
             obj.alphabet = "";
           this.http.post<any>(`${this.url}GetBoatNames`, obj).subscribe(data => { 
             this.dropdownList = data.response;                    
             var tempArry = [];
             data.response.forEach(element => {
                   var obj2 = Object();
                   obj2.item_id = element._id,
                   obj2.item_text = element.Boat_Name
                   tempArry.push(obj2);
 
             });
             this.dropdownList_filted = tempArry;           
           
             }, err => {
              
             })
       }
 
       locationReload(){
        //location.reload();

        $('.id-manual-reload').trigger('click');



      }
 
      
   }
 