import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { environment } from '../../environments/environment';

declare var $: any;
declare var jQuery: any;

//Create component for add admin   Done By Alagesan on 29.07.2021
@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin.component.html',
  styleUrls: ['./add-admin.component.css'],
})
//Create component for add admin   Done By Alagesan on 29.07.2021
export class AddAdminComponent implements OnInit {
  form: FormGroup;

  EnvironmentURL: string = environment.url;
  url_Admin = this.EnvironmentURL + 'api/Admin/';
  boaturl = this.EnvironmentURL + 'api/Boat/';
  submitted = false;
  CommenMessages_Admin: any;
  commenMessages: any;
  Sub_AdminId: string;
  getResponce: any;

  editAdminBtmFlag = false;
  addAdminBtnFlag = true;

  Edited_SubAdmin_Id: any;

  show: boolean = false;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.createForm();
  }

  ngOnInit(): void {

    $(".mobile-menu-icon").click(function(){
      $(".side-menu").toggleClass("mobile-sidebar");
    });


    var public_Sub_Admin = [];
    sessionStorage.setItem('relodePg_book-for-owner', '1');
    sessionStorage.setItem('Adminbooking-relodePg', '1');
    sessionStorage.setItem('boat-maintenance-reload', '1');
    sessionStorage.setItem('view-boat-reload', '1');

    var Admin_Url = this.url_Admin;

    GetAllBoatUsageOverview();
    this.startTimer_set_subAdmin_Edit();

    function GetAllBoatUsageOverview() {
      $.ajax({
        url: Admin_Url + 'GetAllSubAdmin',
        type: 'get',
        dataType: 'json',
        //data: JSON.stringify(person),
        contentType: 'application/json',
        success: function (data) {
          if (data.status == true) {
            var bindingTableData;
            var bindingNumber = 1;
            var firstChek = 0;

            public_Sub_Admin = data.response;
            $.each(data.response, function (index, val) {
              try {
                var _id = val._id;
                var Email = val.Email;
                var Phone = val.Phone;
                var Username = val.Username;

                if (firstChek == 0) {
                  bindingTableData =
                    '<tr><td>' +Email + '</td><td>' + Phone +'</td><td>' + Username +'</td><td><ul class="table-action"><li><a class="cls-SubAdmin-Edit" id="' +
                    _id +
                    '"><i class="far fa-edit" aria-hidden="true"></i></a></li><li><a class="cls-SubAdmin-delete" id="' +
                    _id +
                    '"><i class="far fa-trash-alt" aria-hidden="true"></i></a></li></ul></td></tr>';

                  firstChek = 1;
                } else {
                  bindingTableData +=
                    '<tr><td>' + Email +'</td><td>' + Phone +'</td><td>' + Username +'</td><td><ul class="table-action"><li><a class="cls-SubAdmin-Edit" id="' +
                    _id +
                    '"><i class="far fa-edit" aria-hidden="true"></i></a></li><li><a class="cls-SubAdmin-delete" id="' +
                    _id +
                    '"><i class="far fa-trash-alt" aria-hidden="true"></i></a></li></ul></td></tr>';
                }
                bindingNumber = bindingNumber + 1;
              } catch {}
            });

            var sriptTemp =
              '<script>$(document).ready(function(){$("#SubAdmin_Table").DataTable({"ordering": false,responsive:{details:{display: $.fn.dataTable.Responsive.display.modal({header: function ( row ){var data = row.data(); return "Details for "+data[0]+" "+data[1];} }),renderer: $.fn.dataTable.Responsive.renderer.tableAll( {tableClass:"table"})}}} );} );</script>';

            var bindingTabledataFirst =
              '<table id="SubAdmin_Table" class="table table-striped table-bordered dt-responsive nowrap" style="width:100%"><thead><tr><th style="background: #414fad;color: #fff;">Email</th><th style="background: #414fad;color: #fff;">Phone</th><th style="background: #414fad;color: #fff;">User name</th><th style="background: #414fad;color: #fff;">Action</th></tr></thead><tbody id="id-tbody-allBoats">' +
              bindingTableData +
              '</tbody></table>' +
              sriptTemp +
              '';
            let undefineddata =
              '<table id="SubAdmin_Table" class="table table-striped table-bordered dt-responsive nowrap" style="width:100%"><thead><tr><th style="background: #414fad;color: #fff;">Email</th><th style="background: #414fad;color: #fff;">Phone</th><th style="background: #414fad;color: #fff;">User name</th><th style="background: #414fad;color: #fff;">Action</th></tr></thead><tbody id="id-tbody-allBoats">' +
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

    $(document).on('click', '.cls-SubAdmin-Edit', function () {

      //$("body").scrollTop(0);


      $('.close').trigger('click');
     

      var geteditedid = $(this).attr('id');
      var temp_Arry = public_Sub_Admin.find((x) => x._id == geteditedid);
      sessionStorage.setItem('set_Sub_Admin_Edit', JSON.stringify(temp_Arry));

      $('html, body').animate({
        scrollTop: $('html, body').offset().top,});


    });
    $(document).on('mouseover', '.cls-SubAdmin-Edit', function () {
      var getdeleteid = $(this).attr('id');

      $('#' + getdeleteid).css('color', 'red');
      $('#' + getdeleteid).css('cursor', 'pointer');
    });

    $(document).on('mouseout', '.cls-SubAdmin-Edit', function () {
      var getdeleteid = $(this).attr('id');

      $('#' + getdeleteid).css('color', 'black');
    });

    // Delete boat type  for settings //Done By Alagesan on 18.07.2021
    $(document).on('click', '.cls-SubAdmin-delete', function () {
      $('.close').trigger('click');

      var getdeleteid = $(this).attr('id');

      var temp_Arry = public_Sub_Admin.find((x) => x._id == getdeleteid);
      sessionStorage.setItem('set_Sub_Admin_Delete', JSON.stringify(temp_Arry));
    });
    // Delete boat type mouseover  for settings //Done By Alagesan on 18.07.2021
    $(document).on('mouseover', '.cls-SubAdmin-delete', function () {
      $(this).css('color', 'red');
      $(this).css('cursor', 'pointer');
    });
    // Delete boat type mouseout  for settings //Done By Alagesan on 18.07.2021
    $(document).on('mouseout', '.cls-SubAdmin-delete', function () {
      $(this).css('color', 'black');
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

  createForm() {
    this.form = this.fb.group({
      _id: new FormControl('', []),

      Username: new FormControl('', [Validators.required]),
      Password: new FormControl('', [Validators.required]),
      Email: new FormControl('', [Validators.required, Validators.email]),
      Phone: new FormControl('', [Validators.required]),
      //Dashboard.................
      Overview: new FormControl(false, []),
      NewBooking: new FormControl(false, []),
      TodaysBooking: new FormControl(false, []),
      Cancellations: new FormControl(false, []),
      StandbyBooking: new FormControl(false, []),
      NeedAssistance: new FormControl(false, []),

      //Settings...........

      BoatType: new FormControl(false, []),
      Location: new FormControl(false, []),
      UnavailableDays: new FormControl(false, []),
      ConsecutiveDays: new FormControl(false, []),
      NextBookingDays: new FormControl(false, []),
      ShareAllocation: new FormControl(false, []),
      SpecialDays: new FormControl(false, []),

      //Boat........

      AllBoats: new FormControl(false, []),
      AddBoat: new FormControl(false, []),
      ArchivedBoats: new FormControl(false, []),
      //Owners..........

      AllOwners: new FormControl(false, []),
      AddOwner: new FormControl(false, []),
      OwnerDuration: new FormControl(false, []),
      ManageOwner: new FormControl(false, []),
      OwnershipTransfer: new FormControl(false, []),

      //BoatBooking........

      Booking: new FormControl(false, []),
      StandByBooking: new FormControl(false, []),
      BoatBookings: new FormControl(false, []),
      
      //BoatMaintenance......

      BoatMaintenance: new FormControl(false, []),

      //AdminBooking.....

      BookforAdmin: new FormControl(false, []),
      BookforanOwner: new FormControl(false, []),
      AdminBooking: new FormControl(false, []),
      BookingAdminBooking: new FormControl(false, []),
      BookingMaintenanceBooking: new FormControl(false, []),
      //Cancellation

      Cancellation: new FormControl(false, []),

      //Reports.............

      BoatDatesOverview: new FormControl(false, []),
      BoatUsageOverview: new FormControl(false, []),
      OwnerUsageOverview: new FormControl(false, []),
      OwnerDetailsOverview: new FormControl(false, []),
      MaintenanceComponent: new FormControl(false, []),

      ReportCleaningSchedule: new FormControl(false, []),

      //SmartBoating

      SmartBoating: new FormControl(false, []),

      //SubAdmin

      AddSubAdmin: new FormControl(false, []),
    });
  }

  get f() {
    return this.form.controls;
  }

  add_Sub_Addmin() {
    this.submitted = true;

    if (this.form.invalid) {
      //......Not working..........
      //this.CommenMessages_Admin = "ssss";
      //$('#btn-CommenMessage-admin-disp-btns').trigger('click');
      return;
    }

    var ob_val = this.form.value;

    var obj = {
      Username: ob_val.Username,
      Email: ob_val.Email,
      Phone: ob_val.Phone,      
      Password: ob_val.Password,
      Permissions: {
        Dashboard: {
          Overview: ob_val.Overview,
          NewBooking: ob_val.NewBooking,
          TodaysBooking: ob_val.TodaysBooking,
          Cancellations: ob_val.Cancellations,
          StandbyBooking: ob_val.StandbyBooking,
          NeedAssistance: ob_val.NeedAssistance,
        },
        Settings: {
          BoatType: ob_val.BoatType,
          Location: ob_val.Location,
          UnavailableDays: ob_val.UnavailableDays,
          ConsecutiveDays: ob_val.ConsecutiveDays,
          NextBookingDays: ob_val.NextBookingDays,
          ShareAllocation: ob_val.ShareAllocation,
          SpecialDays: ob_val.SpecialDays,
        },
        Boat: {
          AllBoats: ob_val.AllBoats,
          AddBoat: ob_val.AddBoat,
          ArchivedBoats: ob_val.ArchivedBoats,
        },
        Owners: {
          AllOwners: ob_val.AllOwners,
          AddOwner: ob_val.AddOwner,
          OwnerDuration: ob_val.OwnerDuration,
          ManageOwner: ob_val.ManageOwner,
          OwnershipTransfer: ob_val.OwnershipTransfer,
        },
        BoatBooking: {
          Booking: ob_val.Booking,
          StandByBooking: ob_val.StandByBooking,
          BoatBookings: ob_val.BoatBookings,
        },
        BoatMaintenance: {
          BoatMaintenance: ob_val.BoatMaintenance,
        },
        AdminBooking: {
          BookforAdmin: ob_val.BookforAdmin,
          BookforanOwner: ob_val.BookforanOwner,
          AdminBooking: ob_val.AdminBooking,
        },
        Cancellation: {
          Cancellation: ob_val.Cancellation,
        },
        Reports: {
          BoatDatesOverview: ob_val.BoatDatesOverview,
          BoatUsageOverview: ob_val.BoatUsageOverview,
          OwnerUsageOverview: ob_val.OwnerUsageOverview,
          OwnerDetailsOverview: ob_val.OwnerDetailsOverview,
          MaintenanceComponent: ob_val.MaintenanceComponent,
        },
        SmartBoating: {
          SmartBoating: ob_val.SmartBoating,
        },
        SubAdmin: {
          AddSubAdmin: ob_val.AddSubAdmin,
        },
      },
    };

    this.http.post<any>(`${this.url_Admin}CreateSubAdmin`, obj).subscribe(
      (data) => {
        //debugger;
        // Modal popup for add Owner//Done By Alagesan
        if (data.status == true) {
          this.CommenMessages_Admin = data.message;
          $('#btn-CommenMessage-admin-save-disp-btns').trigger('click');
        } else if (data.status == false) {
          this.CommenMessages_Admin = data.message;
          $('#btn-CommenMessage-admin-disp-btns').trigger('click');
        } else {
          this.CommenMessages_Admin = data.message;
          $('#btn-CommenMessage-admin-disp-btns').trigger('click');
        }
      },
      (err) => {}
    );
  }

  password() {
    this.show = !this.show;
  }

  startTimer_set_subAdmin_Edit() {
    setInterval(() => {
      var temp_data = sessionStorage.getItem('set_Sub_Admin_Edit');
      if (typeof temp_data !== 'undefined' && temp_data != null) {
        sessionStorage.removeItem('set_Sub_Admin_Edit');
        var obj = JSON.parse(temp_data);
        this.Sub_Admin_Edit_new(obj);
      }

      var boat_type_delete = sessionStorage.getItem('set_Sub_Admin_Delete');
      if (typeof boat_type_delete !== 'undefined' && boat_type_delete != null) {
        sessionStorage.removeItem('set_Sub_Admin_Delete');
        var deleteobj = JSON.parse(boat_type_delete);
        this.deleteSub_AdminModel(deleteobj._id);
      }

      // this.remove_close_drpdown()
    }, 1000);
  }

  deleteSub_AdminModel(id) {
    this.Sub_AdminId = id;
    $('#removeSub_AdminBoat').trigger('click');
  }

  deleteSub_Admin() {
    var obj = {
      _id: this.Sub_AdminId,
    };

    this.http.post<any>(`${this.url_Admin}DeleteSubAdmin`, obj).subscribe(
      (data) => {
        if (data.status == true) {
          this.getResponce = data.message;
          $('#removeSub_AdminBoat').trigger('click');
          $('#delete-boat-type-popup-btn').trigger('click');
        } else if (data.status == false) {
        }
      },
      (err) => {}
    );
  }

  Sub_Admin_Edit_new(obj) {
    this.editAdminBtmFlag = true;
    this.addAdminBtnFlag = false;
    this.Edited_SubAdmin_Id = obj._id;

    //this.form = obj._id

    this.form.get('Username').setValue(obj.Username);

    this.form.get('Email').setValue(obj.Email);
    this.form.get('Phone').setValue(obj.Phone);

    this.form.get('Password').setValue('');

    this.form.get('Overview').setValue(false);

    this.form.get('NewBooking').setValue(false);

    this.form.get('TodaysBooking').setValue(false);

    this.form.get('Cancellations').setValue(false);

    this.form.get('StandbyBooking').setValue(false);

    this.form.get('NeedAssistance').setValue(false);

    this.form.get('BoatType').setValue(false);

    this.form.get('Location').setValue(false);

    this.form.get('UnavailableDays').setValue(false);

    this.form.get('ConsecutiveDays').setValue(false);

    this.form.get('NextBookingDays').setValue(false);

    this.form.get('ShareAllocation').setValue(false);

    this.form.get('SpecialDays').setValue(false);

    this.form.get('AllBoats').setValue(false);

    this.form.get('AddBoat').setValue(false);

    this.form.get('ArchivedBoats').setValue(false);

    this.form.get('AllOwners').setValue(false);

    this.form.get('AddOwner').setValue(false);

    this.form.get('OwnerDuration').setValue(false);

    this.form.get('ManageOwner').setValue(false);

    this.form.get('OwnershipTransfer').setValue(false);

    this.form.get('AllOwners').setValue(false);

    this.form.get('AddOwner').setValue(false);

    this.form.get('OwnerDuration').setValue(false);

    this.form.get('ManageOwner').setValue(false);

    this.form.get('OwnershipTransfer').setValue(false);

    this.form.get('Booking').setValue(false);

    this.form.get('StandByBooking').setValue(false);

    this.form.get('BoatBookings').setValue(false);

    this.form.get('BoatMaintenance').setValue(false);

    this.form.get('BookforAdmin').setValue(false);

    this.form.get('BookforanOwner').setValue(false);

    this.form.get('AdminBooking').setValue(false);

    this.form.get('Cancellation').setValue(false);

    this.form.get('BoatDatesOverview').setValue(false);

    this.form.get('BoatUsageOverview').setValue(false);

    this.form.get('OwnerUsageOverview').setValue(false);

    this.form.get('OwnerDetailsOverview').setValue(false);

    this.form.get('MaintenanceComponent').setValue(false);

    this.form.get('SmartBoating').setValue(false);

    this.form.get('AddSubAdmin').setValue(false);

    //////////////////////////////////////////////////////
    try {
      this.form.get('Username').setValue(obj.Username);
    } catch {}
    try {
      this.form.get('Email').setValue(obj.Email);
    } catch {}
    try {
      this.form.get('Phone').setValue(obj.Phone);
    } catch {}
    try {
      this.form.get('Password').setValue('');
    } catch {}

    try {
      this.form.get('Overview').setValue(obj.Permissions.Dashboard.Overview);
    } catch {}
    try {
      this.form
        .get('NewBooking')
        .setValue(obj.Permissions.Dashboard.NewBooking);
    } catch {}
    try {
      this.form
        .get('TodaysBooking')
        .setValue(obj.Permissions.Dashboard.TodaysBooking);
    } catch {}
    try {
      this.form
        .get('Cancellations')
        .setValue(obj.Permissions.Dashboard.Cancellations);
    } catch {}
    try {
      this.form
        .get('StandbyBooking')
        .setValue(obj.Permissions.Dashboard.StandbyBooking);
    } catch {}
    try {
      this.form
        .get('NeedAssistance')
        .setValue(obj.Permissions.Dashboard.NeedAssistance);
    } catch {}

    try {
      this.form.get('BoatType').setValue(obj.Permissions.Settings.BoatType);
    } catch {}
    try {
      this.form.get('Location').setValue(obj.Permissions.Settings.Location);
    } catch {}
    try {
      this.form
        .get('UnavailableDays')
        .setValue(obj.Permissions.Settings.UnavailableDays);
    } catch {}
    try {
      this.form
        .get('ConsecutiveDays')
        .setValue(obj.Permissions.Settings.ConsecutiveDays);
    } catch {}
    try {
      this.form
        .get('NextBookingDays')
        .setValue(obj.Permissions.Settings.NextBookingDays);
    } catch {}
    try {
      this.form
        .get('ShareAllocation')
        .setValue(obj.Permissions.Settings.ShareAllocation);
    } catch {}

    try {
      this.form
        .get('SpecialDays')
        .setValue(obj.Permissions.Settings.SpecialDays);
    } catch {}

    try {
      this.form.get('AllBoats').setValue(obj.Permissions.Boat.AllBoats);
    } catch {}
    try {
      this.form.get('AddBoat').setValue(obj.Permissions.Boat.AddBoat);
    } catch {}
    try {
      this.form
        .get('ArchivedBoats')
        .setValue(obj.Permissions.Boat.ArchivedBoats);
    } catch {}

    try {
      this.form.get('AllOwners').setValue(obj.Permissions.Owners.AllOwners);
    } catch {}
    try {
      this.form.get('AddOwner').setValue(obj.Permissions.Owners.AddOwner);
    } catch {}
    try {
      this.form
        .get('OwnerDuration')
        .setValue(obj.Permissions.Owners.OwnerDuration);
    } catch {}
    try {
      this.form.get('ManageOwner').setValue(obj.Permissions.Owners.ManageOwner);
    } catch {}
    try {
      this.form
        .get('OwnershipTransfer')
        .setValue(obj.Permissions.Owners.OwnershipTransfer);
    } catch {}

    try {
      this.form.get('AllOwners').setValue(obj.Permissions.Owners.AllOwners);
    } catch {}
    try {
      this.form.get('AddOwner').setValue(obj.Permissions.Owners.AddOwner);
    } catch {}
    try {
      this.form
        .get('OwnerDuration')
        .setValue(obj.Permissions.Owners.OwnerDuration);
    } catch {}
    try {
      this.form.get('ManageOwner').setValue(obj.Permissions.Owners.ManageOwner);
    } catch {}
    try {
      this.form
        .get('OwnershipTransfer')
        .setValue(obj.Permissions.Owners.OwnershipTransfer);
    } catch {}

    try {
      this.form.get('Booking').setValue(obj.Permissions.BoatBooking.Booking);
    } catch {}
    try {
      this.form
        .get('StandByBooking')
        .setValue(obj.Permissions.BoatBooking.StandByBooking);
    } catch {}
    try {
      this.form
        .get('BoatBookings')
        .setValue(obj.Permissions.BoatBooking.BoatBookings);
    } catch {}

    try {
      this.form
        .get('BoatMaintenance')
        .setValue(obj.Permissions.BoatMaintenance.BoatMaintenance);
    } catch {}

    try {
      this.form
        .get('BookforAdmin')
        .setValue(obj.Permissions.AdminBooking.BookforAdmin);
    } catch {}
    try {
      this.form
        .get('BookforanOwner')
        .setValue(obj.Permissions.AdminBooking.BookforanOwner);
    } catch {}
    try {
      this.form
        .get('AdminBooking')
        .setValue(obj.Permissions.AdminBooking.AdminBooking);
    } catch {}

    try {
      this.form
        .get('Cancellation')
        .setValue(obj.Permissions.Cancellation.Cancellation);
    } catch {}

    try {
      this.form
        .get('BoatDatesOverview')
        .setValue(obj.Permissions.Reports.BoatDatesOverview);
    } catch {}
    try {
      this.form
        .get('BoatUsageOverview')
        .setValue(obj.Permissions.Reports.BoatUsageOverview);
    } catch {}
    try {
      this.form
        .get('OwnerUsageOverview')
        .setValue(obj.Permissions.Reports.OwnerUsageOverview);
    } catch {}
    try {
      this.form
        .get('OwnerDetailsOverview')
        .setValue(obj.Permissions.Reports.OwnerDetailsOverview);
    } catch {}
    try {
      this.form
        .get('MaintenanceComponent')
        .setValue(obj.Permissions.Reports.MaintenanceComponent);
    } catch {}

    try {
      this.form
        .get('SmartBoating')
        .setValue(obj.Permissions.SmartBoating.SmartBoating);
    } catch {}
    try {
      this.form
        .get('AddSubAdmin')
        .setValue(obj.Permissions.SubAdmin.AddSubAdmin);
    } catch {}

    /*
     
      //SmartBoating

      SmartBoating: new FormControl(false, []),

      //SubAdmin

      AddSubAdmin: new FormControl(false, []),
      
  
  
  */
  }

  Edit_Sub_Addmin() {
    this.form.get('_id').setValue(this.Edited_SubAdmin_Id);

    // if (this.form.invalid) {

    //   //......Not working..........
    //   //this.CommenMessages_Admin = "ssss";
    //   //$('#btn-CommenMessage-admin-disp-btns').trigger('click');
    //   return;
    // }

    var ob_val = this.form.value;

    var obj = {
      _id: ob_val._id,
      Username: ob_val.Username,
      Email: ob_val.Email,
      Phone: ob_val.Phone,
      Password: ob_val.Password,
      Permissions: {
        Dashboard: {
          Overview: ob_val.Overview,
          NewBooking: ob_val.NewBooking,
          TodaysBooking: ob_val.TodaysBooking,
          Cancellations: ob_val.Cancellations,
          StandbyBooking: ob_val.StandbyBooking,
          NeedAssistance: ob_val.NeedAssistance,
        },
        Settings: {
          BoatType: ob_val.BoatType,
          Location: ob_val.Location,
          UnavailableDays: ob_val.UnavailableDays,
          ConsecutiveDays: ob_val.ConsecutiveDays,
          NextBookingDays: ob_val.NextBookingDays,
          ShareAllocation: ob_val.ShareAllocation,
          SpecialDays: ob_val.SpecialDays,
        },
        Boat: {
          AllBoats: ob_val.AllBoats,
          AddBoat: ob_val.AddBoat,
          ArchivedBoats: ob_val.ArchivedBoats,
        },
        Owners: {
          AllOwners: ob_val.AllOwners,
          AddOwner: ob_val.AddOwner,
          OwnerDuration: ob_val.OwnerDuration,
          ManageOwner: ob_val.ManageOwner,
          OwnershipTransfer: ob_val.OwnershipTransfer,
        },
        BoatBooking: {
          Booking: ob_val.Booking,
          StandByBooking: ob_val.StandByBooking,
          BoatBookings: ob_val.BoatBookings,
        },
        BoatMaintenance: {
          BoatMaintenance: ob_val.BoatMaintenance,
        },
        AdminBooking: {
          BookforAdmin: ob_val.BookforAdmin,
          BookforanOwner: ob_val.BookforanOwner,
          AdminBooking: ob_val.AdminBooking,
        },
        Cancellation: {
          Cancellation: ob_val.Cancellation,
        },
        Reports: {
          BoatDatesOverview: ob_val.BoatDatesOverview,
          BoatUsageOverview: ob_val.BoatUsageOverview,
          OwnerUsageOverview: ob_val.OwnerUsageOverview,
          OwnerDetailsOverview: ob_val.OwnerDetailsOverview,
          MaintenanceComponent: ob_val.MaintenanceComponent,
        },
        SmartBoating: {
          SmartBoating: ob_val.SmartBoating,
        },
        SubAdmin: {
          AddSubAdmin: ob_val.AddSubAdmin,
        },
      },
    };

    this.http.post<any>(`${this.url_Admin}EditSubAdmin`, obj).subscribe(
      (data) => {
        if (data.status == true) {
          this.getResponce = data.message;

          $('#delete-boat-type-popup-btn').trigger('click');
        } else if (data.status == false) {
          this.CommenMessages_Admin = data.message;
          $('#btn-CommenMessage-admin-disp-btns').trigger('click');
        }
      },
      (err) => {}
    );
  }

  pagereload() {
    location.reload();
  }
}
