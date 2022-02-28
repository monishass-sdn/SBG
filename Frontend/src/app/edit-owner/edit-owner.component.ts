import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormGroup, FormControl,FormBuilder, Validators} from '@angular/forms';
// import environment for edit owner Done By Alagesan	on 06.07.2021
import { environment } from '../../environments/environment';
declare var $: any;
declare var jQuery: any; 
@Component({
  selector: 'app-edit-owner',
  templateUrl: './edit-owner.component.html',
  styleUrls: ['./edit-owner.component.css']
})
export class EditOwnerComponent implements OnInit {
  form: FormGroup;
  // Add Base URL for edit owner  Done By Alagesan	on 06.07.2021
  EnvironmentURL:string = environment.url;
  url = this.EnvironmentURL+"api/Owner";
  boaturl = this.EnvironmentURL+"api/Boat";
  pathImage = this.EnvironmentURL+"api/uploads/";

  commenMessages:any;

  show: boolean = false;

  submitted = false;
  handBook: File;
  data: any=[];
  imgUrl = this.EnvironmentURL+"api/uploads/"

  singleFileDetails: any;
  adminlogin: any;
  getResponce: any;

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
    this.data = JSON.parse(sessionStorage.getItem('ownerData')); 
    this.setOwnersValues()

    sessionStorage.setItem("relodePg_book-for-owner","1");
    sessionStorage.setItem("Adminbooking-relodePg","1");
     sessionStorage.setItem("boat-maintenance-reload","1");
     sessionStorage.setItem("view-boat-reload","1");
    var readURL = function(input) {
      if (input.files && input.files[0]) {
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
  get f() { return this.form.controls; }
  setOwnersValues(){
    console.log(this.data);
    this.form.get('_id').setValue(this.data._id);
    this.form.get('First_Name').setValue(this.data.First_Name);
    this.form.get('Last_Name').setValue(this.data.Last_Name);
    this.form.get('Home_Address').setValue(this.data.Home_Address);
    this.form.get('Email').setValue(this.data.Email);
    if(this.data.DecryptPassword){
    let decoded = atob(this.data.DecryptPassword);
      this.form.get('Password').setValue(decoded);
    } 
    else {
      this.form.get('Password').setValue("");
    }
   // this.form.get('Password').setValue(this.Decrypt(this.data.Password));
    this.form.get('Family_Name').setValue(this.data.Family_Name);
    this.form.get('Profile_Image').setValue(this.data.Profile_Image);
    this.form.get('Mobile').setValue(this.data.Mobile);
    this.form.get('Sailing_Ability').setValue(this.data.Sailing_Ability);
    this.form.get('Housekeeping').setValue(this.data.Housekeeping);
    this.form.get('Emergency_Contact_Name').setValue(this.data.Emergency_Contact_Name);
    this.form.get('Emergency_Contact_Mobile').setValue(this.data.Emergency_Contact_Mobile);
    this.form.get('Notes').setValue(this.data.Notes);
    this.form.get('Parking_Ability').setValue(this.data.Parking_Ability);
    // this.form.get('Block').setValue(this.data.First_Name);
    // this.form.get('IsActive').setValue(this.data.First_Name);

  }
  singleImage(event, imageFor){
    this.handBook = <File>event.target.files[0];

}

editOwner(){

 

  var data_owner = JSON.parse(sessionStorage.getItem("ownerData"));


  this.form.get('_id').setValue(data_owner.Owner_id);
  let paswrd = this.form.get('Password').value;
  if(paswrd == ""|| null){
    console.log("error");
    this.getResponce = 'Password must not be empty';
    $('#error-disp-btns_error').trigger('click');
    return;
  }
    console.log(paswrd);
    if(paswrd){
    let encoded = btoa(paswrd);
    this.form.get('DecryptPassword').setValue(encoded);
    }
  this.form.get('Block').setValue(true);
  this.form.get('IsActive').setValue(true);

  var passchek = this.form.value;
   //if(passchek.Password != "" || passchek.Password.length != 0){

      
      if(this.handBook)
      {
        const fd = new FormData();  
        fd.append("file",this.handBook);
        this.http.post<any>(`${this.url}/FileUploadSingle`, fd).subscribe(data => {
          
        
            if(data.status==false)
            {
              this.getResponce = data.message
              $('#error-disp-btns_error').trigger('click');
            }
            else if(data.status==true)
            {

              this.form.get('Profile_Image').setValue(data.data.filename);
                            
              this.http.post<any>(`${this.url}/EditOwner`,  this.form.value).subscribe(data => {
              
                
              
                  if(data.status==false){
                    this.getResponce = data.message
                    $('#error-disp-btns_error').trigger('click');
                  }
                  else if(data.status==true){
                    $('#error-disp-btns').trigger('click');
                    this.getResponce = data.message

                  } 
                  }, err => {
                    
                  })
            } 
                else
          {
            
            this.http.post<any>(`${this.url}/EditOwner`,  this.form.value).subscribe(data => {
              
            
                if(data.status==false){
                  this.getResponce = data.message
              $('#error-disp-btns_error').trigger('click');
                }
                else if(data.status==true){
                  $('#error-disp-btns').trigger('click');

                } 
                }, err => {
                 
                })
              }

        }, err => {
          
        });
      }
      else
      {

        
        this.http.post<any>(`${this.url}/EditOwner`,  this.form.value).subscribe(data => {
        
                  
            if(data.status==false){
              this.getResponce = data.message
              $('#error-disp-btns_error').trigger('click');
            }
            else if(data.status==true){
              //$("#wner_id_edit").text(data.message);
              this.getResponce = data.message
              $('#error-disp-btns').trigger('click');

            } 
            }, err => {
              
            });

      }
  // }
  //  else{

  //   this.commenMessages ="Password is Empty";
  //   $('#btn-CommenMessage-disp-btns').trigger('click');

     
  //  }



}


singleUploadImage(imageFor){
  if(this.handBook){
      const fd = new FormData();  
      fd.append("file",this.handBook);
      this.http.post<any>(`${this.url}/FileUploadSingle`, fd).subscribe(data => {
        
        var result = data.data;      
        if(data.status==false){
        alert(data.message)
        }
        else if(data.status==true){
       
         this.singleFileDetails = result.filename;
          
        }
          }, err => {
            
          })
        }
    }
  createForm() {
    this.form = this.fb.group({
      _id: new FormControl('', [Validators.required,]),
      First_Name: new FormControl('', [Validators.required,]),
      Last_Name: new FormControl('', [Validators.required, ]),
      Home_Address: new FormControl('', [Validators.required, ]),
      Email: new FormControl('', [Validators.required, Validators.email ]),
      Password: new FormControl('', [Validators.required]),
      Profile_Image: new FormControl('', [ ]),
      Mobile: new FormControl('', [Validators.required, ]),
      Family_Name: new FormControl('', [Validators.required, ]),
      
      Sailing_Ability: new FormControl('', [Validators.required,]),
      Housekeeping: new FormControl('', [Validators.required,]),
      Emergency_Contact_Name: new FormControl('', [Validators.required, ]),
      Emergency_Contact_Mobile: new FormControl('', [Validators.required, ]),
      Notes: new FormControl('', [Validators.required, ]),
      
      Parking_Ability: new FormControl('', []),
      Block: new FormControl('', [ ]),
      DecryptPassword:new FormControl('', [ ]),
      IsActive: new FormControl('', [ ]),
    });
  }
  goToViewPage(){
    this.router.navigate(['/all-owner/']);

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

password() {
  this.show = !this.show;
 }



}
