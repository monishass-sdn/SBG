// Create Component for available boat report //Done By Alagesan on 21.05.2021

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import * as XLSX from 'xlsx';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';

declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-report-available-boat',
  templateUrl: './report-available-boat.component.html',
  styleUrls: ['./report-available-boat.component.css'],
})
export class ReportAvailableBoatComponent implements OnInit {
  adminlogin: any;
  form: FormGroup;

  fromDate: any = [];
  toDate: any = [];

  EnvironmentURL: string = environment.url;
  url = this.EnvironmentURL + 'api/Boat/';
  fileName = 'ExcelSheet.xlsx';

  constructor(private router: Router, private fb: FormBuilder) {
    this.createForm();
  }
  // Create Component for available boat report //Done By Alagesan on 21.05.2021

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

    GetAllBoatsDatesOverview();
    function GetAllBoatsDatesOverview() {
      $.ajax({
        url: boat_Url + 'GetAllBoatsDatesOverview',
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
                var Location = val.Location_Name;
                var Anniversary_Date = getFormattedDate_WithOut_Zero_Time(
                  val.Launch_Date
                );
                var Summer_Start = getFormattedDate_WithOut_Zero_Time(
                  val.SummerSeason_SDate
                );
                var Summer_End = getFormattedDate_WithOut_Zero_Time(
                  val.SummerSeason_EDate
                );
                var Winter_Start = getFormattedDate_WithOut_Zero_Time(
                  val.WinterSeason_SDate
                );
                var Winter_End = getFormattedDate_WithOut_Zero_Time(
                  val.WinterSeason_EDate
                );
                var Maximum_Days_to_book_in_Advance = val.Total_Days;
                var Number_of_Shares = val.Owners_Allowed;

                if(Maximum_Days_to_book_in_Advance == null){
                  Maximum_Days_to_book_in_Advance = 0;
                }


                if (firstChek == 0) {
                  bindingTableData =
                    '<tr><td>' +
                    Boat_Name +
                    '</td><td>' +
                    Location +
                    '</td><td>' +
                    Anniversary_Date +
                    '</td><td>' +
                    Summer_Start +
                    '</td><td>' +
                    Summer_End +
                    '</td><td>' +
                    Winter_Start +
                    '</td><td>' +
                    Winter_End +
                    '</td><td>' +
                    Maximum_Days_to_book_in_Advance +
                    '</td><td>' +
                    Number_of_Shares +
                    '</td></tr>';

                  firstChek = 1;
                } else {
                  bindingTableData +=
                    '<tr><td>' +
                    Boat_Name +
                    '</td><td>' +
                    Location +
                    '</td><td>' +
                    Anniversary_Date +
                    '</td><td>' +
                    Summer_Start +
                    '</td><td>' +
                    Summer_End +
                    '</td><td>' +
                    Winter_Start +
                    '</td><td>' +
                    Winter_End +
                    '</td><td>' +
                    Maximum_Days_to_book_in_Advance +
                    '</td><td>' +
                    Number_of_Shares +
                    '</td></tr>';
                }
                bindingNumber = bindingNumber + 1;
              } catch {}
            });

            var sriptTemp =
              // '<script>$(document).ready(function(){$("#GetAllBoatsDatesOverview_Table").DataTable({"ordering": false,responsive:{details:{display: $.fn.dataTable.Responsive.display.modal({header: function ( row ){var data = row.data(); return "Details for "+data[0]+" "+data[1];} }),renderer: $.fn.dataTable.Responsive.renderer.tableAll( {tableClass:"table"})}}} );} );</script>';
              '<script>$(document).ready(function(){$("#GetAllBoatsDatesOverview_Table").DataTable({responsive:{details:{display: $.fn.dataTable.Responsive.display.modal({header: function ( row ){var data = row.data(); return "Details for "+data[0]+" "+data[1];} }),renderer: $.fn.dataTable.Responsive.renderer.tableAll( {tableClass:"table"})}}} );} );</script>';
            var bindingTabledataFirst =
              '<table id="GetAllBoatsDatesOverview_Table" class="table table-striped table-bordered dt-responsive nowrap" style="width:100%"><thead><tr><th>Boat Name</th><th>Location</th><th>Anniversary Date</th><th>Summer Start</th><th>Summer End</th><th>Winter Start</th><th>Winter End</th><th>Maximum Days</th><th>Number of Shares</th></tr></thead><tbody id="id-tbody-allBoats">' +
              bindingTableData +
              '</tbody></table>' +
              sriptTemp +
              '';
            let undefineddata =
              '<table id="GetAllBoatsDatesOverview_Table" class="table table-striped table-bordered dt-responsive nowrap" style="width:100%"><thead><tr><th>Boat Name</th><th>Location</th><th>Anniversary Date</th><th>Summer Start</th><th>Summer End</th><th>Winter Start</th><th>Winter End</th><th>Maximum Days</th><th>Number of Shares</th></tr></thead><tbody id="id-tbody-allBoats">' +
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

