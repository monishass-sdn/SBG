import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormGroup, FormControl,FormBuilder, Validators} from '@angular/forms';
import * as moment from 'moment'
// import environment for view boat Done By Alagesan	on 06.07.2021
import { environment } from '../../environments/environment';
declare var $: any;
declare var jQuery: any;
@Component({
  selector: 'app-view-adminboat',
  templateUrl: './view-adminboat.component.html',
  styleUrls: ['./view-adminboat.component.css']
})
export class ViewAdminBoatComponent implements OnInit {
  data: any;
	Launch_Dates: string;
	preDates: string;

	Summer_From: string;
	Summer_To: string;

	Winter_From: string;
	Winter_To: string;

	HandBookUrl: any;


	multiImge: any =[];
	slideIndex = 1;
	// Add Base URL for view boat  Done By Alagesan	on 06.07.2021
	EnvironmentURL:string = environment.url;
	imgUrl = this.EnvironmentURL+"api/uploads/"
	url = this.EnvironmentURL+"api/Boat"
	OwnerUrl = this.EnvironmentURL+"api/Owner"
	boat_Id: any;
	boatOwners: any=[];
	manageOwnerId: any;
	getResponce: any;
	adminlogin: any;
	allBoats: any;

	TotalDaysAssigned_Summer_WeekDays :any;
	TotalDaysAssigned_Summer_WeekEndDays :any;
	TotalDaysAssigned_Winter_WeekDays :any;
	TotalDaysAssigned_Winter_WeekEndDays :any;
	boatStatus: string;
	allboatdata: any=[];

	constructor(private http: HttpClient ,private fb: FormBuilder, private router: Router,) { 
	
	  }



  ngOnInit(): void {

	$(".mobile-menu-icon").click(function(){
		$(".side-menu").toggleClass("mobile-sidebar");
	  });

	var imageloaderchek = JSON.parse(sessionStorage.getItem("realoding_end"));
	if(imageloaderchek == null){

		$("#shown-loader-commen").css("display", "block");

	}
	else{

		sessionStorage.removeItem("realoding_end");
	}

	

	this.adminlogin = JSON.parse(sessionStorage.getItem("adminLogin"));
	if(this.adminlogin==false){
	 // this.router.navigate(['']);
	 this.router.navigate(['/session-Expire']);
	}
	else if(this.adminlogin == null){

		this.router.navigate(['']);
  
	  }



sessionStorage.setItem("relodePg_book-for-owner","1");
sessionStorage.setItem("Adminbooking-relodePg","1");
sessionStorage.setItem("boat-maintenance-reload","1");

 sessionStorage.setItem("pageIdentiFiction","view-boat");
 
 
 ReloadPages();

 function ReloadPages(){

	debugger;
          
	//var sss = public_URL;
   
	var datasessions = sessionStorage.getItem("view-boat-reload");
	
	if(datasessions == null)
	{
		
		sessionStorage.setItem("view-boat-reload","0");
		location.reload();

	}
	else if(datasessions == "1"){
	  sessionStorage.setItem("view-boat-reload","0");
		location.reload();

	}
	
   
	

}

debugger;
	var allboats = JSON.parse(sessionStorage.getItem("AllOwner_All_boatdetails"));

	var boatId_get = JSON.parse(sessionStorage.getItem('boatData'));

	//var sortedData = allboats.find(x => x._id == boatId_get.Boat_Id);

	//sessionStorage.setItem("boatData",JSON.stringify(sortedData));


	 this.data = JSON.parse(sessionStorage.getItem('boatData')); 
     this.GetTotalDaysAssigned(this.data);
	 ////////////

	 if(this.data.Boat_Status=="0")
	 {
		
		this.boatStatus = "Disable";
	 }
	 else if(this.data.Boat_Status=="1")
	 {		
		this.boatStatus = "Enable";
	 }
	else if(this.data.Boat_Status == "2")
	{

		this.boatStatus = "Archive";

	}



			 var Launch_Date = new Date(this.data.Launch_Date);
			 this.Launch_Dates = (Launch_Date.getDate())+'-' + (Launch_Date.getMonth()+1) + '-'+Launch_Date.getFullYear();
			 var preDate = new Date(this.data.PreLaunch_Date);
			 this.preDates = (preDate.getDate())+'-' + (preDate.getMonth()+1) + '-'+preDate.getFullYear();
		
			 var summer_From_Date = new Date(this.data.SummerSeason_SDate);
			 this.Summer_From = (summer_From_Date.getDate())+'-' + (summer_From_Date.getMonth()+1) + '-'+summer_From_Date.getFullYear();
		
			 var summer_To_Date = new Date(this.data.SummerSeason_EDate);
			 this.Summer_To = (summer_To_Date.getDate())+'-' + (summer_To_Date.getMonth()+1) + '-'+summer_To_Date.getFullYear();
		
			 var  Winter_From_Date = new Date(this.data.WinterSeason_SDate);
			 this.Winter_From = (Winter_From_Date.getDate())+'-' + (Winter_From_Date.getMonth()+1) + '-'+Winter_From_Date.getFullYear();
		
			 var  Winter_To_Date = new Date(this.data.WinterSeason_EDate);
			 this.Winter_To = (Winter_To_Date.getDate())+'-' + (Winter_To_Date.getMonth()+1) + '-'+Winter_To_Date.getFullYear();
		

			 this.multiImge = this.data.Boat_Image;
		
			 this.boat_Id = this.data._id;


	


    this.getOwnersByBoatId();
	  
	 var urlImg = this.EnvironmentURL+"api/uploads/";

	 var data_First;
	 var loopFirstChek = 0;

	 var data_Second;
	 var loopSecondCheck = 0;

	 var dataImages = this.multiImge; 

	 var div_Binding_one;
	 var div_Binding_two;
	 
	 start_first();

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
			
			if(typeof val === "undefined" || val == null || val == ""){
				   val ="boat1.jpg";
				   urlImg = "/assets/images/";
				   loopfirstlength = 1;
				   dataImageLength = 1;
				   unknownImage_first = 1;

			}

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

	this.getmaindetails_HandBook_Binding();
	
	
  }

