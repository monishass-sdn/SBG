import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormGroup, FormControl,FormBuilder, Validators} from '@angular/forms';
// import environment for profile settings Done By Alagesan	on 30.07.2021
import { environment } from '../../environments/environment';

declare var $: any;
declare var jQuery: any; 

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.css']
})
export class ProfileSettingsComponent implements OnInit {
  //profile picture settings for profile settings page //Done By Alagesan on 30.07.2021
  data: any=[];
  saveProfileSettingsform: FormGroup;
  profileSettingsSubmitted = false;
  modelTitle: string;
  getResponce: any;
  enterValidPassword: string;
  showOldPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;
  // Add Base URL for profile settings  Done By Alagesan	on 30.07.2021
  EnvironmentURL:string = environment.url;
  url = this.EnvironmentURL+"api/Owner"

  constructor(private http: HttpClient ,private fb: FormBuilder, private router: Router,) {
    this.createProfileSettingsForm();
   }

  ngOnInit(): void {
    $(".mobile-menu-icon").click(function(){
      $(".side-menu").toggleClass("mobile-sidebar");
    });

    this.data = JSON.parse(sessionStorage.getItem('Ownerlogin')); 
    
  }

    //Change password for myprofile page //Done By Alagesan on 28.07.2021
    createProfileSettingsForm() {
      this.saveProfileSettingsform = this.fb.group({
        AdminEmailId: new FormControl('', [Validators.required,]),
        OldPassword: new FormControl('', [Validators.required,]),
        NewPassword: new FormControl('', [Validators.required,]),
        ConfirmPassword: new FormControl('', [Validators.required,]),
        Owner_Id: new FormControl(''),
      }, { 
        validators: this.passwordValidation.bind(this)
      })
    }
    get psf() { return this.saveProfileSettingsform.controls; }
 //Change password for myprofile page //Done By Alagesan on 28.07.2021
 passwordValidation(formGroup: FormGroup) {
  const { value: password } = formGroup.get('NewPassword');
  const { value: confirmPassword } = formGroup.get('ConfirmPassword');
  this.enterValidPassword = "New and confirm password not same"
  if(password === confirmPassword){
    return this.enterValidPassword = "";
  }
  if(password !== confirmPassword){
    return this.enterValidPassword ;
  }
}
    //profile picture settings for profile settings page //Done By Alagesan on 30.07.2021

  showOldPasswordText() {
    this.showOldPassword = !this.showOldPassword;
   }
  //profile picture settings for profile settings page //Done By Alagesan on 30.07.2021

   showNewPasswordText() {
    this.showNewPassword = !this.showNewPassword;
   }
  //profile picture settings for profile settings page //Done By Alagesan on 30.07.2021
   showConfirmPasswordText() {
    this.showConfirmPassword = !this.showConfirmPassword;
   }

  //Save profile  settings for profile settings page //Done By Alagesan on 30.07.2021
  saveProfileSettings() {
    this.profileSettingsSubmitted = true;
  
    if(this.saveProfileSettingsform.invalid) {
      return;
    }
      
    this.saveProfileSettingsform.get('Owner_Id').setValue(this.data._id);

    this.http.post<any>(`${this.url}/ChangeNewPassword`, this.saveProfileSettingsform.value).subscribe(data => {
     
      if(data.Status == true) {
        this.modelTitle = "Profile Settings"
        this.getResponce = data.message
        this.saveProfileSettingsform.reset()
        this.profileSettingsSubmitted = false;
      }
      else if(data.status == false){
        this.modelTitle = "Profile Settings"
        this.getResponce = data.message
        this.saveProfileSettingsform.reset()
        this.profileSettingsSubmitted = false;
      }
    }, err => {


     
    })
  }

}
