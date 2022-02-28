import { Component, HostListener, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ViewportScroller } from '@angular/common';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
// import environment for manage owner Done By Alagesan	on 06.07.2021
import { environment } from '../../environments/environment';

declare var $: any;
declare var jQuery: any;
@Component({
  selector: 'app-manage-owner',
  templateUrl: './manage-owner.component.html',
  styleUrls: ['./manage-owner.component.css'],
})
export class ManageOwnerComponent implements OnInit {
  pageYoffset = 0;
  boatId: any;
  adminlogin: any;
  owner: any = [];
  selectedBoat: any;
  @HostListener('window:scroll', ['$event']) onScroll(event) {
    this.pageYoffset = window.pageYOffset;
  }
  boats: any = [];
  // Add Base URL for manage owner Done By Alagesan	on 06.07.2021
  EnvironmentURL: string = environment.url;
  url = this.EnvironmentURL + 'api/Boat';
  OwnerUrl = this.EnvironmentURL + 'api/Owner';
  manageOwnerForms: FormGroup;
  manageOwnerSubmitted = false;
  boatName: any;
  owners: any = [];
  ownerName: any;
  allManageData: any = [];
  getResponce: any;
  managerOwnerId: any;
  editBtnFlag = false;
  addBtnFlag = true;
  checkCurrent = true;
  manageOwnerId: any;
  data: any;
  set_BoatType = '';
  dropdownList = [];
  dropdownList_filted = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings;
  set_OwnerBoatType = '';
  dropdownOwnerList = [];
  dropdownOwnerList_filted = [];
  selectedOwnerItems = [];
  dropdownOwnerSettings: IDropdownSettings;
  dropdownOwn: any;
  dropdownBoat: any;
  dropdownOwn_Boat_selected = [];
  dropdownBoat_Owner_selected = [];
  commenMessages: any;

  dropdownBoat_Owner_selected_model: any;

