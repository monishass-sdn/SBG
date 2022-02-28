import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormGroup, FormControl,FormBuilder, Validators} from '@angular/forms';
//import * as moment from 'moment'
// import environment for view boat owner Done By Alagesan	on 06.07.2021
import { environment } from '../../environments/environment';


declare var $: any;
declare var jQuery: any; 
declare var moment: any;
// Create Component for view boat owner Done By Alagesan	on 05.07.2021
@Component({
  selector: 'app-view-boat-owner',
  templateUrl: './view-boat-owner.component.html',
  styleUrls: ['./view-boat-owner.component.css']
})
export class ViewBoatOwnerComponent implements OnInit {
  data: any;
  Launch_Dates: string;
	preDates: string;

	Summer_From: string;
	Summer_To: string;

	Winter_From: string;
	Winter_To: string;

	HandBookUrl: string;


	multiImge: any =[];
	slideIndex = 1;
	boat_Id: any;
	boatOwners: any=[];
	manageOwnerId: any;
	getResponce: any;
	adminlogin: any;
  CommenMessages: any;

	TotalDaysAssigned_Summer_WeekDays :any;
	TotalDaysAssigned_Summer_WeekEndDays :any;
	TotalDaysAssigned_Winter_WeekDays :any;
	TotalDaysAssigned_Winter_WeekEndDays :any;
  Total_Days: any;

	boatStatus: string;
	allboatdata: any=[];

