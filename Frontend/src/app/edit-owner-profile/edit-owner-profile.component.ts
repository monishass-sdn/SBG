import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormGroup, FormControl,FormBuilder, Validators} from '@angular/forms';
// import environment for edit owner profile Done By Alagesan	on 06.07.2021
import { environment } from '../../environments/environment';
declare var $: any;
declare var jQuery: any; 
@Component({
  selector: 'app-edit-owner-profile',
  templateUrl: './edit-owner-profile.component.html',
  styleUrls: ['./edit-owner-profile.component.css']
})
export class EditOwnerProfileComponent implements OnInit {
  form: FormGroup;
  // Add Base URL for edit owner profile  Done By Alagesan	on 06.07.2021
  EnvironmentURL:string = environment.url;
  url = this.EnvironmentURL+"api/Owner"
  boaturl = this.EnvironmentURL+"api/Boat"
  imgUrl = this.EnvironmentURL+"api/uploads/"

  submitted = false;
  handBook: File;
  data:any;
  ownerlogin: any;
  messages:any;
  CommenMessages:any;
  constructor(private http: HttpClient ,private fb: FormBuilder, private router: Router,) { 
    this.createForm();
   }

 
   ngOnInit(): void {
     
    $(".mobile-menu-icon").click(function(){
      $(".side-menu").toggleClass("mobile-sidebar");
    });

    sessionStorage.setItem("owner-dashboard-relodePg","1");
    this.ownerlogin = JSON.parse(sessionStorage.getItem("userlogin"));
    if(this.ownerlogin==false){
      this.router.navigate(['/owner-login/']);
    }
    sessionStorage.setItem("relodePg_book-for-owner","1");
    sessionStorage.setItem("Adminbooking-relodePg","1");
     sessionStorage.setItem("boat-maintenance-reload","1");
     sessionStorage.setItem("view-boat-reload","1");
     
    this.data = JSON.parse(sessionStorage.getItem('Ownerlogin'));
    
    
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
  this.setOwnersValues()
  }
  
  get f() { return this.form.controls; }

  singleImage(event, imageFor){
    this.handBook = <File>event.target.files[0];
    
  // this.singleUploadImage(imageFor);

}
singleUploadImage(imageFor){
  if(this.handBook){
      const fd = new FormData();  
      fd.append("file",this.handBook);
      this.http.post<any>(`${this.url}/FileUploadSingle`, fd).subscribe(data => {
        
       
          if(data.status==false){
          
          this.CommenMessages = data.message;
          $('#btn-CommenMessage-disp-btns').trigger('click');
          }
          else if(data.status==true){
            this.CommenMessages = data.message;
            $('#btn-CommenMessage-disp-btns').trigger('click');
           
          } 
          }, err => {
            
          })
        }
    }
    setOwnersValues(){
      this.form.get('_id').setValue(this.data._id);
      this.form.get('First_Name').setValue(this.data.First_Name);
      this.form.get('Last_Name').setValue(this.data.Last_Name);
      this.form.get('Home_Address').setValue(this.data.Home_Address);
      this.form.get('Email').setValue(this.data.Email);
      this.form.get('Password').setValue("");
      console.log(this.data.Password);
      console.log(this.data.DecryptPassword);
      if(this.data.DecryptPassword){
        //let decoded = atob(this.data.DecryptPassword);
          this.form.get('DecryptPassword').setValue(this.data.DecryptPassword);
        } 
        else {
          this.form.get('DecryptPassword').setValue("");
        }
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
  createForm() {
    this.form = this.fb.group({
      _id: new FormControl('', [Validators.required,]),
      First_Name: new FormControl('', [Validators.required,]),
      Last_Name: new FormControl('', [Validators.required, ]),
      Home_Address: new FormControl('', [Validators.required, ]),
      Email: new FormControl('', [Validators.required, Validators.email ]),
      Password: new FormControl('', [Validators.required, ]),
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
  editOwner(){
    // let paswrd = this.form.get('DecryptPassword').value;
    // console.log(paswrd);
    // if(paswrd){
    // let encoded = btoa(paswrd);
    // this.form.get('DecryptPassword').setValue(encoded);
    // }
    this.form.get('Block').setValue(true);
    this.form.get('IsActive').setValue(true);
    if(this.handBook){
      const fd = new FormData();  
      fd.append("file",this.handBook);
      this.http.post<any>(`${this.url}/FileUploadSingle`, fd).subscribe(data => {
        
       
          if(data.status==false){

            this.messages = data.message;
                  $('#error-disp-btns').trigger('click');

          }
          else if(data.status==true){

            this.form.get('Profile_Image').setValue(data.data.filename);
            

            this.http.post<any>(`${this.url}/EditOwner`,  this.form.value).subscribe(data => {
             
             
             
                if(data.status==false){
                  this.messages = data.message;
                  $('#error-disp-btns').trigger('click');
                }
                else if(data.status==true){
                  this.messages = data.message;
                  sessionStorage.setItem('Ownerlogin', JSON.stringify(data.data));   // if it's object
                  $('#Sucess-message-disp-btns').trigger('click');

                  

                } 
                }, err => {
                  
                })
          } 
          }, err => {
            
          })
        }
        else{
          
          this.http.post<any>(`${this.url}/EditOwner`,  this.form.value).subscribe(data => {
           
                       
              if(data.status==false){
                this.messages = data.message;
                  $('#error-disp-btns').trigger('click');
              }
              else if(data.status==true){
                
                  this.messages = data.message;
                  sessionStorage.setItem('Ownerlogin', JSON.stringify(data.data));   // if it's object
                  $('#Sucess-message-disp-btns').trigger('click');



              } 
              }, err => {
                
              })
        }
  }


  RedirectToAction(){

    this.router.navigate(['myprofile/']);

  }

}
