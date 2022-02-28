  // CreateComponent for ownership transfer//Done By Alagesan on 20.05.2021

import { Component, OnInit } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl,FormBuilder, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
// import environment for ownership transfer Done By Alagesan	on 06.07.2021
import { environment } from '../../environments/environment';
declare var $: any;
declare var jQuery: any; 
@Component({
  selector: 'app-ownership-transfer',
  templateUrl: './ownership-transfer.component.html',
  styleUrls: ['./ownership-transfer.component.css']
})
export class OwnershipTransferComponent implements OnInit {
  dropdownSettings : IDropdownSettings ;
  dropdownOwnerSettings : IDropdownSettings ;
  
  dropdownOwnerList_filted = [];
  dropdownOwnerList = [];
  dropdown_New_OwnerList_filted = [];
  // Add Base URL for ownership transfer  Done By Alagesan	on 06.07.2021
  EnvironmentURL:string = environment.url;
  url = this.EnvironmentURL+"api/Boat"
  OwnerUrl = this.EnvironmentURL+"api/Owner" 
  sheduler = this.EnvironmentURL+"api/Schedule/" 
  owners: any=[];
  boats: any=[];
  dropdownList = [];
  dropdownList_filted_Boat = [];
  dropdownNewBoat: any;
 
  checkCurrent_Boat = true;
  checkCurrent_New_Owner = true;
  CommenReadOnly = true;

  adminlogin: any;
  expDateCurrentOwner: any = [];
  startDateNewOwner: any = [];
  form: FormGroup;


  PENDING_SUMMER_WEEKDAYS:any = 0;
  PENDING_SUMMER_WEEKENDS: any = 0;
  PENDING_WINTER_WEEKDAYS: any = 0;
  PENDING_WINTER_WEEKENDS: any = 0;
  PENDING_NUMBER_OF_DAYS: any = 0;

  CommenMessages:any;
  OwnerShipTransferForms: FormGroup;
  OwnerShipTransferSubmitted = false;
  Current_Old_SelectedOwnerId:any;
  dropdownOwn: any;
  dropdownBoat: any;

  constructor(
    private http: HttpClient ,
    private fb: FormBuilder,
    private router: Router, 
    private scroll: ViewportScroller, 
     
     )
{ 
    
      this.OwnerShipTransferForm();
  
  }

  // CreateComponent for ownership transfer//Done By Alagesan on 20.05.2021

