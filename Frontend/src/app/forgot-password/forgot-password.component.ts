import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormGroup, FormControl,FormBuilder, Validators} from '@angular/forms';
// import environment for forgot password Done By Alagesan	on 06.07.2021
import { environment } from '../../environments/environment';
declare var $: any;
declare var jQuery: any; 
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  form: FormGroup;
  submitted = false;
  // Add Base URL for forgot password  Done By Alagesan	on 06.07.2021
  EnvironmentURL:string = environment.url;
  url = this.EnvironmentURL+"api/Login"
  getReplay: any;
  constructor(private http: HttpClient ,private fb: FormBuilder, private router: Router,) {
    this.createForm();
   }

  ngOnInit(): void {
  }
  createForm() {
    this.form = this.fb.group({
      Email: new FormControl('', [Validators.required, Validators.email]),   
    });
  }
  get f() { return this.form.controls; }

  submit(){

    debugger;
    $("#shown-loader-commen").css("display", "block");

    this.submitted = true;
    if (this.form.invalid) {
      $("#shown-loader-commen").css("display", "none");
      return;
    }
     
    this.http.post<any>(`${this.url}/ResetPassword`,  this.form.value   ).subscribe(data => {
      
         if(data.status==false){
          $("#shown-loader-commen").css("display", "none");
          this.getReplay = data.info
          $('#error-disp-btns').trigger('click');
        }

        else if(data.status==true){
          $("#shown-loader-commen").css("display", "none");
          this.getReplay = data.info
          $('#Success-disp-btns').trigger('click');
        }


        }, err => {

          $("#shown-loader-commen").css("display", "none");
         
        })
  }

  reset(){
    this.router.navigate(['Reset-Password/']);
  }

}