    $(document).on('click', '#btn-id-search-table', function () {
      var obj = Object();
      obj.SearchType = 'Launch_Date';
      obj.from = $('#Latest-datepiker-all-boat-from-date').val();
      obj.to = $('#Latest-datepiker-all-boat-to-date').val();

      $.ajax({
        url: boat_Url + 'GetAllBoatsDatesOverviewByDate',
        type: 'post',
        dataType: 'json',
        data: JSON.stringify(obj),
        //data: obj,

        contentType: 'application/json',
        success: function (data) {
          if (data.status == true) {
            var bindingTableData;
            var bindingNumber = 1;
            var firstChek = 0;

            $.each(data.response, function (index, val) {
              try {
                var Boat_Name = val.Boat_Name;
                var Location = val.Location_Name;
                var Anniversary_Date = getFormattedDate_WithOut_Zero_Time(
                  val.Launch_Date
                );
                var Summer_Start = getFormattedDate_WithOut_Zero_Time(
                  val.SummerSeason_SDate
                );
                var Summer_End = getFormattedDate_WithOut_Zero_Time(
                  val.SummerSeason_EDate
                );
                var Winter_Start = getFormattedDate_WithOut_Zero_Time(
                  val.WinterSeason_SDate
                );
                var Winter_End = getFormattedDate_WithOut_Zero_Time(
                  val.WinterSeason_EDate
                );
                var Maximum_Days_to_book_in_Advance = val.Total_Days;
                var Number_of_Shares = val.Owners_Allowed;

                if (firstChek == 0) {
                  bindingTableData =
                    '<tr><td>' +
                    Boat_Name +
                    '</td><td>' +
                    Location +
                    '</td><td>' +
                    Anniversary_Date +
                    '</td><td>' +
                    Summer_Start +
                    '</td><td>' +
                    Summer_End +
                    '</td><td>' +
                    Winter_Start +
                    '</td><td>' +
                    Winter_End +
                    '</td><td>' +
                    Maximum_Days_to_book_in_Advance +
                    '</td><td>' +
                    Number_of_Shares +
                    '</td></tr>';

                  firstChek = 1;
                } else {
                  bindingTableData +=
                    '<tr><td>' +
                    Boat_Name +
                    '</td><td>' +
                    Location +
                    '</td><td>' +
                    Anniversary_Date +
                    '</td><td>' +
                    Summer_Start +
                    '</td><td>' +
                    Summer_End +
                    '</td><td>' +
                    Winter_Start +
                    '</td><td>' +
                    Winter_End +
                    '</td><td>' +
                    Maximum_Days_to_book_in_Advance +
                    '</td><td>' +
                    Number_of_Shares +
                    '</td></tr>';
                }
                bindingNumber = bindingNumber + 1;
              } catch {}
            });

            var sriptTemp =
              '<script>$(document).ready(function(){$("#GetAllBoatsDatesOverview_Table").DataTable({"ordering": false,responsive:{details:{display: $.fn.dataTable.Responsive.display.modal({header: function ( row ){var data = row.data(); return "Details for "+data[0]+" "+data[1];} }),renderer: $.fn.dataTable.Responsive.renderer.tableAll( {tableClass:"table"})}}} );} );</script>';

            var bindingTabledataFirst =
              '<table id="GetAllBoatsDatesOverview_Table" class="table table-striped table-bordered dt-responsive nowrap" style="width:100%"><thead><tr><th>Boat Name</th><th>Location</th><th>Anniversary Date</th><th>Summer Start</th><th>Summer End</th><th>Winter Start</th><th>Winter End</th><th>Maximum Days</th><th>Number of Shares</th></tr></thead><tbody id="id-tbody-allBoats">' +
              bindingTableData +
              '</tbody></table>' +
              sriptTemp +
              '';

            $('#id-table-databinding').html('');

            $('#id-table-databinding').html(bindingTabledataFirst);
          } else {
          }
        },
      });
    });


    $('#Latest-datepiker-all-boat-from-date').Zebra_DatePicker({
      format: 'd-m-Y',      
      pair: $('#Latest-datepiker-all-boat-to-date'),
    });

    $('#Latest-datepiker-all-boat-to-date').Zebra_DatePicker({
      format: 'd-m-Y',
      direction: 1,
    });

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
    $('#id-submenu-child-Reports-Boat-Dates-Overview').css({
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
    let element = document.getElementById('GetAllBoatsDatesOverview_Table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }

  createForm() {
    this.form = this.fb.group({
      Launch_Date1: new FormControl('', [Validators.required]),
      Launch_Date2: new FormControl('', [Validators.required]),
      DateType: new FormControl('', []),
    });
  }
  get f() {
    return this.form.controls;
  }

 
}