  ngOnInit(): void {

    $(".mobile-menu-icon").click(function(){
      $(".side-menu").toggleClass("mobile-sidebar");
    });
    
    this.adminlogin = JSON.parse(sessionStorage.getItem("adminLogin"));
    if(this.adminlogin==false){
      this.router.navigate(['']);
    }
    this.sidemenuloder();
    this.getOwners()
    // this.getBoats()
    sessionStorage.setItem("relodePg_book-for-owner","1");
    sessionStorage.setItem("Adminbooking-relodePg","1");
    sessionStorage.setItem("boat-maintenance-reload","1");
    sessionStorage.setItem("view-boat-reload","1");
    var moment;



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
this.dropdownOwnerSettings = {
  singleSelection: true,
  idField: 'item_id',
  textField: 'item_text',
  selectAllText: 'Select All',
  unSelectAllText: 'UnSelect All',
  itemsShowLimit: 50,
  allowSearchFilter: true,
  closeDropDownOnSelection : true,
  noDataAvailablePlaceholderText : "No data available" 
  //maxHeight : 100        
 
};


$('#Exp_Date_Current_Owner_datepicker').Zebra_DatePicker({
  format: 'd/m/Y'
});

$('#Start_Date_of_New_owner_datepicker').Zebra_DatePicker({
  format: 'd/m/Y',
  pair: $('#End_Date_New_owner_datepicker')  
});

$('#End_Date_New_owner_datepicker').Zebra_DatePicker({
  format: 'd/m/Y'  
});

var Owner_url = this.EnvironmentURL + 'api/Owner/';
var public_OwnerDetails_manageOwner = [];
this.clearAllField_withoutOwner();
Binding_OwnerShip_Transfer();

    function Binding_OwnerShip_Transfer() {
      $.ajax({
        url: Owner_url + 'ListOwnershipTransfer',
        type: 'post',
        dataType: 'json',
        //data: JSON.stringify(person),
        contentType: 'application/json',
        success: function (data) {
          if (data.status == true) {
            var bindingTableData;
            var bindingNumber = 1;
            var firstChek = 0;

            public_OwnerDetails_manageOwner = data.response;
            //sessionStorage.setItem("OwnerDetails_manageOwner",JSON.stringify(data.response));
            $.each(data.Data, function (index, val) {
              var tmb_Id = val._id;             
              var tmb_to_owner = val.to_owner;             
              var tmb_from_owner = val.from_owner;
              var tmb_boat_Name = val.boat_Name;
              var tmb_boat_type = val.boat_type;
              var tmb_start_date = FormattedDate_WithOut_Zero_Time(val.start_date);
              var tmb_end_date = FormattedDate_WithOut_Zero_Time(val.end_date);
              
              var  tmb_Summer_WeekEndDays = val.Summer_WeekEndDays;
              var  tmb_Summer_WeekDays = val.Summer_WeekDays;
              var  tmb_Winter_WeekEndDays = val.Winter_WeekEndDays;
              var  tmb_Winter_WeekDays = val.Winter_WeekDays;
                
              

              if (firstChek == 0) {
                bindingTableData =
                  '<tr><td>' +
                  tmb_to_owner +
                  '</td><td>' +
                  tmb_from_owner +
                  '</td><td>' +
                  tmb_boat_Name +
                  '</td><td>' +
                  tmb_start_date +
                  '</td><td>' +
                  tmb_end_date +
                  '</td><td>' +



                  tmb_Summer_WeekEndDays +
                  '</td><td>' +
                  tmb_Summer_WeekDays +
                  '</td><td>' +
                  tmb_Winter_WeekEndDays +
                  '</td><td>' +
                  tmb_Winter_WeekDays +
                  '</td></tr>';

                firstChek = 1;
              } else {
                bindingTableData +=
                      '<tr><td>' +
                      tmb_to_owner +
                      '</td><td>' +
                      tmb_from_owner +
                      '</td><td>' +
                      tmb_boat_Name +
                      '</td><td>' +
                      tmb_start_date +
                      '</td><td>' +
                      tmb_end_date +
                      '</td><td>' +



                      tmb_Summer_WeekEndDays +
                      '</td><td>' +
                      tmb_Summer_WeekDays +
                      '</td><td>' +
                      tmb_Winter_WeekEndDays +
                      '</td><td>' +
                      tmb_Winter_WeekDays +
                      '</td></tr>';
              }
              bindingNumber = bindingNumber + 1;
            });

            var sriptTemp =
              '<script>$(document).ready(function(){$("#OwnerShipTransferTBL").DataTable({"ordering": false,responsive:{details:{display: $.fn.dataTable.Responsive.display.modal({header: function ( row ){var data = row.data(); return "Details for "+data[0]+" "+data[1];} }),renderer: $.fn.dataTable.Responsive.renderer.tableAll( {tableClass:"table"})}}} );} );</script>';

            var bindingTabledataFirst =
              '<table id="OwnerShipTransferTBL" class="table table-striped table-bordered dt-responsive nowrap" style="width:100%"><thead><tr><th>TO<br> OWNER</th><th>FROM<br> OWNER</th><th>BOAT<br> NAME</th><th>START<br> DATE</th><th>END<br>DATE</th><th>SUMMER<br> WEEKEND</th><th>SUMMER<br> WEEKDAYS</th><th>WINTER<br> WEEKEND</th><th>WINTER<br> WEEKDAYS</th></tr></thead><tbody id="id-tbody-allBoats">' +
              bindingTableData +
              '</tbody></table>' +
              sriptTemp +
              '';
            let undefineddata = '<table id="OwnerShipTransferTBL" class="table table-striped table-bordered dt-responsive nowrap" style="width:100%"><thead><tr><th>TO<br> OWNER</th><th>FROM<br> OWNER</th><th>BOAT<br> NAME</th><th>START<br> DATE</th><th>END<br>DATE</th><th>SUMMER<br> WEEKEND</th><th>SUMMER<br> WEEKDAYS</th><th>WINTER<br> WEEKEND</th><th>WINTER<br> WEEKDAYS</th></tr></thead><tbody id="id-tbody-allBoats">' +
            '</tbody></table>' +
            sriptTemp +
            '';
            if (bindingTableData === undefined) {
              $('#id-table-databinding').html('');

              $('#id-table-databinding').html(undefineddata);
            } else {
              $('#id-table-databinding').html('');
              $('#id-table-databinding').html(bindingTabledataFirst);
            }
          } else {
          }
        },
      });
    }


    function FormattedDate_WithOut_Zero_Time(dateVal)
    {

      try
      {

      var newDate = new Date(dateVal);
  
      var sMonth = padValue(newDate.getMonth() + 1);
      var sDay = padValue(newDate.getDate());
      var sYear = newDate.getFullYear();  
      
      return sDay + "/" + sMonth + "/" + sYear;
      }
      catch{

        return "Empty date";

      }
  }
  function padValue(value) {
    return (value < 10) ? "0" + value : value;
  }






}

  
  getOwners(){
   
  this.http.get<any>(`${this.OwnerUrl}/GetOwners`).subscribe(data => {
  this.owners = data['response']
 
  this.dropdownOwnerList = data.response;                    
             var ownerArray = [];
             data.response.forEach(element => {
                   var obj2 = Object();
                   obj2.item_id = element._id,                     
                   obj2.item_text = (element.First_Name).concat(" ", element.Last_Name);
                   ownerArray.push(obj2);
 
             });
             this.dropdownOwnerList_filted = ownerArray; 

   }, err => {
   })
  }

