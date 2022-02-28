import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import * as XLSX from 'xlsx';

declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-report-cleaning-schedule',
  templateUrl: './report-cleaning-schedule.component.html',
  styleUrls: ['./report-cleaning-schedule.component.css'],
})
export class ReportCleaningScheduleComponent implements OnInit {
  EnvironmentURL: string = environment.url;
  OwnerUrl = this.EnvironmentURL + 'api/Owner';
  url = this.EnvironmentURL + 'api/Boat/';
  Schedule_Url = this.EnvironmentURL + 'api/Schedule/';
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

    var Schedule_Url = this.Schedule_Url;

    GetAllBoatUsageOverview();
    function GetAllBoatUsageOverview() {
      $.ajax({
        url: Schedule_Url + 'GetAllCleaningScheduleReport',
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
                var Boat_Name = val.Boat_Name;
                var Location_Name = val.Location_Name;
                var ReturningOwner = val.ReturningOwner;
                var HouseKeepingLevel = val.HouseKeepingLevel;
                var ReturningDate = getFormattedDate_WithOut_Zero_Time(
                  val.ReturningDate
                );

                if(ReturningDate =="NaN-NaN-NaN"){
                  ReturningDate = "";
                }


                var DepartingOwner = val.DepartingOwner;
                var DepartureaDate = getFormattedDate_WithOut_Zero_Time(
                  val.DepartureaDate
                );

                if(DepartureaDate =="NaN-NaN-NaN"){
                  DepartureaDate = "";
                }



                var BookingNote = val.BookingNote;

                if (firstChek == 0) {
                  bindingTableData =
                    '<tr><td>' +
                    Boat_Name +
                    '</td><td>' +
                    Location_Name +
                    '</td><td>' +
                    ReturningOwner +
                    '</td><td>' +
                    HouseKeepingLevel +
                    '</td><td>' +
                    ReturningDate +
                    '</td><td>' +
                    DepartingOwner +
                    '</td><td>' +
                    DepartureaDate +
                    '</td><td>' +
                    BookingNote +
                    '</td></tr>';

                  firstChek = 1;
                } else {
                  bindingTableData +=
                    '<tr><td>' +
                    Boat_Name +
                    '</td><td>' +
                    Location_Name +
                    '</td><td>' +
                    ReturningOwner +
                    '</td><td>' +
                    HouseKeepingLevel +
                    '</td><td>' +
                    ReturningDate +
                    '</td><td>' +
                    DepartingOwner +
                    '</td><td>' +
                    DepartureaDate +
                    '</td><td>' +
                    BookingNote +
                    '</td></tr>';
                }
                bindingNumber = bindingNumber + 1;
              } catch {}
            });

            var sriptTemp =
              // '<script>$(document).ready(function(){$("#GetAllBoatUsageOverview_Table").DataTable({"ordering": false,responsive:{details:{display: $.fn.dataTable.Responsive.display.modal({header: function ( row ){var data = row.data(); return "Details for "+data[0]+" "+data[1];} }),renderer: $.fn.dataTable.Responsive.renderer.tableAll( {tableClass:"table"})}}} );} );</script>';
              '<script>$(document).ready(function(){$("#GetAllBoatUsageOverview_Table").DataTable({responsive:{details:{display: $.fn.dataTable.Responsive.display.modal({header: function ( row ){var data = row.data(); return "Details for "+data[0]+" "+data[1];} }),renderer: $.fn.dataTable.Responsive.renderer.tableAll( {tableClass:"table"})}}} );} );</script>';

            var bindingTabledataFirst =
              '<table id="GetAllBoatUsageOverview_Table" class="table table-striped table-bordered dt-responsive nowrap" style="width:100%"><thead><tr><th>Boat Name</th><th>Location Name</th><th>Returning Owner</th><th>House Keeping Level</th><th>Returning Date</th><th>Departing Owner</th><th>Departure Date</th><th>Booking Note</th></tr></thead><tbody id="id-tbody-allBoats">' +
              bindingTableData +
              '</tbody></table>' +
              sriptTemp +
              '';
              let undefineddata =
              '<table id="GetAllBoatUsageOverview_Table" class="table table-striped table-bordered dt-responsive nowrap" style="width:100%"><thead><tr><th>Boat Name</th><th>Location Name</th><th>Returning Owner</th><th>House Keeping Level</th><th>Returning Date</th><th>Departing Owner</th><th>Departure Date</th><th>Booking Note</th></tr></thead><tbody id="id-tbody-allBoats">' +
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
}