  getmaindetails_HandBook_Binding(){
			
			 if(this.data.Boat_HandBook && this.data.Boat_HandBook.length > 0){
		 
				 this.HandBookUrl = this.imgUrl + this.data.Boat_HandBook;
			}
			else{
		
				this.HandBookUrl = null;
		
			}
			
  }


  GetTotalDaysAssigned(sortedData){
	
debugger;
	var boatdats = sortedData; //JSON.parse(sessionStorage.getItem("boatData"));

	var obj={
		Boat_id :boatdats._id
	}	

	
   
	this.http.post<any>(`${this.OwnerUrl}/GetTotalDaysAssigned`, obj   ).subscribe(data => {
		var resu = data.Response;

		this.TotalDaysAssigned_Summer_WeekDays = resu[0].Summer_WeekDays;
	    this.TotalDaysAssigned_Summer_WeekEndDays = resu[1].Summer_WeekEndDays;
	    this.TotalDaysAssigned_Winter_WeekDays = resu[2].Winter_WeekDays;
	    this.TotalDaysAssigned_Winter_WeekEndDays = resu[3].Winter_WeekEndDays;
		
		  
		  }, err => {
			
			
		  })
}




deleteManageOwner(id){
	
	this.manageOwnerId = id._id
	$('#removeBoat').trigger('click');
  }

  editManageOwner(id){
	
	sessionStorage.setItem('manageOwnerData', JSON.stringify(id));   // if it's object

    this.router.navigate(['manage-owner/']);
  }

    // View manage owner changes for view boat page //Done By Alagesan on 13.06.2021	
  viewManageOwner(owner){
	
	sessionStorage.setItem('ownerData_view_owner_all_boat_View', JSON.stringify(owner));
    this.router.navigate(['view-owner-all-boat-View/']);
  }

  delete(){
	var obj={
	  id:this.manageOwnerId
	}
	this.http.post<any>(`${this.OwnerUrl}/DeleteManageOwnersById`,obj  ).subscribe(data => {  
	  
	  this.getResponce = data.message   
	  $('#pop-up-btn').trigger('click');
	  $('#removeBoat').trigger('click');

	  this.getOwnersByBoatId()
	
		  }, err => {
			
		  })
  }