  get_New_Owners(remove_id){
   
    this.http.get<any>(`${this.OwnerUrl}/GetOwners`).subscribe(data => {
    this.owners = data['response']
   
    this.dropdownOwnerList = data.response;                    
               var ownerArray = [];
               data.response.forEach(element => {

                if(remove_id != element._id){

                
                     var obj2 = Object();
                     obj2.item_id = element._id,                     
                     obj2.item_text = (element.First_Name).concat(" ", element.Last_Name);
                     ownerArray.push(obj2);
                }
   
               });
               this.dropdown_New_OwnerList_filted = ownerArray; 
  
     }, err => {
     })
    }

 
  onItemOwnerSelect(item: any) {

    this.clearAllField_withoutOwner();
    this.checkCurrent_Boat = false;     
    this.Fun_getallDropDownDatas(item.item_id)
    this.Current_Old_SelectedOwnerId = item.item_id;

    this.get_New_Owners(item.item_id);

    this.OwnerShipTransferForms.get('Owner_Name').setValue(item.item_text);
    this.OwnerShipTransferForms.get('Owner_Id').setValue(item.item_id);

  }

  onboatSelect(item: any) { 

    this.reActive_Boatselect();    
    this.getpendingDays_Calculation(item.item_id);

    this.OwnerShipTransferForms.get('Boat_Name').setValue(item.item_text);
    this.OwnerShipTransferForms.get('Boat_Id').setValue(item.item_id);

  }

  onItemNewOwnerSelect(item: any) {
  
    this.OwnerShipTransferForms.get('New_Owner_Name').setValue(item.item_text);
    this.OwnerShipTransferForms.get('New_Owner_Id').setValue(item.item_id);
    this.CommenReadOnly = false;
   
  }
  



  Fun_getallDropDownDatas(owner_drp_Id){ 


    
     
    this.dropdownList = [];       
      var obj = Object();
        obj.owner_id = owner_drp_Id;
      this.http.post<any>(`${this.OwnerUrl}/GetBoatNameByOwnerId`, obj).subscribe(data => { 
        
                            
        var tempArry = [];
        var tempArry2 = [];
               
        data.response.forEach(element => {

          element.BoatDetails.forEach(element2 => {
            if(element2.IsActive == true){

            
            var obj2 = Object();
              obj2.item_id = element2._id,
              obj2.item_text = element2.Boat_Name
              tempArry.push(obj2);

            }

          });
              

        });
        this.dropdownList_filted_Boat = tempArry; 

             
      
        }, err => {
          console.log(err);
        })
  }

  
  sidemenuloder(){    
    $("#a-menu-Owners-main").attr("aria-expanded","true");        
    $("#a-menu-Owners-main").removeClass("collapsed");
    $("#id-submenu-child-Owners-Ownership-Transfer").
    css({"background": "white", "color": "black",
    "padding": "inherit","border-radius": "inherit","margin-right": "-9px"});   
    $("#owner").addClass("show");
  }