  OwnerInfo: any=[];
  BoatInfo: any=[];
  boat_name: string;
  Boattype_Name: string;
  Owners_Allowed: string;
  Location_Name: string;
  Boat_Facility: string;
  Boat_Description:string;
  // Add the Base URL for view boat owner Done By Alagesan	on 06.07.2021
  EnvironmentURL:string = environment.url;

// Add the base URL in API for view boat owner Done By Alagesan	on 06.07.2021
  url = this.EnvironmentURL+"api/Owner_Boat_Route"
  imgUrl = this.EnvironmentURL+"api/uploads/"
  boatUrl = this.EnvironmentURL+"api/Boat"
	OwnerUrl = this.EnvironmentURL+"api/Owner"
  ownerandboatdetails: any=[];
  timeszon_Set = environment.timeZone
  constructor(private http: HttpClient ,private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {

    $(".mobile-menu-icon").click(function(){
      $(".side-menu").toggleClass("mobile-sidebar");
    });
   

    this.OwnerInfo = JSON.parse(sessionStorage.getItem('Ownerlogin')); 
    this.BoatInfo = JSON.parse(sessionStorage.getItem('boatData')); 
    this.data = JSON.parse(sessionStorage.getItem('boatData')); 
    this.multiImge = this.data.BoatDetails[0].Boat_Image;
    this.boat_Id = this.data._id;

    var urlImg = this.EnvironmentURL+"api/uploads/";

    var data_First;
    var loopFirstChek = 0;
 
    var data_Second;
    var loopSecondCheck = 0;
 
    var dataImages = this.multiImge; 
 
    var div_Binding_one;
    var div_Binding_two;
    
    start_first();

    

    //this.getOwnerandBoatdetails();
 
    function start_first(){
      var urlImg_tmp = urlImg;
 
     div_Binding_one = '<a class="prev" onclick="plusSlides(-1)">❮</a><a class="next" onclick="plusSlides(1)">❯</a><div class="caption-container"><p id="caption"></p></div>';
          
     div_Binding_two = '<div class="container"><div class="row" id="id-sliderbinding-Second"></div></div>';
     
     var dataImageLength = dataImages.length / 2;
     dataImageLength = ~~dataImageLength;
     var loopfirstlength = 1;
    
     var loopSecondlength = 1;
 
     var rongImageRemoveArray = 0;
 
     var rongImageRemoveArray_Secon = 0;
     var image_Length = dataImages.length;
		var unknownImage_first = 0;
		var unknownImage_second = 0;
     
 
     $.each( dataImages, function(index, val) {
       
      urlImg = urlImg_tmp;
       //
         //var sss =val;
         if(typeof val === "undefined" || val == null || val == ""){
            val ="boat1.jpg";
            urlImg = "/assets/images/";
            loopfirstlength = 1;
            dataImageLength = 1;
            unknownImage_first = 1;
 
         }
 
       //
			if((unknownImage_first == 0 && image_Length != 1) || (unknownImage_first == 1 && image_Length == 1) ||(unknownImage_first == 0 && image_Length == 1) )
       {

       if(rongImageRemoveArray == 0){
 
 
         if(loopFirstChek == 0){
 
           data_First = '<div class="mySlides"  style="display: block;"><div class="numbertext">'+ loopfirstlength +' / '+ dataImageLength +'</div><img src="'+ urlImg + val +'" style="width:100%"></div>';
                  
           loopFirstChek = 1;
     
         }
         else{
     
           data_First += '<div class="mySlides"><div class="numbertext">'+loopfirstlength+' / '+ dataImageLength +'</div><img src="'+ urlImg + val +'" style="width:100%"></div>';
                 
         }
     
         loopfirstlength = loopfirstlength + 1;
 
         rongImageRemoveArray = 1;
 
       }
       else{
 
         rongImageRemoveArray = 0;
 
       }


      }
 
     
 
     });
 
     $('#id-sliderbinding-First').html(data_First + div_Binding_one + div_Binding_two);
 
     $.each(dataImages , function(index, val) {

      urlImg = urlImg_tmp;
 
     if(typeof val === "undefined" || val == null || val == ""){
       val ="boat1.jpg";
       urlImg = "/assets/images/";
       loopSecondlength = 1;
       unknownImage_second = 1;
       
 
      }
      
		 if((unknownImage_second == 0 && image_Length != 1) || (unknownImage_second == 1 && image_Length == 1) ||(unknownImage_second == 0 && image_Length == 1) )
      {
     
      if(rongImageRemoveArray_Secon == 0){
  
        if(loopSecondCheck == 0){
          data_Second = '<div class="column"><img class="demo cursor" src="'+ urlImg + val +'" style="width:100%" onclick="currentSlide('+ loopSecondlength +')" ></div>';
          loopSecondCheck = 1;
        }
        else{
    
          data_Second += '<div class="column"><img class="demo cursor" src="'+urlImg + val+'" style="width:100%" onclick="currentSlide('+ loopSecondlength +')" ></div>';
    
        }
    
        loopSecondlength = loopSecondlength + 1;
  
        rongImageRemoveArray_Secon = 1;
      }
      else{
  
        rongImageRemoveArray_Secon = 0;
      }
    }
     
     
     });
     
     $('#id-sliderbinding-Second').html(data_Second);
 
   }
   

    $(document).ready(function() {
	
      var current_yyyymm_ = moment().format("YYYYMM");
    
       $("#pb-calendar").pb_calendar({
         schedule_list : function(callback_, yyyymm_){
           var temp_schedule_list_ = {};
          
       
          temp_schedule_list_[current_yyyymm_+"02"] = [
             {'ID' : 1, style : "green"}
            
           ];
          
          temp_schedule_list_[current_yyyymm_+"03"] = [
             {'ID' : 2, style : "green"}
            
           ];
          
           temp_schedule_list_[current_yyyymm_+"04"] = [
             {'ID' : 3, style : "green"}
            
           ];
          
           temp_schedule_list_[current_yyyymm_+"10"] = [
             {'ID' : 4, style : "green"}
           ];
          
           temp_schedule_list_[current_yyyymm_+"11"] = [
             {'ID' : 5, style : "green"}
           ];
          
          temp_schedule_list_[current_yyyymm_+"12"] = [
             {'ID' : 6, style : "green"}
           ];
    
          
          
          
           temp_schedule_list_[current_yyyymm_+"06"] = [
            {'ID' : 7, style : "green"},
           
            
           ];
          
          temp_schedule_list_[current_yyyymm_+"07"] = [
             {'ID' : 8, style : "green"},
           
            
           ];           
     
             temp_schedule_list_[current_yyyymm_+"20"] = [
             {'ID' : 1, style : "green"}
            
           ];
          
           temp_schedule_list_[current_yyyymm_+"23"] = [
             {'ID' : 2, style : "blue"}
            
          ];
          
           temp_schedule_list_[current_yyyymm_+"24"] = [
             {'ID' : 3, style : "blue"}
            
           ];
          
           callback_(temp_schedule_list_);
         },
         schedule_dot_item_render : function(dot_item_el_, schedule_data_){
           dot_item_el_.addClass(schedule_data_['style'], true);
           return dot_item_el_;
         }
       }); 
    
      });

    this.getOwnerandBoatdetails();
  }
  

  getOwnerandBoatdetails(){
    
    var obj = {
      Boat_Id: this.BoatInfo.Boat_Id,
      Owner_Id: this.OwnerInfo._id
    }
    
    this.http.post<any>(`${this.OwnerUrl}/OwnerProfileDetails`,obj).subscribe(data => {
      
      this.ownerandboatdetails = data['response'];
     

      if(this.ownerandboatdetails[0].BoatDetails[0].Boat_Status=="1"){
        this.boatStatus = "Enable"
        }else if(this.ownerandboatdetails[0].BoatDetails[0].Boat_Status=="0"){
            this.boatStatus = "Disable"
        
      }

           // Create Component for view boat owner Done By Alagesan	on 05.07.2021
           this.boat_name = this.ownerandboatdetails[0].BoatDetails[0].Boat_Name
           this.Boattype_Name = this.ownerandboatdetails[0].BoatDetails[0].Boattype_Name;
           this.Owners_Allowed =  this.ownerandboatdetails[0].BoatDetails[0].Owners_Allowed
           this.Location_Name = this.ownerandboatdetails[0].BoatDetails[0].Location_Name;
          
           //var Launch_Date = new Date(this.ownerandboatdetails[0].BoatDetails[0].Launch_Date);
           //this.Launch_Dates = (Launch_Date.getDate())+'-' + (Launch_Date.getMonth()+1) + '-'+Launch_Date.getFullYear();
           this.Launch_Dates = moment(this.ownerandboatdetails[0].BoatDetails[0].Launch_Date).tz(this.timeszon_Set).format("DD-MM-YYYY");
           console.log(this.Launch_Dates);
           //var preDate = new Date(this.ownerandboatdetails[0].BoatDetails[0].PreLaunch_Date);
           //this.preDates = (preDate.getDate())+'-' + (preDate.getMonth()+1) + '-'+preDate.getFullYear();
           this.preDates = moment(this.ownerandboatdetails[0].BoatDetails[0].PreLaunch_Date).tz(this.timeszon_Set).format("DD-MM-YYYY");
           
           this.TotalDaysAssigned_Summer_WeekDays = this.ownerandboatdetails[0].Summer_WeekDays;
           this.TotalDaysAssigned_Summer_WeekEndDays = this.ownerandboatdetails[0].Summer_WeekEndDays;
           this.TotalDaysAssigned_Winter_WeekDays = this.ownerandboatdetails[0].Winter_WeekDays;
           this.TotalDaysAssigned_Winter_WeekEndDays = this.ownerandboatdetails[0].Winter_WeekEndDays;
           
           this.Boat_Facility = this.ownerandboatdetails[0].BoatDetails[0].Boat_Facility;
           this.Boat_Description = this.ownerandboatdetails[0].BoatDetails[0].Boat_Description;
           this.Total_Days = this.ownerandboatdetails[0].BoatDetails[0].Total_Days

           // var summer_From_Date = new Date(this.ownerandboatdetails[0].BoatDetails[0].SummerSeason_SDate);
           //this.Summer_From = (summer_From_Date.getDate())+'-' + (summer_From_Date.getMonth()+1) + '-'+summer_From_Date.getFullYear();
           this.Summer_From = moment(this.ownerandboatdetails[0].BoatDetails[0].SummerSeason_SDate).tz(this.timeszon_Set).format("DD-MM-YYYY");
           
           //var summer_To_Date = new Date(this.ownerandboatdetails[0].BoatDetails[0].SummerSeason_EDate);
           //this.Summer_To = (summer_To_Date.getDate())+'-' + (summer_To_Date.getMonth()+1) + '-'+summer_To_Date.getFullYear();
           this.Summer_To = moment(this.ownerandboatdetails[0].BoatDetails[0].SummerSeason_EDate).tz(this.timeszon_Set).format("DD-MM-YYYY");

           //var  Winter_From_Date = new Date(this.ownerandboatdetails[0].BoatDetails[0].WinterSeason_SDate);
          // this.Winter_From = (Winter_From_Date.getDate())+'-' + (Winter_From_Date.getMonth()+1) + '-'+Winter_From_Date.getFullYear();
          this.Winter_From = moment(this.ownerandboatdetails[0].BoatDetails[0].WinterSeason_SDate).tz(this.timeszon_Set).format("DD-MM-YYYY");

           //var  Winter_To_Date = new Date(this.ownerandboatdetails[0].BoatDetails[0].WinterSeason_EDate);
           //this.Winter_To = (Winter_To_Date.getDate())+'-' + (Winter_To_Date.getMonth()+1) + '-'+Winter_To_Date.getFullYear();
           this.Winter_To = moment(this.ownerandboatdetails[0].BoatDetails[0].WinterSeason_EDate).tz(this.timeszon_Set).format("DD-MM-YYYY");
          
           this.HandBookUrl = this.imgUrl + this.ownerandboatdetails[0].BoatDetails[0].Boat_HandBook;
           this.multiImge = this.data.Boat_Image;

           //DurationDetails this to start........pending... duration expaire message

           try
           {

            debugger;
              var currentDate = new Date();
              var Ownerduration = data['Ownerduration'];
              var passingDate = Ownerduration.To_Date;
              passingDate = this.Subtract_Seven_day_substract(passingDate);

              if(currentDate >= passingDate)
              {

                this.CommenMessages = Ownerduration.Boat_Name+" boat owner Duration is expired. Contact admin";
                $('#btn-CommenMessage-disp-btns-angular').trigger('click');

              }
          }
          catch{

          }

          
      


     }, err => {
     })
  }


   Subtract_Seven_day_substract(date)
   {
             
    var newdate = new Date(date);
    newdate.setDate(newdate.getDate() - 6);
    return new Date(newdate);
   }


}
