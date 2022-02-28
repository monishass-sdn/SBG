import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormGroup, FormControl,FormBuilder, Validators} from '@angular/forms';
// import environment for owner login Done By Alagesan	on 06.07.2021
import { environment } from '../../environments/environment';
declare var $: any;
declare var jQuery: any;

@Component({
  selector: 'app-owner-login',
  templateUrl: './owner-login.component.html',
  styleUrls: ['./owner-login.component.css']
})
export class OwnerLoginComponent implements OnInit {

  form: FormGroup;
  submitted = false;
  getReplay: any;
  isChecked: any;
  rememberMe:boolean;
  show: boolean = false;
  constructor(private http: HttpClient ,private fb: FormBuilder, private router: Router,) { 
    this.createForm();
   }
   // Add Base URL for owner login  Done By Alagesan	on 06.07.2021
  EnvironmentURL:string = environment.url;
  
  url = this.EnvironmentURL+"api/Owner"
  
  
  ngOnInit(): void {
    //this.rememberMe = false;
    sessionStorage.setItem("owner-dashboard-relodePg","1");
    sessionStorage.setItem("owner-dashboard-relodePg-safari","1");

    

    this.binding_userDatas();

  }
  get f() { return this.form.controls; }

  createForm() {
    this.form = this.fb.group({
      Email: new FormControl('', [Validators.required, Validators.email]),
      Password: new FormControl('', [Validators.required, ]),
      rememberMe: new FormControl(''),
    
    });
  }

  onChange(ddd){
    

  }

  password() {
    this.show = !this.show;
   }


  binding_userDatas(){

    var get_OwnerLoginDetails = JSON.parse(localStorage.getItem("logindatas_Owner"));
    if(typeof get_OwnerLoginDetails !== "undefined" && get_OwnerLoginDetails != null)
    {
     
     this.form.get('Email').setValue(get_OwnerLoginDetails.Email);
    this.form.get('Password').setValue(get_OwnerLoginDetails.Password);

    }

  }

ownerLogin(){

//rememberMe
var datsChek_rememberMe = this.form.value;
if(datsChek_rememberMe.rememberMe)
{
  var obj = Object();
  obj.Email = datsChek_rememberMe.Email;
  obj.Password = datsChek_rememberMe.Password;

  localStorage.setItem("logindatas_Owner",JSON.stringify(obj));

}


  this.submitted = true;
  if (this.form.invalid) {
    return;
}

console.log(this.form.value);


  this.http.post<any>(`${this.url}/OwnerLogin`,  this.form.value   ).subscribe(data => {
    
    if(data.status==false){
      $('#error-disp-btns').trigger('click');
      this.getReplay = data.message
    }
    else if(data.status==true){
      sessionStorage.setItem('userToken', JSON.stringify(data.token));
      sessionStorage.setItem('userlogin', JSON.stringify(true));
      sessionStorage.setItem('Ownerlogin', JSON.stringify(data.data));   // if it's object
      console.log(data.data);
      // sessionStorage.setItem('Email', JSON.stringify(data.Email));
      // sessionStorage.setItem('First_Name', JSON.stringify(data.First_Name));
      this.router.navigate(['owner-dashboard/']);
    }
    }, err => {
      console.log(err);
    })
}

forgotpassword(){
  this.router.navigate(['forgot-password-owner/']);
}
}