  public_Owner_Name: any = null;
  public_Owner_Id: any = null;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private scroll: ViewportScroller
  ) {
    this.manageOwnerForm();
  }

  ngOnInit(): void {

    $(".mobile-menu-icon").click(function(){
      $(".side-menu").toggleClass("mobile-sidebar");
    });
    
    var public_OwnerDetails_manageOwner = [];
    this.adminlogin = JSON.parse(sessionStorage.getItem('adminLogin'));
    this.startTimer_set_manageOwner_Edit();
    if (this.adminlogin == false) {
      this.router.navigate(['']);
    }
    this.sidemenuloder();
    sessionStorage.setItem('relodePg_book-for-owner', '1');
    sessionStorage.setItem('Adminbooking-relodePg', '1');
    sessionStorage.setItem('boat-maintenance-reload', '1');
    sessionStorage.setItem('view-boat-reload', '1');
    this.dropdownSettings = {
      singleSelection: true,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      closeDropDownOnSelection: true,
      noDataAvailablePlaceholderText: 'No data available',
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
      closeDropDownOnSelection: true,
      noDataAvailablePlaceholderText: 'No data available',
      //maxHeight : 100
    };

    // Start...............Sibi...................

    //GetAllOwnerDetails

    var Owner_url = this.EnvironmentURL + 'api/Owner/';

    this.startTimer_set_manageOwner_Edit();

    $(document).on('click', '.cls-delete-single', function () {
      var getdeleteid = $(this).attr('id');

      sessionStorage.setItem('selected_d_MangerOwner', getdeleteid);

      $('#removeBoat').trigger('click');
    });

    $(document).on('mouseover', '.cls-delete-single', function () {
      var getdeleteid = $(this).attr('id');

      $('#' + getdeleteid).css('color', 'red');
      $('#' + getdeleteid).css('cursor', 'pointer');
    });

    $(document).on('mouseout', '.cls-delete-single', function () {
      var getdeleteid = $(this).attr('id');

      $('#' + getdeleteid).css('color', 'black');
    });

    //class="cls-manage-owner-Edit" id="'+tmb_Id+'"

    $(document).on('mouseover', '.cls-manage-owner-Edit', function () {
      var getdeleteid = $(this).attr('id');

      $('#' + getdeleteid).css('color', 'red');
      $('#' + getdeleteid).css('cursor', 'pointer');
    });

    $(document).on('mouseout', '.cls-manage-owner-Edit', function () {
      var getdeleteid = $(this).attr('id');

      $('#' + getdeleteid).css('color', 'black');
    });

    //var callAngular;

    $(document).on('click', '.cls-manage-owner-Edit', function () {
      $('.close').trigger('click');
      var getdeleteid = $(this).attr('id');
      var temp_Arry = public_OwnerDetails_manageOwner.find(
        (x) => x._id == getdeleteid
      );
      sessionStorage.setItem('set_manageOwner_Edit', JSON.stringify(temp_Arry));
    });

    Binding_ManageOwner();
    function Binding_ManageOwner() {
      $.ajax({
        url: Owner_url + 'GetAllOwnerDetails',
        type: 'get',
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
            $.each(data.response, function (index, val) {
              var tmb_Id = val._id;
              var boatDetails = val.BoatDetails[0];
              var tmb_Owner_Name = val.Owner_Name;
              var tmb_ShareAllocation = val.ShareAllocation;
              var tmb_Boat_Name = val.Boat_Name;
              var tmp_id = val._id;

              var tmb_Summer_WeekEndDays = '0'; //boatDetails.Summer_WeekEndDays;
              var tmb_Summer_WeekDays = '0'; //boatDetails.Summer_WeekDays;
              var tmb_Winter_WeekEndDays = '0'; //boatDetails.Winter_WeekEndDays;
              var tmb_Winter_WeekDays = '0'; //boatDetails.Winter_WeekDays;

              var tmb_Total_Days = '0';
              $.each(data.BookedDays, function (index, book) {
                if (typeof boatDetails !== 'undefined' && boatDetails != null) {
                  if (
                    boatDetails._id == book.Boat_Id &&
                    val.Owner_Id == book.Owner_Id
                  ) {
                    tmb_Total_Days =
                      book.Summer_WeekDays +
                      book.Summer_WeekEndDays +
                      book.Winter_WeekDays +
                      book.Winter_WeekEndDays; //boatDetails.Total_Days;
                  }
                }
              });

              if (boatDetails != null) {
                tmb_Summer_WeekEndDays = val.Summer_WeekEndDays;
                tmb_Summer_WeekDays = val.Summer_WeekDays;
                tmb_Winter_WeekEndDays = val.Winter_WeekEndDays;
                tmb_Winter_WeekDays = val.Winter_WeekDays;
                //  tmb_Total_Days = boatDetails.Total_Days;
              }

              if (firstChek == 0) {
                bindingTableData =
                  '<tr><td (click)= reloadPage()>' +
                  tmb_Owner_Name +
                  '</td><td>' +
                  tmb_Boat_Name +
                  '</td><td>' +
                  tmb_Summer_WeekEndDays +
                  '</td><td>' +
                  tmb_Summer_WeekDays +
                  '</td><td>' +
                  tmb_Winter_WeekEndDays +
                  '</td><td>' +
                  tmb_Winter_WeekDays +
                  '</td><td>' +
                  tmb_Total_Days +
                  '</td><td><ul class="table-action"><li><a class="cls-manage-owner-Edit" id="' +
                  tmb_Id +
                  '"><i class="far fa-edit" aria-hidden="true"></i></a></li></ul></td></tr>';

                firstChek = 1;
              } else {
                bindingTableData +=
                  '<tr><td (click)= reloadPage()>' +
                  tmb_Owner_Name +
                  '</td><td>' +
                  tmb_Boat_Name +
                  '</td><td>' +
                  tmb_Summer_WeekEndDays +
                  '</td><td>' +
                  tmb_Summer_WeekDays +
                  '</td><td>' +
                  tmb_Winter_WeekEndDays +
                  '</td><td>' +
                  tmb_Winter_WeekDays +
                  '</td><td>' +
                  tmb_Total_Days +
                  '</td><td><ul class="table-action"><li><a class="cls-manage-owner-Edit" id="' +
                  tmb_Id +
                  '" ><i class="far fa-edit" aria-hidden="true"></i></a></li></ul></td></tr>';
              }
              bindingNumber = bindingNumber + 1;
            });

            var sriptTemp =
              '<script>$(document).ready(function(){$("#example").DataTable({"ordering": false,responsive:{details:{display: $.fn.dataTable.Responsive.display.modal({header: function ( row ){var data = row.data(); return "Details for "+data[0]+" "+data[1];} }),renderer: $.fn.dataTable.Responsive.renderer.tableAll( {tableClass:"table"})}}} );} );</script>';

            var bindingTabledataFirst =
              '<table id="example" class="table table-striped table-bordered dt-responsive nowrap" style="width:100%"><thead><tr><th>OWNER<br> NAME</th><th>BOAT <br>NAME</th><th>SUMMER<br> WEEKEND</th><th>SUMMER<br> WEEKDAYS</th><th>WINTER<br> WEEKEND</th><th>WINTER<br> WEEKDAYS</th><th>BOOKED<br> DAYS</th><th>ACTION</th></tr></thead><tbody id="id-tbody-allBoats">' +
              bindingTableData +
              '</tbody></table>' +
              sriptTemp +
              '';
            let undefineddata = '<table id="example" class="table table-striped table-bordered dt-responsive nowrap" style="width:100%"><thead><tr><th>OWNER<br> NAME</th><th>BOAT <br>NAME</th><th>SUMMER<br> WEEKEND</th><th>SUMMER<br> WEEKDAYS</th><th>WINTER<br> WEEKEND</th><th>WINTER<br> WEEKDAYS</th><th>BOOKED<br> DAYS</th><th>ACTION</th></tr></thead><tbody id="id-tbody-allBoats">' +
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

    //End sibi.........................................

    $("input[type='number']").inputSpinner();
    /*
    $('#example').DataTable( {
        responsive: {
            details: {
                display: $.fn.dataTable.Responsive.display.modal( {
                    header: function ( row ) {
                        var data = row.data();
                        return 'Details for '+data[0]+' '+data[1];
                    }
                } ),
                renderer: $.fn.dataTable.Responsive.renderer.tableAll( {
                    tableClass: 'table'
                } )
            }
        }
    } );

    */
    jQuery(document).ready(function () {
      // executes when HTML-Document is loaded and DOM is ready

      jQuery('.btn1[href^=#]').click(function (e) {
        e.preventDefault();
        var href = jQuery(this).attr('href');
        jQuery(href).modal('toggle');
      });
    });
    $(document).ready(function () {
      var max_fields = 10; //maximum input boxes allowed
      var wrapper = $('.add-date'); //Fields wrapper
      var add_button = $('.add_field_button'); //Add button ID

      var x = 1; //initlal text box count
      $(add_button).click(function (e) {
        //on add input button click
        e.preventDefault();
        if (x < max_fields) {
          //max input box allowed
          x++; //text box increment
          $(wrapper).append(
            '<div class="row date-add-field"><input type="date" class="form-control col-md-7" data-zdp_readonly_element="false"><a  href="#" class="remove_field col-md-3">Remove</a></div>'
          ); //add input box
        }
      });

      $(wrapper).on('click', '.remove_field', function (e) {
        //user click on remove text
        e.preventDefault();
        $(this).parent('div').remove();
        x--;
      });
    });

    this.getBoats();
    //this.getOwners()
    this.getAllManageOwners();
    this.ifEditValue();
  }

  startTimer_set_manageOwner_Edit() {
    setInterval(() => {
      //sessionStorage.setItem("set_manageOwner_Edit",JSON.stringify(temp_Arry));
      var temp_data = sessionStorage.getItem('set_manageOwner_Edit');
      if (typeof temp_data !== 'undefined' && temp_data != null) {
        sessionStorage.removeItem('set_manageOwner_Edit');
        var obj = JSON.parse(temp_data);
        this.editManageOwner_new(obj);
      }

      // this.remove_close_drpdown()
    }, 1000);
  }

  editManageOwner_new(obj) {
    this.dropdownOwn_Boat_selected = [];
    this.dropdownOwn_Boat_selected.push({
      item_id: obj.BoatDetails[0]._id,
      item_text: obj.Boat_Name,
    });

    this.dropdownBoat_Owner_selected_model = [];
    this.dropdownBoat_Owner_selected_model.push({
      item_id: obj._id,
      item_text: obj.Owner_Name,
    });

    this.scrollToTop();
    this.addBtnFlag = false;
    this.editBtnFlag = true;

    this.managerOwnerId = obj._id;
    this.manageOwnerForms.get('Owner_Name').setValue(obj.Owner_Name);
    this.manageOwnerForms.get('Owner_Id').setValue(obj.Owner_Id);
    this.manageOwnerForms.get('Boat_Id').setValue(obj.BoatDetails[0]._id);
    this.manageOwnerForms.get('Boat_Name').setValue(obj.Boat_Name);
    this.manageOwnerForms
      .get('Owners_Allowed')
      .setValue(obj.BoatDetails[0].Owners_Allowed);

    this.manageOwnerForms
      .get('No_of_SummerWeekDays')
      .setValue(obj.Summer_WeekDays);
    this.manageOwnerForms
      .get('No_of_SummerWeekEndDays')
      .setValue(obj.Summer_WeekEndDays);
    this.manageOwnerForms
      .get('No_of_WinterWeekDays')
      .setValue(obj.Winter_WeekDays);
    this.manageOwnerForms
      .get('No_of_WinterWeekEndDays')
      .setValue(obj.Winter_WeekEndDays);

    //$("#project1").attr('disabled', 'disabled');
    //$("#project2").attr('disabled', 'disabled');
    //$("#project3").attr('disabled', 'disabled');
  }

  sidemenuloder() {
    $('#a-menu-Owners-main').attr('aria-expanded', 'true');
    $('#a-menu-Owners-main').removeClass('collapsed');
    $('#id-submenu-child-Owners-Manage-Owner').css({
      background: 'white',
      color: 'black',
      padding: 'inherit',
      'border-radius': 'inherit',
      'margin-right': '-9px',
    });
    $('#owner').addClass('show');
  }

  onItemSelect(item: any) {
    var finddate = this.dropdownList.find((x) => x._id == item.item_id);
    this.set_BoatType = finddate.Boattype_Name;
  }
  onDeSelectBoat(items: any) {
    this.manageOwnerForms.reset();
  }
  onboatSelect(items: any) {
    this.dropdownBoat_Owner_selected_model = '';

    this.checkCurrent = false;
    this.selectedBoat = items;
    this.boatId = items.item_id;
    this.getBoatId(this.boatId);
    this.getOwners_New(items.item_id);
  }
  onboatAll(items: any) {}
  onDeSelectowner(item: any) {
    this.manageOwnerForms.get('Owner_Name').setValue('');
    this.manageOwnerForms.get('Owner_Id').setValue('');
  }

  onItemOwnerSelect(item: any) {
    this.public_Owner_Name = item.item_text;
    this.public_Owner_Id = item.item_id;

    this.manageOwnerForms.get('Owner_Name').setValue(item.item_text);
    this.manageOwnerForms.get('Owner_Id').setValue(item.item_id);

    //this.remove_close_drpdown()
  }

  //   remove_close_drpdown() {
  //     setInterval(() => {

  //       $(".selected-item").children("a").remove();

  //    },10)
  //  }

  onOwnerSelectAll(items: any) {}

  getOwners_New(boat_Id) {
    var obj = Object();
    obj.boatid = boat_Id;

    this.http
      .post<any>(`${this.OwnerUrl}/GetUnAssignedOwnerDetailsByBoatId`, obj)
      .subscribe(
        (data) => {
          $('.selected-item').children('a').remove();
          this.owners = data['response'];
          console.log(this.owners);

          this.dropdownOwnerList = data.response;

          var ownerArray = [];
          this.allManageData.forEach((ele) => {
            this.owner.forEach((element) => {
              var obj2 = Object();
              if (element.length > 0 || ele.length > 0) {
                if (
                  element._id == ele.Owner_Id &&
                  this.selectedBoat.item_id == ele.BoatDetails[0]._id
                ) {
                  this.owners.splice(this.owners.indexOf(element), 1);
                }
              }
            });
          });

          this.owners.forEach((element) => {
            var obj2 = Object();

            (obj2.item_id = element._id),
              (obj2.item_text = element.First_Name.concat(
                ' ',
                element.Last_Name
              ));

            var filter_sowner = ownerArray.find(
              (x) => x.item_id == element._id
            );

            if (filter_sowner == null) {
              ownerArray.push(obj2);
            }
          });

          this.dropdownOwnerList_filted = ownerArray;
        },
        (err) => {}
      );
  }

  scrollToTop() {
    this.scroll.scrollToPosition([0, 0]);
  }

  ifEditValue() {
    this.data = JSON.parse(sessionStorage.getItem('manageOwnerData')); //forgot to close

    if (this.data) {
      this.addBtnFlag = false;
      this.editBtnFlag = true;
      this.managerOwnerId = this.data._id;
      this.manageOwnerForms.get('Owner_Name').setValue(this.data.Owner_Name);
      this.manageOwnerForms.get('Owner_Id').setValue(this.data.Owner_Id);
      this.manageOwnerForms.get('Boat_Id').setValue(this.data.Boat_Id);
      this.manageOwnerForms.get('Boat_Name').setValue(this.data.Boat_Name);
      this.manageOwnerForms
        .get('ShareAllocation')
        .setValue(this.data.ShareAllocation);
      this.manageOwnerForms
        .get('Owners_Allowed')
        .setValue(this.data.Owners_Allowed);
      this.manageOwnerForms.get('Boat_Type').setValue(this.data.Boat_Type);
    }
  }
  getBoats() {
    var obj = Object();
    obj.alphabet = '';
    this.http.get<any>(`${this.OwnerUrl}/GetBoat`).subscribe(
      (data) => {
        this.boats = data['response'];
        this.dropdownList = data.response;
        var tempArray = [];
        data.response.forEach((element) => {
          var obj2 = Object();
          (obj2.item_id = element._id), (obj2.item_text = element.Boat_Name);
          tempArray.push(obj2);
        });
        this.dropdownList_filted = tempArray;
      },
      (err) => {}
    );
  }
  get mof() {
    return this.manageOwnerForms.controls;
  }

  manageOwnerForm() {
    this.manageOwnerForms = this.fb.group({
      Boat_Name: new FormControl('', [Validators.required]),
      Boat_Id: new FormControl('', [Validators.required]),
      No_of_SummerWeekDays: new FormControl('', [Validators.required]),
      No_of_SummerWeekEndDays: new FormControl('', [Validators.required]),
      No_of_WinterWeekDays: new FormControl('', [Validators.required]),
      No_of_WinterWeekEndDays: new FormControl('', [Validators.required]),
      Boat_Type: new FormControl(''),
      Owner_Name: new FormControl('', [Validators.required]),
      Owner_Id: new FormControl('', [Validators.required]),
      Owners_Allowed: new FormControl('', [Validators.required]),
      ShareAllocation: new FormControl('', [Validators.required]),
      id: new FormControl(''),
    });
  }

  getBoatId(id) {
    //for (let i = 0; i < this.boats.length; i++) {
    // if(this.boats[i]._id == id)
    // {
    //     this.boatName = this.boats[i].Boat_Name
    // }

    var obj = {
      boatid: id,
    };

    this.http.post<any>(`${this.OwnerUrl}/GetSeasonDetailsById`, obj).subscribe(
      (data) => {
        var math = data.Data[0].Owners_Allowed;
        var maths = 100 / math;

        this.manageOwnerForms
          .get('No_of_SummerWeekDays')
          .setValue(data.ShareResponse[0].No_of_SummerWeekDays);
        this.manageOwnerForms
          .get('No_of_SummerWeekEndDays')
          .setValue(data.ShareResponse[0].No_of_SummerWeekEndDays);
        this.manageOwnerForms
          .get('No_of_WinterWeekDays')
          .setValue(data.ShareResponse[0].No_of_WinterWeekDays);
        this.manageOwnerForms
          .get('No_of_WinterWeekEndDays')
          .setValue(data.ShareResponse[0].No_of_WinterWeekEndDays);

        this.manageOwnerForms
          .get('Owners_Allowed')
          .setValue(data.Data[0].Owners_Allowed);
        this.manageOwnerForms.get('Boat_Name').setValue(data.Data[0].Boat_Name);
        this.manageOwnerForms.get('Boat_Id').setValue(data.Data[0]._id);

        this.manageOwnerForms
          .get('Boat_Type')
          .setValue(data.Data[0].Boattype_Name);
        this.manageOwnerForms.get('ShareAllocation').setValue(maths);
      },
      (err) => {}
    );

    // }
  }

  getOwners_() {
    this.http.get<any>(`${this.OwnerUrl}/GetAllOwnerDetails`).subscribe(
      (data) => {
        this.allManageData = data['response'];
        if (data.status == true) {
          this.http.get<any>(`${this.OwnerUrl}/GetOwners`).subscribe(
            (data) => {
              this.owners = data['response'];
              this.owner = data['response'];

              this.dropdownOwnerList = data.response;

              var ownerArray = [];
              this.allManageData.forEach((ele) => {
                this.owner.forEach((element) => {
                  var obj2 = Object();
                  if (element.length > 0 || ele.length > 0) {
                    if (
                      element._id == ele.Owner_Id &&
                      this.selectedBoat.item_id == ele.BoatDetails[0]._id
                    ) {
                      this.owners.splice(this.owners.indexOf(element), 1);
                    }
                  }
                });
              });

              this.owners.forEach((element) => {
                var obj2 = Object();

                (obj2.item_id = element._id),
                  // Concatination firstname and lastname for manage owner//Done By Alagesan on 29.06.2021
                  (obj2.item_text = element.First_Name.concat(
                    ' ',
                    element.Last_Name
                  ));
                ownerArray.push(obj2);
              });

              this.dropdownOwnerList_filted = ownerArray;
            },
            (err) => {}
          );
        }
      },
      (err) => {}
    );
  }

  getOwnerId(id) {
    for (let i = 0; i < this.owners.length; i++) {
      if (this.owners[i]._id == id) {
        this.ownerName = this.owners[i].First_Name;
        this.manageOwnerForms.get('Owner_Name').setValue(this.ownerName);
      }
    }
  }

  saveManageOwner() {
    this.manageOwnerSubmitted = true;

    if (this.manageOwnerForms.invalid) {
      if (this.public_Owner_Name == null) {
        this.commenMessages = 'Select Owner name.';

        $('#btn-CommenMessage-disp-btns').trigger('click');
      } else {
        return;
      }
    }

    if (this.public_Owner_Name != null) {
      this.http
        .post<any>(`${this.OwnerUrl}/ManageOwner`, this.manageOwnerForms.value)
        .subscribe(
          (data) => {
            if (data.status == true) {
              this.dropdownOwn = [];
              this.dropdownBoat = [];
              $('#myModal').modal({ backdrop: 'static', keyboard: false });
              this.boatId = '';

              this.getResponce = data.message;
              // this.manageOwnerForms.reset()
              // this.manageOwnerSubmitted = false;
              $('#pop-up-btn').trigger('click');
            } else if (data.status == false) {
              this.getResponce = data.message;
              // this.manageOwnerForms.reset()
              //this.manageOwnerSubmitted = false;
              $('#pop-up-btn').trigger('click');
            } else {
              alert('error.');
              location.reload();
            }

            // this.dropdownOwn =[];
            // this.dropdownBoat = []

            //this.getAllManageOwners()
          },
          (err) => {
            this.commenMessages = err;

            $('#btn-CommenMessage-disp-btns').trigger('click');
          }
        );
    }
  }

  getAllManageOwners_old() {
    this.http.get<any>(`${this.OwnerUrl}/GetAllOwnerDetailsByBoatId`).subscribe(
      (data) => {
        this.allManageData = data['response'];
      },
      (err) => {}
    );
  }

  getAllManageOwners() {
    this.http.get<any>(`${this.OwnerUrl}/GetAllOwnerDetails`).subscribe(
      (data) => {
        this.allManageData = data['response'];
      },
      (err) => {}
    );
  }

  edit() {
    this.manageOwnerSubmitted = true;

    // if (this.manageOwnerForms.invalid) {
    //   return;
    // }
    var objs = {
      id: this.managerOwnerId,
      ShareAllocation: this.manageOwnerForms.value, //this.manageOwnerForms.controls.ShareAllocation.value
    };

    this.manageOwnerForms.get('id').setValue(this.managerOwnerId);

    console.log(this.manageOwnerForms.value);

    this.http
      .post<any>(
        `${this.OwnerUrl}/UpdateManageOwnerById`,
        this.manageOwnerForms.value
      )
      .subscribe(
        (data) => {
          this.getResponce = data.message;
          this.manageOwnerForms.reset();
          this.manageOwnerSubmitted = false;
          $('#pop-up-btn').trigger('click');
          this.addBtnFlag = true;
          this.editBtnFlag = false;
          sessionStorage.setItem('manageOwnerData', JSON.stringify('')); // if it's object
          this.getAllManageOwners();
        },
        (err) => {}
      );
  }
  deleteManageOwner(id) {
    this.manageOwnerId = id._id;
    $('#removeBoat').trigger('click');
  }
  delete() {
    this.manageOwnerId = sessionStorage.getItem('selected_d_MangerOwner');

    var obj = {
      id: this.manageOwnerId,
    };
    this.http
      .post<any>(`${this.OwnerUrl}/DeleteManageOwnersById`, obj)
      .subscribe(
        (data) => {
          this.getResponce = data.message;
          $('#pop-up-btn').trigger('click');
          $('#removeBoat').trigger('click');

          location.reload();

          // this.getAllManageOwners();
        },
        (err) => {}
      );
  }

  reloadPage() {
    location.reload();
  }
}