  getpendingDays_Calculation(boatId)
  {
    
    //Pre launch date and boat anniversary date for book for owner Done By Alagesan on 29.07.2021
    this.PENDING_SUMMER_WEEKDAYS = 0; 
    this.PENDING_SUMMER_WEEKENDS = 0;
    this.PENDING_WINTER_WEEKDAYS = 0;
    this.PENDING_WINTER_WEEKENDS = 0;
      
    var obj = Object();
        obj.Owner_Id = this.Current_Old_SelectedOwnerId;
        obj.Boat_Id = boatId;
       
      this.http.post<any>(`${this.sheduler}GetAllPendingDaysOfOwner`, obj).subscribe(data => { 

      
       
        if(data.status == true){

          var dt = data.Response;
         
          var BookedDays = dt.BookedDays;

          if(BookedDays.length > 0)
          {          

          var AllocatedDays = dt.AllocatedDays;
        

          if(BookedDays[0].BoatDetails.length > 0){
           // this.boat_anniversary_date = BookedDays[0].BoatDetails[0].Launch_Date;
           
           // this.pre_launch_date = BookedDays[0].BoatDetails[0].PreLaunch_Date;
          
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

          //this.boat_anniversary_date = AllocatedDays[0].Launch_Date;
           
          //this.pre_launch_date = AllocatedDays[0].PreLaunch_Date;

        }

        this.OwnerShipTransferForms.get('No_of_SummerWeekDays').setValue(this.PENDING_SUMMER_WEEKDAYS);
        this.OwnerShipTransferForms.get('No_of_SummerWeekEndDays').setValue(this.PENDING_SUMMER_WEEKENDS);
        this.OwnerShipTransferForms.get('No_of_WinterWeekDays').setValue(this.PENDING_WINTER_WEEKDAYS);
        this.OwnerShipTransferForms.get('No_of_WinterWeekEndDays').setValue(this.PENDING_WINTER_WEEKENDS);
        this.PENDING_NUMBER_OF_DAYS = this.PENDING_SUMMER_WEEKDAYS + this.PENDING_SUMMER_WEEKENDS + this.PENDING_WINTER_WEEKDAYS + this.PENDING_WINTER_WEEKENDS;
        this.OwnerShipTransferForms.get('Pending_number_of_days').setValue(this.PENDING_NUMBER_OF_DAYS);

        this.OwnerShipTransferForms.get('Exp_Date_Current_Owner').setValue(dt.ExpiryDate);



          //  var obj_days = Object();  Exp_Date_Current_Owner_datepicker

          // obj_days.PENDING_SUMMER_WEEKDAYS = this.PENDING_SUMMER_WEEKDAYS; 
          // obj_days.PENDING_SUMMER_WEEKENDS =this.PENDING_SUMMER_WEEKENDS;
          // obj_days.PENDING_WINTER_WEEKDAYS =this.PENDING_WINTER_WEEKDAYS;
          // obj_days.PENDING_WINTER_WEEKENDS = this.PENDING_WINTER_WEEKENDS;

          // sessionStorage.setItem("daysMoreDan",JSON.stringify(obj_days));
         


        }
        else{
          
          this.CommenMessages = "data not fount";
          $('#btn-CommenMessage-disp-btns_angular').trigger('click');
        }
        
        
       
      
        }, err => {
         
        })
    

  }

  get Owt() {
    return this.OwnerShipTransferForms.controls;
  }

  reActive_Boatselect(){

    this.checkCurrent_New_Owner = false;
   // $("#Exp_Date_Current_Owner_datepicker").css("pointer-events", "none");
    $("#Start_Date_of_New_owner_datepicker").css("pointer-events", "inherit");
    $("#End_Date_New_owner_datepicker").css("pointer-events", "inherit");
    $(".Zebra_DatePicker_Icon").css("pointer-events", "inherit");

  }

  clearAllField_withoutOwner()
  {

    this.dropdownBoat = '';
    this.dropdownNewBoat = '';
    this.checkCurrent_Boat = true;
    this.checkCurrent_New_Owner = true;

    this.CommenReadOnly = true;

    
    $("#Exp_Date_Current_Owner_datepicker").css("pointer-events", "none");
    $("#Start_Date_of_New_owner_datepicker").css("pointer-events", "none");
    $("#End_Date_New_owner_datepicker").css("pointer-events", "none");
    $(".Zebra_DatePicker_Icon").css("pointer-events", "none");

   

    this.OwnerShipTransferForms.get('No_of_SummerWeekDays').setValue("");
    this.OwnerShipTransferForms.get('No_of_SummerWeekEndDays').setValue("");
    this.OwnerShipTransferForms.get('No_of_WinterWeekDays').setValue("");
    this.OwnerShipTransferForms.get('No_of_WinterWeekEndDays').setValue("");
    this.OwnerShipTransferForms.get('Pending_number_of_days').setValue("");

    this.OwnerShipTransferForms.get('Start_date_of_new_owner').setValue("");
    this.OwnerShipTransferForms.get('End_date_of_new_owner').setValue("");

    this.OwnerShipTransferForms.get('Exp_Date_Current_Owner').setValue("");
    

    this.OwnerShipTransferForms.get('New_Owner_Name').setValue("");
    this.OwnerShipTransferForms.get('New_Owner_Id').setValue("");

    this.OwnerShipTransferForms.get('Boat_Name').setValue("");
    this.OwnerShipTransferForms.get('Boat_Id').setValue("");

    this.OwnerShipTransferForms.get('Owner_Name').setValue("");
    this.OwnerShipTransferForms.get('Owner_Id').setValue("");

    
//Pending_number_of_days

  }

  OwnerShipTransferForm() {
    this.OwnerShipTransferForms = this.fb.group({
      Boat_Name: new FormControl('', [Validators.required]),
      Boat_Id: new FormControl('', [Validators.required]),

      Owner_Name: new FormControl('', [Validators.required]),
      Owner_Id: new FormControl('', [Validators.required]),

      New_Owner_Name: new FormControl('', [Validators.required]),
      New_Owner_Id: new FormControl('', [Validators.required]),

      No_of_SummerWeekDays: new FormControl('', [Validators.required]),
      No_of_SummerWeekEndDays: new FormControl('', [Validators.required]),
      No_of_WinterWeekDays: new FormControl('', [Validators.required]),
      No_of_WinterWeekEndDays: new FormControl('', [Validators.required]),

      Start_date_of_new_owner:new FormControl('', [Validators.required]),
      End_date_of_new_owner:new FormControl('', [Validators.required]),

      Exp_Date_Current_Owner: new FormControl('', [Validators.required]),

      Pending_number_of_days : new FormControl('', [Validators.required]),
     
      
    });
  }


  OwnerShipTransferSave()
  {
    debugger;
    $("#shown-loader-commen").css("display", "block");
   
    this.OwnerShipTransferSubmitted = true;
    var Tmp_todate = $("#Start_Date_of_New_owner_datepicker").val();
    var Tmp_Fromdate = $("#End_Date_New_owner_datepicker").val();

    this.OwnerShipTransferForms.get('Start_date_of_new_owner').setValue(Tmp_todate);
    this.OwnerShipTransferForms.get('End_date_of_new_owner').setValue(Tmp_Fromdate);

    var Data_Temp = this.OwnerShipTransferForms.value;

    if (this.OwnerShipTransferForms.invalid) {
      $("#shown-loader-commen").css("display", "none");

      return;

    }

    var obj = {
      Boat_Id: Data_Temp.Boat_Id,
      Owner_Id: Data_Temp.Owner_Id,

      New_Owner_Id: Data_Temp.New_Owner_Id,
      New_Owner_Name: Data_Temp.New_Owner_Name,

      From_Date: this.Angular_string_to_Date_Convert_DD_MM_YYYY(Tmp_todate), //"2021-11-15",
      To_Date: this.Angular_string_to_Date_Convert_DD_MM_YYYY(Tmp_Fromdate),  //"2022-11-15",
      
      No_of_SummerWeekDays: Data_Temp.No_of_SummerWeekDays,
      No_of_SummerWeekEndDays: Data_Temp.No_of_SummerWeekEndDays,
      No_of_WinterWeekDays: Data_Temp.No_of_WinterWeekDays,
      No_of_WinterWeekEndDays: Data_Temp.No_of_WinterWeekEndDays

   }

   console.log(obj);
 
   this.http.post<any>(`${this.OwnerUrl}/OwnershipTransfer`, obj).subscribe(
    (data) => {
     
      // Modal popup for add Owner//Done By Alagesan
      if (data.status == true) {
        $("#shown-loader-commen").css("display", "none");
        this.CommenMessages = data.message;
        $('#btn-CommenMessage-Save-disp-btns-angular').trigger('click');
      } else if (data.status == false) {
        $("#shown-loader-commen").css("display", "none");
        this.CommenMessages = data.message;
        $('#btn-CommenMessage-disp-btns-angular').trigger('click');
      } else {
        $("#shown-loader-commen").css("display", "none");
        this.CommenMessages = data.message;
        $('#btn-CommenMessage-disp-btns-angular').trigger('click');
      }
    },
    (err) => {
      $("#shown-loader-commen").css("display", "none");
    }
  );


  }

  onNumberChangeEvent(event: any){

    //console.log(event.target.value);
    var Data_Temp = this.OwnerShipTransferForms.value;

    this.PENDING_NUMBER_OF_DAYS = Data_Temp.No_of_SummerWeekDays + Data_Temp.No_of_SummerWeekEndDays + Data_Temp.No_of_WinterWeekDays + Data_Temp.No_of_WinterWeekEndDays;
    this.OwnerShipTransferForms.get('Pending_number_of_days').setValue(this.PENDING_NUMBER_OF_DAYS);

  }


  Angular_string_to_Date_Convert_DD_MM_YYYY(dateString) {

    var dateArray = dateString.split('/');
    var dateObj =  dateArray[2]+"-"+dateArray[1]+"-"+dateArray[0];
    return dateObj;

  }
  locationReload(){
    location.reload();
  }


}
