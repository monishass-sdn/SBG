import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormGroup, FormControl,FormBuilder, Validators} from '@angular/forms';
// import environment for myprofile Done By Alagesan	on 06.07.2021
import { environment } from '../../environments/environment';
declare var $: any;
declare var jQuery: any; 
@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.css']
})
// Create Component for myprofile //Done By Alagesan on 17.05.2021
export class MyprofileComponent implements OnInit {
  data: any=[];
  // Add Base URL for myprofile  Done By Alagesan	on 06.07.2021
  EnvironmentURL:string = environment.url;
  url = this.EnvironmentURL+"api/Owner"
  imgUrl = this.EnvironmentURL+"api/uploads/"
  url_Boat = this.EnvironmentURL+"api/Boat"

  listBoat: any=[];
  listBoat_New_update: any=[];
  ownerlogin: any;
  listBoats: any=[];
  ownerdurationsdetails: any=[];

  fromDate: string;
	toDate: string;
  today_date:string;
  endingFormatDate:string;
  endedFormatDate: string;
  disableBoat: string;
  expireBoat: string;
  //Change password for myprofile page //Done By Alagesan on 28.07.2021
  saveChangePasswordform: FormGroup;
  changePasswordSubmitted = false;
  modelTitle: string;
  getResponce: any;
  enterValidPassword: string;
  showOldPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

   allBoats: any;//data['response'];
   Public_allBoats: any;//data['response'];
  
  constructor(private http: HttpClient ,private fb: FormBuilder, private router: Router,) { 
    this.createChangePasswordForm();
  }
  // Create Component for myprofile //Done By Alagesan on 17.05.2021
  ngOnInit(): void {

    $(".mobile-menu-icon").click(function(){
      $(".side-menu").toggleClass("mobile-sidebar");
    });

    $("#shown-loader-commen").css("display", "block");

    var session_Chek = JSON.parse(sessionStorage.getItem("userToken"));
    if(session_Chek == null){
      this.router.navigate(['']);
      //this.router.navigate(['/session-Expire/']);

    }

    sessionStorage.setItem("owner-dashboard-relodePg","1");
    sessionStorage.setItem("owner-dashboard-relodePg-safari","1");

    this.ownerlogin = JSON.parse(sessionStorage.getItem("userlogin"));
   
    if(this.ownerlogin==false){
      this.router.navigate(['/owner-login/']);
    }
    sessionStorage.setItem("relodePg_book-for-owner","1");
    sessionStorage.setItem("Adminbooking-relodePg","1");
    sessionStorage.setItem("boat-maintenance-reload","1");
    sessionStorage.setItem("view-boat-reload","1");
    this.data = JSON.parse(sessionStorage.getItem('Ownerlogin')); 
   
    this.getBoteByOwner();
    this.getOwnerDurationdetails();
   // this.getAllBoat();

   


  }

    //Change password for myprofile page //Done By Alagesan on 28.07.2021
  createChangePasswordForm() {
      this.saveChangePasswordform = this.fb.group({
      OldPassword: new FormControl('', [Validators.required,]),
      NewPassword: new FormControl('', [Validators.required,]),
      ConfirmPassword: new FormControl('', [Validators.required,]),
      Owner_Id: new FormControl(''),
    }, { 
      validators: this.passwordValidation.bind(this)
    })
  }
  get cpf() { return this.saveChangePasswordform.controls; }
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
  showOldPasswordText() {
    this.showOldPassword = !this.showOldPassword;
   }