  getOwnersByBoatId(){
	

	var obj={
		boatid :this.boat_Id
	}
	
	this.http.post<any>(`${this.OwnerUrl}/GetOwnerDetailsByBoatId`, obj   ).subscribe(data => {
		
	
	    this.boatOwners = data.Data
		var Tmp_cleaning_Details = data["CleaningDays"];
		  	

			this.http.get<any>(`${this.OwnerUrl}/GetAllOwnerssWithBoatDetails`).subscribe(data => {
			 
			
		  this.allboatdata = data['result'] 
		  var Temp_OwnerAllocatedDays = data["OwnerAllocatedDays"];
            var Temp_OwnerBookedDaysDays = data["OwnerBookedDaysDays"];
		if(this.boatOwners){
		  
		  this.boatOwners.forEach(owner => {
           
			      owner.Booked_Summer_WeekDays = 0;
				  owner.Booked_Summer_WeekEndDays = 0;			  
			      owner.Booked_Winter_WeekDays = 0;
				  owner.Booked_Winter_WeekEndDays = 0;

				  owner.Booked_Total_Days = 0;
				  ////////////////////////////////////////


				  owner.Summer_WeekDays = 0;
				  owner.Summer_WeekEndDays = 0;			  
			      owner.Winter_WeekDays = 0;
				  owner.Winter_WeekEndDays = 0;

				  owner.Total_Days = 0;





			
			Temp_OwnerAllocatedDays.forEach(boat => {

				

				if(owner.Owner_Id == boat.Owner_Id && boat.Boat_Id == this.boat_Id )
				{
					
					
				owner.boatName = "null";//boat.BoatDetails[0][0].Boat_Name

				try
				{
				var cleens_tmp = Tmp_cleaning_Details.find(x => x.Boat_Id == this.boat_Id && x.Owner_Id == boat.Owner_Id);
				owner.CleaningDays = cleens_tmp.Cleans;

				}
				catch{
				 owner.CleaningDays = 0;

				}



				owner.Summer_WeekDays = boat.Summer_WeekDays;
				if( owner.Summer_WeekDays == "null"){
					owner.Summer_WeekDays = 0;
				}
				owner.Summer_WeekEndDays = boat.Summer_WeekEndDays;	
				if( owner.Summer_WeekEndDays == "null"){
					owner.Summer_WeekEndDays = 0;
				}		  
				owner.Winter_WeekDays = boat.Winter_WeekDays;
				if( owner.Winter_WeekDays == "null"){
					owner.Winter_WeekDays = 0;
				}

				owner.Winter_WeekEndDays = boat.Winter_WeekEndDays;
				if( owner.Winter_WeekEndDays == "null"){
					owner.Winter_WeekEndDays = 0;
				}

				try
				{
					owner.Total_Days = parseInt(owner.Summer_WeekDays)+parseInt(owner.Summer_WeekEndDays)+
									parseInt(owner.Winter_WeekDays)+parseInt(owner.Winter_WeekEndDays);
					if( owner.Total_Days == "NaN"){
					    owner.Total_Days = 0;
				    }				

				}
				catch{
					owner.Total_Days = 0;

				}
				
			
				}			
		    });


		     Temp_OwnerBookedDaysDays.forEach(boat1 => {
						
				if(owner.Owner_Id == boat1.Owner_Id && boat1.Boat_Id == this.boat_Id )
				{

					
					
				owner.boatName = "null";//boat.BoatDetails[0][0].Boat_Name
				
				owner.Booked_Summer_WeekDays = boat1.Summer_WeekDays;
				owner.Booked_Summer_WeekEndDays = boat1.Summer_WeekEndDays;			  
				owner.Booked_Winter_WeekDays = boat1.Winter_WeekDays;
				owner.Booked_Winter_WeekEndDays = boat1.Winter_WeekEndDays;

				owner.Booked_Total_Days = parseInt(boat1.Summer_WeekDays)+parseInt(boat1.Summer_WeekEndDays)+
									parseInt(boat1.Winter_WeekDays)+parseInt(boat1.Winter_WeekEndDays);			
				}
				// else
				// {
			    //  owner.Booked_Summer_WeekDays = 0;
				// owner.Booked_Summer_WeekEndDays = 0;			  
				// owner.Booked_Winter_WeekDays = 0;
				// owner.Booked_Winter_WeekEndDays = 0;

				// owner.Booked_Total_Days = 0;

				// }


	        });



		  });
		  
		}
		
		   }, err => {
		   })
		  



		  }, err => {
			
		  })
}

editBoat(){
    
    this.router.navigate(['edit-boat/']);
  }


  


}
