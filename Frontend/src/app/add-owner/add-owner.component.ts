import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormGroup, FormControl,FormBuilder, Validators} from '@angular/forms';
// import environment for add owner  Done By Alagesan	on 06.07.2021
import { environment } from '../../environments/environment';

declare var $: any;
declare var jQuery: any; 
@Component({
  selector: 'app-add-owner',
  templateUrl: './add-owner.component.html',
  styleUrls: ['./add-owner.component.css']
})
export class AddOwnerComponent implements OnInit {
  EnvironmentURL:string = environment.url;
  form: FormGroup;
  url = this.EnvironmentURL+"api/Owner"
  boaturl = this.EnvironmentURL+"api/Boat"
  submitted = false;
  handBook: File;
  singleFileDetails : any;
  adminlogin: any;
  profilePicResponse= "";
  addownerMessage:any;
  show: boolean = false;
  // Parking Ability, sailing ability, housekeeping  for add owner  Done By Alagesan	on 20.07.2021
  parkingAbilityMessage: boolean =false;
  sailingabilityMessage: boolean =false;
  housekeepingMessage: boolean =false;
  commenMessages:any;

  // Parking Ability for add owner  Done By Alagesan	on 20.07.2021
  Parking_Ability_List = [
    {name: 'Parking_Ability', value: 'Expert', checked: false},
    {name: 'Parking_Ability', value: 'Intermediate', checked: false},
    {name: 'Parking_Ability', value: 'Beginner', checked: false},
    {name: 'Parking_Ability', value: 'Need Assistance', checked: false}
  ]
  // Sailing ability  for add owner  Done By Alagesan	on 20.07.2021
  Sailing_Ability_List = [
    {name: 'Sailing_Ability', value: 'Expert', checked: false},
    {name: 'Sailing_Ability', value: 'Intermediate', checked: false},
    {name: 'Sailing_Ability', value: 'Beginner', checked: false},
    {name: 'Sailing_Ability', value: 'Need Assistance', checked: false}
  ]
  // Housekeeping  for add owner  Done By Alagesan	on 20.07.2021
  Housekeeping_List = [
    {name: 'Housekeeping', value: 'High', checked: false},
    {name: 'Housekeeping', value: 'Medium', checked: false},
    {name: 'Housekeeping', value: 'Low', checked: false},
  ]

  constructor(private http: HttpClient ,private fb: FormBuilder, private router: Router,) { 
    this.createForm();
   }

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
     
    var readURL = function(input) {
      //Upload profile image max size exceeded message for add owner Done By Alagesan  on 16.06.2021
      var maxSize = 2097152;
      var current_size = input.files[0].size; 
      if (input.files && input.files[0] && current_size < maxSize) {
          var reader = new FileReader();

          reader.onload = function (e) {
              $('.profile-pic').attr('src', e.target.result);
          }
  
          reader.readAsDataURL(input.files[0]);
      }
  }
  


  $(".file-upload").on('change', function(){
      readURL(this);
  });
  
