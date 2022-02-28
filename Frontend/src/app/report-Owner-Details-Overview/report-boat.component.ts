// Create Component for boat report //Done By Alagesan on 25.05.2021
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import * as XLSX from 'xlsx';

declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-report-boat',
  templateUrl: './report-boat.component.html',
  styleUrls: ['./report-boat.component.css'],
})
export class ReportBoatComponent implements OnInit {
  adminlogin: any;

  EnvironmentURL: string = environment.url;
  OwnerUrl = this.EnvironmentURL + 'api/Owner/';
  url = this.EnvironmentURL + 'api/Boat/';
  fileName = 'ExcelSheet.xlsx';

  constructor(private router: Router) {}

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

    var owner_Url = this.OwnerUrl;

    GetAllOwnerDetailsOverview();
    function GetAllOwnerDetailsOverview() {
      $.ajax({
        url: owner_Url + 'GetAllOwnerDetailsOverview',
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
                var Owner_Name = val.First_Name;
                var Boat_Name ="";
                try{
                 
                  $.each(val.boatDeatils, function (index1, val1) {
                    try { Boat_Name += val1.Boat_Name +", "; }
                    catch{}

                  });
                  Boat_Name = Boat_Name.slice(0,-2);
               }
              catch{}

              
              debugger;


                //var Boat_Name = //JSON.stringify(val.boatDeatils);
                var Family_Names = val.Family_Name;
                var Phone_Number = val.Mobile;

                var Email_Address = val.Email;
                var Address = val.Home_Address;




                var Commencement_Date = "";
                try{
                 
                  $.each(val.ownershipDetails, function (index1, val1) {
                    try { Commencement_Date += val1.Duration_SDate +", "; }
                    catch{}

                  });
                  Commencement_Date = Commencement_Date.slice(0,-2);
               }
              catch{}
                

                //ownershipDetails

                var Expiry_Date = "";

                try{
                 
                  $.each(val.ownershipDetails, function (index1, val1) {
                    try { Expiry_Date += val1.Duration_EDate +", "; }
                    catch{}

                  });
                  Expiry_Date = Expiry_Date.slice(0,-2);
               }
              catch{}


                var Sailing_Ability = val.Sailing_Ability;
                var Parking_Ability = val.Parking_Ability;
                var Housekeeping = val.Housekeeping;

                var Notes = val.Notes;

                var Emergency_Contact = val.Emergency_Contact_Name;
                var Emergency_Contact_Phone = val.Emergency_Contact_Mobile;

                if (firstChek == 0) {
                  bindingTableData =
                    '<tr><td>' +
                    Owner_Name +
                    '</td><td>' +
                    Boat_Name +
                    '</td><td>' +
                    Family_Names +
                    '</td><td>' +
                    Phone_Number +
                    '</td><td>' +
                    Email_Address +
                    '</td><td>' +
                    Address +
                    '</td><td>' +
                    Commencement_Date +
                    '</td><td>' +
                    Expiry_Date +
                    '</td><td>' +
                    Sailing_Ability +
                    '</td><td>' +
                    Parking_Ability +
                    '</td><td>' +
                    Housekeeping +
                    '</td><td>' +
                    Notes +
                    '</td><td>' +
                    Emergency_Contact +
                    '</td><td>' +
                    Emergency_Contact_Phone +
                    '</td></tr>';

                  firstChek = 1;
                } else {
                  bindingTableData +=
                    '<tr><td>' +
                    Owner_Name +
                    '</td><td>' +
                    Boat_Name +
                    '</td><td>' +
                    Family_Names +
                    '</td><td>' +
                    Phone_Number +
                    '</td><td>' +
                    Email_Address +
                    '</td><td>' +
                    Address +
                    '</td><td>' +
                    Commencement_Date +
                    '</td><td>' +
                    Expiry_Date +
                    '</td><td>' +
                    Sailing_Ability +
                    '</td><td>' +
                    Parking_Ability +
                    '</td><td>' +
                    Housekeeping +
                    '</td><td>' +
                    Notes +
                    '</td><td>' +
                    Emergency_Contact +
                    '</td><td>' +
                    Emergency_Contact_Phone +
                    '</td></tr>';
                }
                bindingNumber = bindingNumber + 1;
              } catch {}
            });

            var sriptTemp =
              // '<script>$(document).ready(function(){$("#GetAllOwnerDetailsOverview_Table").DataTable({"ordering": false,responsive:{details:{display: $.fn.dataTable.Responsive.display.modal({header: function ( row ){var data = row.data(); return "Details for "+data[0]+" "+data[1];} }),renderer: $.fn.dataTable.Responsive.renderer.tableAll( {tableClass:"table"})}}} );} );</script>';

              '<script>$(document).ready(function(){$("#GetAllOwnerDetailsOverview_Table").DataTable({responsive:{details:{display: $.fn.dataTable.Responsive.display.modal({header: function ( row ){var data = row.data(); return "Details for "+data[0]+" "+data[1];} }),renderer: $.fn.dataTable.Responsive.renderer.tableAll( {tableClass:"table"})}}} );} );</script>';


            var bindingTabledataFirst =
              '<table id="GetAllOwnerDetailsOverview_Table" class="table table-striped table-bordered dt-responsive nowrap" style="width:100%"><thead><tr><th>Owner Name</th><th>Boat Name</th><th>Family Names</th><th>Phone Number</th><th>Email Address</th><th>Address</th><th>Commencement Date</th><th>Expiry Date</th><th>Sailing Ability</th><th>Parking Ability</th><th>Housekeeping</th><th>Notes</th><th>Emergency Contact</th><th>Emergency Contact Phone</th></tr></thead><tbody id="id-tbody-allBoats">' +
              bindingTableData +
              '</tbody></table>' +
              sriptTemp +
              '';
              let undefineddata =
              '<table id="GetAllOwnerDetailsOverview_Table" class="table table-striped table-bordered dt-responsive nowrap" style="width:100%"><thead><tr><th>Owner Name</th><th>Boat Name</th><th>Family Names</th><th>Phone Number</th><th>Email Address</th><th>Address</th><th>Commencement Date</th><th>Expiry Date</th><th>Sailing Ability</th><th>Parking Ability</th><th>Housekeeping</th><th>Notes</th><th>Emergency Contact</th><th>Emergency Contact Phone</th></tr></thead><tbody id="id-tbody-allBoats">' +
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
    $('#id-submenu-child-Reports-Owner-Details-Overview').css({
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
    let element = document.getElementById('GetAllOwnerDetailsOverview_Table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }
}
// Create Component for boat report //Done By Alagesan on 25.05.2021