   showNewPasswordText() {
    this.showNewPassword = !this.showNewPassword;
   }
  //Change password for myprofile page //Done By Alagesan on 28.07.2021
   showConfirmPasswordText() {
    this.showConfirmPassword = !this.showConfirmPassword;
   }
  //Change password for myprofile page //Done By Alagesan on 28.07.2021
  saveChangePassword() {
    this.changePasswordSubmitted = true;
  
    if(this.saveChangePasswordform.invalid) {
      return;
    }
    
    this.saveChangePasswordform.get('Owner_Id').setValue(this.data._id);

    this.http.post<any>(`${this.url}/ChangeNewPassword`, this.saveChangePasswordform.value).subscribe(data => {
    

      

      if(data.Status == true) {
        this.modelTitle = "Change Password"
        this.getResponce = data.message
        $('#change-password-btn').trigger('click');
        this.saveChangePasswordform.reset()
        this.changePasswordSubmitted = false;
      }
      else if(data.status == false){
        this.modelTitle = "Change Password"
        this.getResponce = data.message
        $('#change-password-btn').trigger('click');
        this.saveChangePasswordform.reset()
        this.changePasswordSubmitted = false;
      }
    }, err => {


    
    })
  }
  //Change password for myprofile page //Done By Alagesan on 28.07.2021
  pagereload(){
    location.reload();
  }

  openLink(link){
    window.open(link);
  }

  
   


    viewBoat(boat){
     if(boat.Block == false){
      $('#suspend-boat-popup-message-btn').trigger('click'); 
     }
      else{     
      // disable and archive boat view page for myprofile Done By Alagesan	on 12.07.2021 
      if(boat.BoatDetails[0].Boat_Status == '0' || boat.BoatDetails[0].Boat_Status == '2'){
        $('#disable-boat-popup-message-btn').trigger('click');
        this.disableBoat = boat.Boat_Name;
      }
      

      // Active boat view page for myprofile Done By Alagesan	on 12.07.2021 
      if(boat.BoatDetails[0].Boat_Status == '1'){
        sessionStorage.setItem('boatData', JSON.stringify(boat));
      //   Change the view boat url for myprofile Done By Alagesan	on 12.07.2021 
        this.router.navigate(['view-boat-owner/']);
      }
    }
    }

    activeBoat(boat){
      sessionStorage.setItem('boatData', JSON.stringify(boat));   // if it's object
      // Change the view boat url for myprofile Done By Alagesan	on 05.07.2021 
      this.router.navigate(['view-boat-owner/']);

    }
  editProfile(){
    this.router.navigate(['edit-owner-profile/']);
  }



  getBoteByOwner(){

    
    var obj={
      owner_id:this.data._id
    }
    this.http.post<any>(`${this.url}/GetBoatDetailsByOwner`,obj  ).subscribe(data => {  
     
      this.listBoats = data['response']
       

      var response = this.listBoats.map(function(el){
        el.BoatDetails = el.BoatDetails.filter(function(x){ return x.IsActive ==true; });
        return el;
    });
   

    response.forEach(element => {         
      if(element.BoatDetails.length==0){

      }else{
       
         this.listBoat.push(element);

      }

    });



    this.getOwnerBased_Boat();






        }, err => {
       
        })
    }

    // Show owner duration details for myprofile Done By Alagesan	on 01.07.2021 
    getOwnerDurationdetails(){
      var obj ={
        Owner_Id:this.data._id
      }
      this.http.post<any>(`${this.url}/GetOwnerDurationdetailsbyOwnerId`,obj).subscribe(data => {
        
        this.ownerdurationsdetails = data['response'];
       

           // Get date format for myprofile Done By Alagesan	on 07.07.2021 

           try
           {
           var from_date = new Date(this.ownerdurationsdetails[0].From_Date);
           this.fromDate = (from_date.getDate())+'-' + (from_date.getMonth()+1) + '-'+from_date.getFullYear();
           var to_date = new Date(this.ownerdurationsdetails[0].To_Date);
           this.toDate = (to_date.getDate())+'-' + (to_date.getMonth()+1) + '-'+to_date.getFullYear();
           var todaydate = new Date()
           this.today_date = (todaydate.getDate())+'-' + (todaydate.getMonth()+1) + '-'+todaydate.getFullYear();
           var sHour = todaydate.getHours();
           }
           catch{

           }

           $("#shown-loader-commen").css("display", "none");
         
          // this.endingtimeDate(todaydate,from_date);
          // this.endedtimeDate(todaydate,to_date);
       }, err => {

        $("#shown-loader-commen").css("display", "none");

       })
    }