  $(".upload-button").on('click', function() {
     $(".file-upload").click();
  });
  }

  // Parking Ability for add owner  Done By Alagesan	on 20.07.2021
  onParkingItemChange(parkingvalue){
    this.parkingAbilityMessage = parkingvalue;
  }
  // Sailing ability  for add owner  Done By Alagesan	on 20.07.2021
  onSailingItemChange(sailingvalue){
    this.sailingabilityMessage = sailingvalue;
  }
  // Housekeeping  for add owner  Done By Alagesan	on 20.07.2021
  onHousekeepingItemChange(housekeepingvalue){
    this.housekeepingMessage = housekeepingvalue;
  }

  sidemenuloder(){    
    $("#a-menu-Owners-main").attr("aria-expanded","true");        
    $("#a-menu-Owners-main").removeClass("collapsed"); 
    $("#id-submenu-child-Owners-Add-Owner").
    css({"background": "white", "color": "black",
    "padding": "inherit","border-radius": "inherit","margin-right": "-9px"});  
    $("#owner").addClass("show");
  }
  createForm() {
    this.form = this.fb.group({
      First_Name: new FormControl('', [Validators.required,]),
      Last_Name: new FormControl('', [Validators.required, ]),
      Home_Address: new FormControl('', []),
      Email: new FormControl('', [Validators.required, Validators.email ]),
      Password: new FormControl('', [Validators.required, ]),
      Profile_Image: new FormControl('', [ ]),
      Mobile: new FormControl('', [Validators.required, ]),
      Family_Name: new FormControl('', [ ]),
      
      Sailing_Ability: new FormControl('', [Validators.required,]),
      Housekeeping: new FormControl('', [Validators.required,]),
      Emergency_Contact_Name: new FormControl('', [ ]),
      Emergency_Contact_Mobile: new FormControl('', [ ]),
      Notes: new FormControl('', []),
      
      Parking_Ability: new FormControl('', [Validators.required,]),
      Block: new FormControl('', [ ]),
      DecryptPassword:new FormControl('', [ ]),
      IsActive: new FormControl('', [ ]),
    });
  }
  get f() { return this.form.controls; }
  addOwner(){

    $("#shown-loader-commen").css("display", "block");
   
    this.submitted = true;
  

    if (this.form.invalid) {
      $("#shown-loader-commen").css("display", "none");
      return;
  }

    if(this.handBook){
      var singleIMg = this.singleFileDetails;//this.handBook.name

      }
    
    this.form.get('Block').setValue(true);
    let paswrd = this.form.get('Password').value;
    console.log(paswrd);
    let encoded = btoa(paswrd);
    this.form.get('DecryptPassword').setValue(encoded);
    this.form.get('IsActive').setValue(true);
    this.form.get('Profile_Image').setValue(this.singleFileDetails);
   
    
    this.http.post<any>(`${this.url}/AddOwner`,  this.form.value).subscribe(data => {

      $("#shown-loader-commen").css("display", "none");
      
      // Modal popup for add Owner//Done By Alagesan
      if(data.status == true){
        $('#myModal').modal({backdrop: 'static', keyboard: false});
      }

      // profile pic for add Owner//Done By Alagesan
      if(data.status==true){
        $('.profile-pic').attr('src', '/assets/images/dummy-owner-img.jpg');
      }
      if(data.status==false){
        this.submitted = false;


        this.commenMessages =data.message;

        $('#btn-CommenMessage-disp-btns').trigger('click');

       
        }
        else if(data.status==true){
          this.submitted = false;
          this.addownerMessage = data.message;
          $('#error-disp-btns').trigger('click');
          
         
        }
        }, err => {

          $("#shown-loader-commen").css("display", "none");
          
        })
  }
  singleImage(event, imageFor){
    //Upload profile image max size exceeded message for add owner Done By Alagesan  on 16.06.2021
    var maxSize = 2097152;
    var current_size = event.target.files[0].size;
    if (current_size > maxSize) {
    this.profilePicResponse = "Profile image maximum size is exceeded"
      $('#profileImageModel').trigger('click');
    }
    if (current_size < maxSize) {
      this.handBook = <File>event.target.files[0];
    this.singleUploadImage(imageFor);
     }
  
  }

  singleUploadImage(imageFor){
if(this.handBook){
    const fd = new FormData();  
    fd.append("file",this.handBook);
    this.http.post<any>(`${this.url}/FileUploadSingle`, fd).subscribe(data => {
      
     
         var result = data.data;      
         if(data.status==false){
          this.commenMessages =data.message;

          $('#btn-CommenMessage-disp-btns').trigger('click');
         }
         else if(data.status==true){
        
          this.singleFileDetails = result.filename;
          
         
          
         } 
        }, err => {
         
        })
      }
  }
  goToViewPage(){
    this.router.navigate(['/all-owner/']);

  }

  password() {
    this.show = !this.show;
   }


  Encrypt(str) {
    if (!str) str = "";
    str = (str == "undefined" || str == "null") ? "" : str;
    try {
        var key = 146;
        var pos = 0;
        var ostr = '';
        while (pos < str.length) {
            ostr = ostr + String.fromCharCode(str.charCodeAt(pos) ^ key);
            pos += 1;
        }

        return ostr;
    } catch (ex) {
        return '';
    }
}

 Decrypt(str) {
    if (!str) str = "";
    str = (str == "undefined" || str == "null") ? "" : str;
    try {
        var key = 146;
        var pos = 0;
        var ostr = '';
        while (pos < str.length) {
            ostr = ostr + String.fromCharCode(key ^ str.charCodeAt(pos));
            pos += 1;
        }

        return ostr;
    } catch (ex) {
        return '';
    }
}



}
