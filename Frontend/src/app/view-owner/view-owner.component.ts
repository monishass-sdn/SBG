import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
// import environment for view owner Done By Alagesan	on 06.07.2021
import { environment } from '../../environments/environment';
declare var $: any;
declare var jQuery: any;
@Component({
  selector: 'app-view-owner',
  templateUrl: './view-owner.component.html',
  styleUrls: ['./view-owner.component.css'],
})
export class ViewOwnerComponent implements OnInit {
  data: any = [];
  // Add Base URL for view owner  Done By Alagesan	on 06.07.2021
  EnvironmentURL: string = environment.url;
  url = this.EnvironmentURL + 'api/Owner';
  url_boat = this.EnvironmentURL+"api/Boat"
  sheduler_url = this.EnvironmentURL + 'api/Schedule/';
  listBoat: any = [];
  imgUrl = this.EnvironmentURL + 'api/uploads/';
  adminlogin: any;
  listBoats: any = [];
  listBoat_New_update: any = [];
  disableBoat: string;
  allBoats: any;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router
  ) {}
  ngOnInit(): void {

    $(".mobile-menu-icon").click(function(){
      $(".side-menu").toggleClass("mobile-sidebar");
    });
    
    this.adminlogin = JSON.parse(sessionStorage.getItem('adminLogin'));
    if (this.adminlogin == false) {
      this.router.navigate(['']);
    }
    sessionStorage.setItem('relodePg_book-for-owner', '1');
    sessionStorage.setItem('Adminbooking-relodePg', '1');
    sessionStorage.setItem('boat-maintenance-reload', '1');
    sessionStorage.setItem("view-boat-reload","1");

    this.data = JSON.parse(sessionStorage.getItem('ownerData'));
    this.getBoteByOwner();
    this.getAllBoat();
    

    var Sheduler_Url = this.sheduler_url;

    var ownerid = this.data.Owner_id;

    GetAllBoockedDetails();
    function GetAllBoockedDetails() {
      $.ajax({
        url: Sheduler_Url + 'ViewAllScheduleActiveAndNonActive',
        type: 'get',
        dataType: 'json',
        //data: JSON.stringify(person),
        contentType: 'application/json',
        success: function (data) {
          if (data.status == true) {
            var bindingTableData;
            var bindingNumber = 1;
            var firstChek = 0;

            $.each(data.response, function (index, val) {
              try {
                if (val.User_Id == ownerid) {
                  var boat_Name = val.Boat_Name;
                  var startdate = getFormattedDate_WithOut_Zero_Time(val.start);
                  var finishDate = getFormattedDate_WithOut_Zero_Time(val.end);
                  var bookingStatus = '';
                  if (val.Cancelled_Status == 0) {

                    if(val.Is_StandByBooking == true){

                      bookingStatus =
                      "<span style='color: green;font-size: large;'>Stand by Booking </span>";

                    }
                    else{

                      bookingStatus =
                      "<span style='color: green;font-size: large;'>Confirmed booking</span>";

                    }


                   
                  } else if (val.Cancelled_Status == 1) {
                    
                    bookingStatus =
                      "<span style='color: red;font-size: large;'>Cancelled booking</span>";
                  } else {
                    bookingStatus =
                      "<span style='color: orange;font-size: large;'>Processing</span>";
                  }

                  if (firstChek == 0) {
                    bindingTableData =
                      '<tr><td>' +
                      boat_Name +
                      '</td><td>' +
                      startdate +
                      '</td><td>' +
                      finishDate +
                      '</td><td>' +
                      bookingStatus +
                      '</td></tr>';

                    firstChek = 1;
                  } else {
                    bindingTableData +=
                      '<tr><td>' +
                      boat_Name +
                      '</td><td>' +
                      startdate +
                      '</td><td>' +
                      finishDate +
                      '</td><td>' +
                      bookingStatus +
                      '</td></tr>';
                  }
                  bindingNumber = bindingNumber + 1;
                }
              } catch {}
            });

            var sriptTemp =
              // '<script>$(document).ready(function(){$("#GetAllBoockedDetails_Table").DataTable({"ordering": false,responsive:{details:{display: $.fn.dataTable.Responsive.display.modal({header: function ( row ){var data = row.data(); return "Details for "+data[0]+" "+data[1];} }),renderer: $.fn.dataTable.Responsive.renderer.tableAll( {tableClass:"table"})}}} );} );</script>';
              '<script>$(document).ready(function(){$("#GetAllBoockedDetails_Table").DataTable({responsive:{details:{display: $.fn.dataTable.Responsive.display.modal({header: function ( row ){var data = row.data(); return "Details for "+data[0]+" "+data[1];} }),renderer: $.fn.dataTable.Responsive.renderer.tableAll( {tableClass:"table"})}}} );} );</script>';
            var bindingTabledataFirst =
              '<table id="GetAllBoockedDetails_Table" class="table table-striped table-bordered dt-responsive nowrap" style="width:100%"><thead><tr><th style="vertical-align: top !important; border-bottom: 2px solid #dee2e6 !important; font-weight: 500 !important; background: #414fad !important;color: #fff !important;">Boat Name</th><th style="vertical-align: top !important; border-bottom: 2px solid #dee2e6 !important; font-weight: 500 !important; background: #414fad !important;color: #fff !important;">Start Date</th><th style="vertical-align: top !important; border-bottom: 2px solid #dee2e6 !important; font-weight: 500 !important; background: #414fad !important;color: #fff !important;">Finish Date</th><th style="vertical-align: top !important; border-bottom: 2px solid #dee2e6 !important; font-weight: 500 !important; background: #414fad !important;color: #fff !important;">Booking Status</th></tr></thead><tbody id="id-tbody-allBoats">' +
              bindingTableData +
              '</tbody></table>' +
              sriptTemp +
              '';
            let undefineddata =
              '<table id="GetAllBoockedDetails_Table" class="table table-striped table-bordered dt-responsive nowrap" style="width:100%"><thead><tr><th style="vertical-align: top !important; border-bottom: 2px solid #dee2e6 !important; font-weight: 500 !important; background: #414fad !important;color: #fff !important;">Boat Name</th><th style="vertical-align: top !important; border-bottom: 2px solid #dee2e6 !important; font-weight: 500 !important; background: #414fad !important;color: #fff !important;">Start Date</th><th style="vertical-align: top !important; border-bottom: 2px solid #dee2e6 !important; font-weight: 500 !important; background: #414fad !important;color: #fff !important;">Finish Date</th><th style="vertical-align: top !important; border-bottom: 2px solid #dee2e6 !important; font-weight: 500 !important; background: #414fad !important;color: #fff !important;">Booking Status</th></tr></thead><tbody id="id-tbody-allBoats">' +
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

    function getFormattedDate_WithOut_Zero_Time(dateVal) {
      var newDate = new Date(dateVal);

      var sMonth = padValue(newDate.getMonth() + 1);
      var sDay = padValue(newDate.getDate());
      var sYear = newDate.getFullYear();

      return sDay + '-' + sMonth + '-' + sYear;
    }

    function padValue(value) {
      return value < 10 ? '0' + value : value;
    }
  }
  getBoteByOwner() {
    this.data = JSON.parse(sessionStorage.getItem('ownerData'));

    var obj = {
      owner_id: this.data.Owner_id,
    };
    this.http.post<any>(`${this.url}/GetBoatDetailsByOwner`, obj).subscribe(
      (data) => {
        this.listBoats = data['response'];

        var response = this.listBoats.map(function (el) {
          el.BoatDetails = el.BoatDetails.filter(function (x) {
            return x.IsActive == true;
          });
          return el;
        });

        response.forEach((element) => {
          if (element.BoatDetails.length == 0) {
          } else {
            this.listBoat.push(element);
          }
        });

        this.getOwnerBased_Boat();
      },
      (err) => {}
    );
  }

  getOwnerBased_Boat() {
    this.http.get<any>(`${this.url}/GetAllOwnerssWithBoatDetails`).subscribe(
      (data) => {
        this.data = JSON.parse(sessionStorage.getItem('ownerData'));

        var Tmp_owner_id = this.data.Owner_id;
        var Temp_result = data['result'];
        var Temp_OwnerAllocatedDays = data['OwnerAllocatedDays'];
        var Temp_OwnerBookedDaysDays = data['OwnerBookedDaysDays'];
        var Temp_listBoat = this.listBoat;

        var tmp_listBoat_Array = [];

        Temp_listBoat.forEach((element3) => {
          var tmp_BoatDetails = [];

          element3.BoatDetails.forEach((element0) => {
            var Boat_Image_tmp = [];
            element0.Boat_Image.forEach((element1) => {
              Boat_Image_tmp.push(element1);
            });

            var obj = Object();
            obj.Boat_Image = Boat_Image_tmp;
            obj.Boat_Status = element0.Boat_Status;
            obj.Boattype_Name = element0.Boattype_Name;
            obj.Boattype_id = element0.Boattype_id;
            obj.IsActive = element0.IsActive;
            obj.Location_Id = element0.Location_Id;
            obj.Location_Name = element0.Location_Name;
            /*
          obj.Summer_WeekDays: 1
          obj.Summer_WeekEndDays: 12
          obj.Winter_WeekDays: 20
          obj.Winter_WeekEndDays: 20
          */

            tmp_BoatDetails.push(obj);
          });

          var obj_2 = Object();
          obj_2.BoatDetails = tmp_BoatDetails;
          obj_2.Boat_Id = element3.Boat_Id;
          obj_2.Boat_Name = element3.Boat_Name;
          obj_2.Boat_Type = element3.Boat_Type;
          obj_2.Owners_Allowed = element3.Owners_Allowed;
          obj_2.Profile_Image = element3.Profile_Image;
          obj_2.Profile_ImageOriginalName = element3.Profile_ImageOriginalName;
          obj_2.ShareAllocation = element3.ShareAllocation;
          obj_2._id = element3._id;

          var totalDays_Allocated = 0;
          var totalBookedDaysDays = 0;

          Temp_OwnerAllocatedDays.forEach((element4) => {
            if (
              element4.Boat_Id == element3.Boat_Id &&
              element4.Owner_Id == Tmp_owner_id
            ) {
              totalDays_Allocated =
                parseInt(element4.Summer_WeekDays) +
                parseInt(element4.Summer_WeekEndDays) +
                parseInt(element4.Winter_WeekDays) +
                parseInt(element4.Winter_WeekEndDays);
            }
          });

          Temp_OwnerBookedDaysDays.forEach((element4) => {
            if (
              element4.Boat_Id == element3.Boat_Id &&
              element4.Owner_Id == Tmp_owner_id
            ) {
              totalBookedDaysDays =
                parseInt(element4.Summer_WeekDays) +
                parseInt(element4.Summer_WeekEndDays) +
                parseInt(element4.Winter_WeekDays) +
                parseInt(element4.Winter_WeekEndDays);
            }
          });

          obj_2.TotalDays_Allocated = totalDays_Allocated;
          obj_2.TotalBookedDaysDays = totalBookedDaysDays;

          tmp_listBoat_Array.push(obj_2);
        });

        this.listBoat_New_update = tmp_listBoat_Array;

        //this.GetAllBoockedDetails();

        // var obj={
        //   owner_id:this.data._id
        // }
      },
      (err) => {}
    );
  }

  getFormattedDate_WithOut_Zero_Time(dateVal) {
    var newDate = new Date(dateVal);

    var sMonth = this.padValue(newDate.getMonth() + 1);
    var sDay = this.padValue(newDate.getDate());
    var sYear = newDate.getFullYear();

    return sDay + '-' + sMonth + '-' + sYear;
  }
  viewBoat(boat){

    debugger;

    var sortedData = this.allBoats.find(x => x._id == boat.Boat_Id);

    if(sortedData != null){

      sessionStorage.setItem('boatData', JSON.stringify(sortedData));   

       this.router.navigate(['view-adminboat/']);

    }
    else{
      alert("Empty boat datas");
    }
    
  }

  padValue(value) {
    return value < 10 ? '0' + value : value;
  }

  getAllBoat(){


    $("#shown-loader-commen").css("display", "block");
   
    this.http.get<any>(`${this.url_boat}/GetallBoatDetails`).subscribe(data => {



      //////////////////
      this.http.get<any>(`${this.url_boat}/GetTotal_PendingAllocatedDays`).subscribe(data2 => {



      var commen = data2['Response']
      var BookedDays = commen.BookedDays;
      var AllocatedDays = commen.AllocatedDays;      
      var responce =  data['response'];

      BookedDays.forEach(element1 => {
        responce.forEach(element2 => {

          ///this to start..............
          if(element2._id == element1.Boat_Id)
          {
            var datasint = parseInt(element2.BookedDaystotal);
            element2.BookedDaystotal = parseInt(element1.total) + datasint;
          }
  
          
          
        });
        
      });

      AllocatedDays.forEach(element1 => {
        responce.forEach(element2 => {

          ///this to start..............
          if(element2._id == element1.Boat_Id)
          {
            var datasint = parseInt(element2.AllocatedDaystotal);

            element2.AllocatedDaystotal = parseInt(element1.total) + datasint;
          }
  
          
          
        });
        
      });
      
     
     
        this.allBoats = responce;
       debugger;
       
       //sessionStorage.setItem("AllOwner_All_boatdetails",JSON.stringify(responce));

        $("#shown-loader-commen").css("display", "none");
       
         }, err => {

          $("#shown-loader-commen").css("display", "none");

         })



     ///////////////////////

      
  // this.allBoats = data['response'];
  // this.Public_allBoats = data['response'];
  
   }, err => {
    $("#shown-loader-commen").css("display", "none");
   })
  }
  





}
