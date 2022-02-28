// Create Component for ownership report //Done By Alagesan on 25.05.2021
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { HttpClient } from '@angular/common/http';
// import environment for report ownership Done By Alagesan	on 06.07.2021
import { environment } from '../../environments/environment';
import * as XLSX from 'xlsx';
declare var $: any;
declare var jQuery: any;
@Component({
  selector: 'app-report-ownership',
  templateUrl: './report-ownership.component.html',
  styleUrls: ['./report-ownership.component.css'],
})
export class ReportOwnershipComponent implements OnInit {
  dropdownOwnerSettings: IDropdownSettings;
  dropdownOwner: any;
  dropdownOwnerList_filted = [];
  dropdownOwnerList = [];
  // Add Base URL for report ownership  Done By Alagesan	on 06.07.2021
  EnvironmentURL: string = environment.url;
  OwnerUrl = this.EnvironmentURL + 'api/Owner';
  url = this.EnvironmentURL + 'api/Boat/';

  owners: any = [];
  adminlogin: any;
  fileName = 'ExcelSheet.xlsx';

  constructor(private router: Router, private http: HttpClient) {}

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
    sessionStorage.setItem('view-boat-reload', '1');

    this.sidemenuloder();

    ////////////..........................

    var boat_Url = this.url;

    GetAllBoatUsageOverview();
    function GetAllBoatUsageOverview() {
      $.ajax({
        url: boat_Url + 'GetAllBoatUsageOverview',
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
                var Boat_Name = val.boatName;
                var Summer_Week_Days =
                  val.totalBookedSummerWeekdays +
                  '|' +
                  val.totalAllocatedSummerWeekdays;
                var Summer_Weekends =
                  val.totalBookedSummerWeekends +
                  '|' +
                  val.totalAllocatedSummerWeekends;

                var Winter_Week_Days =
                  val.totalBookedWinterWeekdays +
                  '|' +
                  val.totalAllocatedWinterWeekdays;
                var Winter_Weekends =
                  val.totalBookedWinterWeekends +
                  '|' +
                  val.totalAllocatedWinterWeekends;
                var Standby_Days_Used = val.totalStandByBookingCount;

                var Number_of_Day_Only_Bookings =
                  val.totalNumberOfDayOnlyBooking;
                var Number_of_Cleans = val.toatalNumberofCleans;
                var Average_Booking_Duration =
                  val.totalAverageBookingDurationInHr;
                var Number_of_Cancellations =
                  val.totalNumberOfBookingDaysCancellation;
                var Number_of_maintenance_days =
                  val.totalNumberOfMmaintenanceDay;
                var Number_of_days_admin_booked =
                  val.totalNumberOfDaysAdminBooked;

                if (firstChek == 0) {
                  bindingTableData =
                    '<tr><td>' +
                    Boat_Name +
                    '</td><td>' +
                    Summer_Week_Days +
                    '</td><td>' +
                    Summer_Weekends +
                    '</td><td>' +
                    Winter_Week_Days +
                    '</td><td>' +
                    Winter_Weekends +
                    '</td><td>' +
                    Standby_Days_Used +
                    '</td><td>' +
                    Number_of_Day_Only_Bookings +
                    '</td><td>' +
                    Number_of_Cleans +
                    '</td><td>' +
                    Average_Booking_Duration +
                    '</td><td>' +
                    Number_of_Cancellations +
                    '</td><td>' +
                    Number_of_maintenance_days +
                    '</td><td>' +
                    Number_of_days_admin_booked +
                    '</td></tr>';

                  firstChek = 1;
                } else {
                  bindingTableData +=
                    '<tr><td>' +
                    Boat_Name +
                    '</td><td>' +
                    Summer_Week_Days +
                    '</td><td>' +
                    Summer_Weekends +
                    '</td><td>' +
                    Winter_Week_Days +
                    '</td><td>' +
                    Winter_Weekends +
                    '</td><td>' +
                    Standby_Days_Used +
                    '</td><td>' +
                    Number_of_Day_Only_Bookings +
                    '</td><td>' +
                    Number_of_Cleans +
                    '</td><td>' +
                    Average_Booking_Duration +
                    '</td><td>' +
                    Number_of_Cancellations +
                    '</td><td>' +
                    Number_of_maintenance_days +
                    '</td><td>' +
                    Number_of_days_admin_booked +
                    '</td></tr>';
                }
                bindingNumber = bindingNumber + 1;
              } catch {}
            });

            var sriptTemp =
              //'<script>$(document).ready(function(){$("#GetAllBoatUsageOverview_Table").DataTable({"ordering": false,responsive:{details:{display: $.fn.dataTable.Responsive.display.modal({header: function ( row ){var data = row.data(); return "Details for "+data[0]+" "+data[1];} }),renderer: $.fn.dataTable.Responsive.renderer.tableAll( {tableClass:"table"})}}} );} );</script>';

              '<script>$(document).ready(function(){$("#GetAllBoatUsageOverview_Table").DataTable({responsive:{details:{display: $.fn.dataTable.Responsive.display.modal({header: function ( row ){var data = row.data(); return "Details for "+data[0]+" "+data[1];} }),renderer: $.fn.dataTable.Responsive.renderer.tableAll( {tableClass:"table"})}}} );} );</script>';

            var bindingTabledataFirst =
              '<table id="GetAllBoatUsageOverview_Table" class="table table-striped table-bordered dt-responsive nowrap" style="width:100%"><thead><tr><th>Boat Name</th><th>Summer Week Days</th><th>Summer Weekends</th><th>Winter Week Days</th><th>Winter Weekends</th><th>Standby Days Used</th><th>Number of Day-Only Bookings</th><th>Number of Cleans</th><th>Average Booking Duration</th><th>Number of Cancellations</th><th>Number of maintenance days</th><th>Number of days admin booked</th></tr></thead><tbody id="id-tbody-allBoats">' +
              bindingTableData +
              '</tbody></table>' +
              sriptTemp +
              '';
            let undefineddata =
              '<table id="GetAllBoatUsageOverview_Table" class="table table-striped table-bordered dt-responsive nowrap" style="width:100%"><thead><tr><th>Boat Name</th><th>Summer Week Days</th><th>Summer Weekends</th><th>Winter Week Days</th><th>Winter Weekends</th><th>Standby Days Used</th><th>Number of Day-Only Bookings</th><th>Number of Cleans</th><th>Average Booking Duration</th><th>Number of Cancellations</th><th>Number of maintenance days</th><th>Number of days admin booked</th></tr></thead><tbody id="id-tbody-allBoats">' +
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

  sidemenuloder() {
    $('#a-menu-Reports-main').attr('aria-expanded', 'true');
    $('#a-menu-Reports-main').removeClass('collapsed');
    $('#id-submenu-child-Reports-Boat-Usage-Overview').css({
      background: 'white',
      color: 'black',
      padding: 'inherit',
      'border-radius': 'inherit',
      'margin-right': '-9px',
    });
    $('#reports').addClass('show');
  }

  exportexcel(): void {
    /* table id is passed over here */
    let element = document.getElementById('GetAllBoatUsageOverview_Table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }

  // Add the get owners function for ownership report //Done By Alagesan on 20.06.2021
}
// Create Component for ownership report //Done By Alagesan on 25.05.2021
