// Create Component for reset password owner //Done By Alagesan 

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormGroup, FormControl,FormBuilder, Validators} from '@angular/forms';
// import environment for reset password owner Done By Alagesan	on 06.07.2021
import { environment } from '../../environments/environment';
declare var $: any;
declare var jQuery: any; 
@Component({
  selector: 'app-reset-password-owner',
  templateUrl: './reset-password-owner.component.html',
  styleUrls: ['./reset-password-owner.component.css']
})
export class ResetPasswordOwnerComponent implements OnInit {

  form: FormGroup;
  submitted = false;
  // Add Base URL for reset password owner  Done By Alagesan	on 06.07.2021
  EnvironmentURL:string = environment.url;
  url = this.EnvironmentURL+"api/Owner"
  ConfirmPasswords= false;
  getReplay: any;
  constructor(private http: HttpClient ,private fb: FormBuilder, private router: Router,) {
    this.createForm();
   }

  ngOnInit(): void {


    this.clearAll_feelds();
   
  }
  createForm() {
    this.form = this.fb.group({
      resetPasswordToken: new FormControl('', [Validators.required,]), 
      Password: new FormControl('', [Validators.required,]), 
      ConfirmPassword: new FormControl('', [Validators.required,]),   
    });
  }
  get f() { return this.form.controls; }

  confirmPwd(){
    if(this.form.value.Password == this.form.value.ConfirmPassword){
      this.ConfirmPasswords= false
    
    }else{
      this.ConfirmPasswords= true
    }
  }

  submit(){
    
    $("#shown-loader-commen").css("display", "block");

    this.submitted = true;
    this.confirmPwd()
   
    if (this.form.invalid){
      $("#shown-loader-commen").css("display", "none");
      return;
    }
    if(this.ConfirmPasswords == true)
    {
      $("#shown-loader-commen").css("display", "none");
      this.getReplay = "Password mismatch"
      $('#error-disp-btns').trigger('click');
      return;

    }

    
    this.http.post<any>(`${this.url}/ChangePassword`,  this.form.value   ).subscribe(data => {
      
        if(data.Status == false){
          $("#shown-loader-commen").css("display", "none");
          this.getReplay = data.message
          $('#error-disp-btns').trigger('click');
        }
        else if(data.Status == true){
          $("#shown-loader-commen").css("display", "none");
          this.getReplay = data.message
          $('#Success-error-disp-btns').trigger('click');
          
        }
        }, err => {

          $("#shown-loader-commen").css("display", "none");
          
        })
  }

  close(){
    this.router.navigate(['owner-login/']);
  }

  clearAll_feelds()
  {

    //$("#txt-resetPasswordToken").val("");
    this.form.get('resetPasswordToken').setValue("");
    this.form.get('Password').setValue("");
    this.form.get('ConfirmPassword').setValue("");


  }

}

// Create Component for reset password owner //Done By Alagesan 
