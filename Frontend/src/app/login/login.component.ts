import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormGroup, FormControl,FormBuilder, Validators} from '@angular/forms';
// import environment for login Done By Alagesan	on 06.07.2021
import { environment } from '../../environments/environment';
declare var $: any;
declare var jQuery: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  submitted = false;
  getReplay: any;
  rememberMe:boolean;
  isChecked: any;
  show: boolean = false;
  constructor(private http: HttpClient ,private fb: FormBuilder, private router: Router,) { 
    this.createForm();
   }
  // Add Base URL for all owners  Done By Alagesan	on 06.07.2021
  EnvironmentURL:string = environment.url;
  url = this.EnvironmentURL+"api/Login"
  
  
  ngOnInit(): void {
    sessionStorage.setItem("relodePg","1");
    this.timeZoon();
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

  binding_userDatas(){

    var get_OwnerLoginDetails = JSON.parse(localStorage.getItem("logindatas_Admin"));
    if(typeof get_OwnerLoginDetails !== "undefined" && get_OwnerLoginDetails != null)
    {
     
     this.form.get('Email').setValue(get_OwnerLoginDetails.Email);
    this.form.get('Password').setValue(get_OwnerLoginDetails.Password);

    }

  }

  timeZoon()
  {

    
    var offset = Intl.DateTimeFormat().resolvedOptions().timeZone;
    //alert(offset);


  }

  

  password() {
    this.show = !this.show;
   }




login(){





var datsChek_rememberMe = this.form.value;
if(datsChek_rememberMe.rememberMe)
{
  var obj = Object();
  obj.Email = datsChek_rememberMe.Email;
  obj.Password = datsChek_rememberMe.Password;

  localStorage.setItem("logindatas_Admin",JSON.stringify(obj));

}

  this.submitted = true;
  if (this.form.invalid) {
    return;
}




  this.http.post<any>(`${this.url}/Login`,  this.form.value   ).subscribe(data => {
    
    
    
    if(data.status==false){
      $('#error-disp-btns').trigger('click');
      this.getReplay = data.message
    }
    else if(data.status==true){

      var userIds = data.data._id;
      sessionStorage.setItem('UserId', userIds)    

      sessionStorage.setItem("permiss",JSON.stringify(data));

      sessionStorage.setItem('userToken', JSON.stringify(data.token));   // if it's object

      sessionStorage.setItem('adminLogin', JSON.stringify(true));   // if it's object

      //   let seassionVal = sessionStorage.getItem('seassionObj');
      //   if (seassionVal !== null) {
      //     let sessionObj = JSON.parse(seassionVal);
      //     let expiredAt = new Date(value.expiredAt);
      //     if (expiredAt > new Date()) { // Validate expiry date.
      //       return sessionObj.value;
      //     } else {
      //       sessionStorage.removeItem('seassionObj');
      //     }
      //   }
      //     return null;
      
      // let expiredAt = new Date(new Date().getTime() + (60000 * 1));
      // let obj = {
      //   value: data.token,
      //   expiredAt: expiredAt.toISOString()
      // }
      // sessionStorage.setItem('seassionObj', JSON.stringify(obj));

      this.router.navigate(['dashboard/']);
    }
    }, err => {
      console.log(err);
    })
}
}