  getOwnerBased_Boat(){


    this.http.get<any>(`${this.url}/GetAllOwnerssWithBoatDetails`).subscribe(data => {
     
      
      var Tmp_owner_id = this.data._id;
      var Temp_result = data["result"];
      var Temp_OwnerAllocatedDays = data["OwnerAllocatedDays"];
      var Temp_OwnerBookedDaysDays = data["OwnerBookedDaysDays"];
      var Tmp_cleaning_Details = data["CleaningDays"];
      var Temp_listBoat = this.listBoat;


      //console.log(Temp_result);
      console.log(Temp_OwnerAllocatedDays);
      console.log(Temp_OwnerBookedDaysDays);
      console.log(Temp_listBoat);
      var tmp_listBoat_Array = [];

      Temp_listBoat.forEach(element3 => {
       

        var tmp_BoatDetails = [];

        element3.BoatDetails.forEach(element0 => {
        
          var Boat_Image_tmp =[];
          element0.Boat_Image.forEach(element1 => {
  
            Boat_Image_tmp.push(element1);
            
          });
  
  
          var obj = Object();
          obj.Boat_Image = Boat_Image_tmp;
          obj.Boat_Status = element0.Boat_Status;
          obj.Boattype_Name = element0.Boattype_Name;
          obj.Boattype_id = element0.Boattype_id;
          obj.IsActive = element0.IsActive;
          obj.Location_Id = element0.Location_Id;
          obj.Location_Name = element0.Location_Name;
          /*
          obj.Summer_WeekDays: 1
          obj.Summer_WeekEndDays: 12
          obj.Winter_WeekDays: 20
          obj.Winter_WeekEndDays: 20
          */


          tmp_BoatDetails.push(obj);
          
        });
        
        var obj_2 = Object();
        obj_2.BoatDetails = tmp_BoatDetails;
        obj_2.Boat_Id = element3.Boat_Id
        obj_2.Boat_Name = element3.Boat_Name
        obj_2.Boat_Type = element3.Boat_Type
        obj_2.Owners_Allowed = element3.Owners_Allowed
        obj_2.Profile_Image = element3.Profile_Image
        obj_2.Profile_ImageOriginalName = element3.Profile_ImageOriginalName
        obj_2.ShareAllocation = element3.ShareAllocation
        obj_2._id = element3._id;
        obj_2.Block = element3.Block;
        try
        {
         var cleens_tmp = Tmp_cleaning_Details.find(x => x.Boat_Id == element3.Boat_Id && x.Owner_Id == Tmp_owner_id);
         obj_2.CleaningDays = cleens_tmp.Cleans;

        }
        catch{
          obj_2.CleaningDays = 0;

        }

        var totalDays_Allocated = 0;
        var totalBookedDaysDays = 0;

        Temp_OwnerAllocatedDays.forEach(element4 => {

          if(element4.Boat_Id == element3.Boat_Id && element4.Owner_Id == Tmp_owner_id){

            totalDays_Allocated = parseInt(element4.Summer_WeekDays) + parseInt(element4.Summer_WeekEndDays) +
                                  parseInt(element4.Winter_WeekDays) + parseInt(element4.Winter_WeekEndDays)

          }

          
        });

        Temp_OwnerBookedDaysDays.forEach(element4 => {

          if(element4.Boat_Id == element3.Boat_Id && element4.Owner_Id == Tmp_owner_id){

            totalBookedDaysDays = parseInt(element4.Summer_WeekDays) + parseInt(element4.Summer_WeekEndDays) +
                                  parseInt(element4.Winter_WeekDays) + parseInt(element4.Winter_WeekEndDays)

          }

          
        });

        
          obj_2.TotalDays_Allocated = totalDays_Allocated;
          obj_2.TotalBookedDaysDays = totalBookedDaysDays;
         
          


          
        tmp_listBoat_Array.push(obj_2);


        
      });

      

      console.log(tmp_listBoat_Array);
      this.listBoat_New_update = tmp_listBoat_Array;

      // var obj={
      //   owner_id:this.data._id
      // }
  
 
     }, err => {
     })
    
  }



}
