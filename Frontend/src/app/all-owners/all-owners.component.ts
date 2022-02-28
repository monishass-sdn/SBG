import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormGroup, FormControl,FormBuilder, Validators} from '@angular/forms';
// import environment for all owners Done By Alagesan	on 06.07.2021
import { environment } from '../../environments/environment';
declare var $: any;
declare var jQuery: any; 
@Component({
  selector: 'app-all-owners',
  templateUrl: './all-owners.component.html',
  styleUrls: ['./all-owners.component.css']
})
export class AllOwnersComponent implements OnInit {
  // Add Base URL for all owners  Done By Alagesan	on 06.07.2021
  EnvironmentURL:string = environment.url;

  form: FormGroup;
  url = this.EnvironmentURL+"api/Owner";
  pathImage = this.EnvironmentURL+"api/uploads/";
  url_Suspend = this.EnvironmentURL+"api/Suspend/";
  allOwners: any=[];
  searchLoction: any = '';
  ownerId: any;
  getResponce: any;
  boats: any=[];
  allboatdata: any=[];
  imgUrl = this.EnvironmentURL+"api/uploads/"
  adminlogin: any;
  pageOfItems: Array<any>;
  commenmessages:any;

  Summer_WeekDays : any;
  Summer_WeekEndDays : any;
  Winter_WeekDays : any;
  Winter_WeekEndDays : any;
  Total_Days : any;

  visibleIndices = new Set<number>();
  partialcancelldays: any = 0;

  //visibleIndices:any = false;

  constructor(private http: HttpClient ,private fb: FormBuilder, private router: Router,) { 
   }

  ngOnInit(): void {

    $(".mobile-menu-icon").click(function(){
      $(".side-menu").toggleClass("mobile-sidebar");
    });
    
    $("#shown-loader-commen").css("display", "block");
    this.adminlogin = JSON.parse(sessionStorage.getItem("adminLogin"));
    if(this.adminlogin==false){
      this.router.navigate(['']);
    }
    this.sidemenuloder();
    sessionStorage.setItem("relodePg_book-for-owner","1");
    sessionStorage.setItem("Adminbooking-relodePg","1");
     sessionStorage.setItem("boat-maintenance-reload","1");
     sessionStorage.setItem("view-boat-reload","1");
    this.getAllOwners()
    $(".custom-file-input").on("change", function() {
      var fileName = $(this).val().split("\\").pop();
      $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
    });
    this.getBoats()
  }
  onChangePage(pageOfItems: Array<any>) {
    // update current page of items
    this.pageOfItems = pageOfItems;
}
  sidemenuloder(){    
    $("#a-menu-Owners-main").attr("aria-expanded","true");        
    $("#a-menu-Owners-main").removeClass("collapsed");
    $("#id-submenu-child-Owners-All-Owners").
    css({"background": "white", "color": "black",
    "padding": "inherit","border-radius": "inherit","margin-right": "-9px"});
    $("#owner").addClass("show");

  }
  getBoatTypeId(boat){
   
  }

  getBoats(){
    this.http.get<any>(`${this.url}/GetBoat`).subscribe(data => {
  this.boats = data['response']
  
   }, err => {
   })
  }

  getAllOwners(){
    this.http.get<any>(`${this.url}/ViewAllOwners`).subscribe(data => {
      
      //......................

      this.http.get<any>(`${this.url}/GetAllOwnerssWithBoatDetails`).subscribe(data2 => {
        
       //this.allboatdata = data2['result'] 

       this.getAllBoatData_BindingArry(data['response'], data2['result'], data2['OwnerAllocatedDays'], data2['OwnerBookedDaysDays'],data2['PartialDaysCount']);


       $("#shown-loader-commen").css("display", "none");
      
 
     }, err => {
      $("#shown-loader-commen").css("display", "none");
     })

      //.................
  



  //this.allOwners = data['response']
  //this.getAllBoatdata()

   
   }, err => {
    $("#shown-loader-commen").css("display", "none");
   })
  }

  Coma_Filtering(number, name, count){

    if(number == 1){
      return name;
      //comen_temp = 1;
    }
    else if(number == 2) 
    {
      if(count == 0){
       return name+",";       

      }
      else if(count == 1){
        return name;

      }
      else
      {
        return name;

      }

    }

    else if(number == 3) 
    {
      if(count == 0){
       return name+",";       

      }
      else if(count == 1){
        return name+",";

      }

      else if(count == 2){
        return name;

      }

      else{
        return name;
      }

    }

    else if(number == 4) 
    {
      if(count == 0){
       return name+",";       

      }
      else if(count == 1){
        return name+",";

      }

      else if(count == 2){
        return name+",";

      }

      else if(count == 3){
        return name;

      }

      else{
        return name;
      }

    }

    else if(number == 5) 
    {
      if(count == 0){
       return name+",";       

      }
      else if(count == 1){
        return name+",";

      }

      else if(count == 2){
        return name+",";

      }

      else if(count == 3){
        return name+",";

      }

      else if(count == 4){
        return name;

      }

      else{
        return name;
      }

    }

    else if(number == 6) 
    {
      if(count == 0){
       return name+",";       

      }
      else if(count == 1){
        return name+",";

      }

      else if(count == 2){
        return name+",";

      }

      else if(count == 3){
        return name+",";

      }

      else if(count == 4){
        return name+",";

      }

      else if(count == 5){
        return name;

      }

      else{
        return name;
      }

    }

    else if(number == 7) 
    {
      if(count == 0){
       return name+",";       

      }
      else if(count == 1){
        return name+",";

      }

      else if(count == 2){
        return name+",";

      }

      else if(count == 3){
        return name+",";

      }

      else if(count == 4){
        return name+",";

      }

      else if(count == 5){
        return name+",";

      }

      else if(count == 6){
        return name;

      }

      else{
        return name;
      }

    }

    else if(number == 8) 
    {
      if(count == 0){
       return name+",";       

      }
      else if(count == 1){
        return name+",";

      }

      else if(count == 2){
        return name+",";

      }

      else if(count == 3){
        return name+",";

      }

      else if(count == 4){
        return name+",";

      }

      else if(count == 5){
        return name+",";

      }

      else if(count == 6){
        return name+",";

      }

      else if(count == 7){
        return name;

      }

      else{
        return name;
      }

    }

    else if(number == 9) 
    {
      if(count == 0){
       return name+",";       

      }
      else if(count == 1){
        return name+",";

      }

      else if(count == 2){
        return name+",";

      }

      else if(count == 3){
        return name+",";

      }

      else if(count == 4){
        return name+",";

      }

      else if(count == 5){
        return name+",";

      }

      else if(count == 6){
        return name+",";

      }

      else if(count == 7){
        return name+",";

      }

      else if(count == 8){
        return name;

      }

      else{
        return name;
      }

    }

    else{
      return name+",";

    }

  }


  getAllBoatData_BindingArry(data1, data2, data3,data4,data5){

    var Number = 1000;
    var OwnerBaseNumber = 1;

   

    var tempNum = 0;
console.log(data1);
    data1.forEach(element => {
       var boat_Summer_Details = [];
       var first_timeExicute =  0;
       Number = Number + 1;

      if (typeof element !== "undefined" && element != null)
      {

      var obj = Object();
      
      obj.Profile_Image = element.Profile_Image;
      obj.Profile_ImageOriginalName = element.Profile_ImageOriginalName;
      obj.Notes = element.Notes;

      if(element.Status == null)
      {

        obj.Status = 1;

      }
      else{
        obj.Status = element.Status;
      }

      
      obj.Current_Time = element.Current_Time;
      obj.Updated_time = element.Updated_time;
      obj.Owner_id = element._id;
      obj.First_Name = element.First_Name;
      obj.Last_Name = element.Last_Name;
      obj.Home_Address = element.Home_Address;
      obj.Email = element.Email;
      obj.Password = element.Password;
      obj.Mobile = element.Mobile;
      obj.Family_Name = element.Family_Name;
      obj.Parking_Ability = element.Parking_Ability;
      obj.Sailing_Ability = element.Sailing_Ability;
      obj.Housekeeping = element.Housekeeping;
      obj.Emergency_Contact_Name = element.Emergency_Contact_Name;
      obj.Emergency_Contact_Mobile = element.Emergency_Contact_Mobile;
      obj.Block = element.Block;
      obj.IsActive = element.IsActive;
      obj.created = element.created;
      if(element.DecryptPassword){
        obj.DecryptPassword = element.DecryptPassword;
      }
      
      
      var tmp_bot_and_summer = data2.filter(x => x.Owner_Id == element._id);

      if(tmp_bot_and_summer.length > 0){ 
        
       var comen_temp =0; 

      tmp_bot_and_summer[0].BoatDetails.forEach(element2 => {

        if (typeof element2[0] !== "undefined" && element2[0] != null)
        {

        Number = Number + 1 ;
        var totalnumber_boat = tmp_bot_and_summer[0].BoatDetails.length;

        if(first_timeExicute == 0){
          this.visibleIndices.add(Number);
          first_timeExicute = 1;

        }  

          

        var obj3 = Object();
          obj3.OwnerBaseNumber = OwnerBaseNumber;
          obj3.dynamicNumber = Number;
          obj3.Boat_id = element2[0]._id;
          obj3.Boat_Name = this.Coma_Filtering(totalnumber_boat, element2[0].Boat_Name, comen_temp);
          comen_temp = comen_temp + 1;

          

          

          var tmp_manage_owr = data3.find(x => x.Owner_Id == element._id && x.Boat_Id == element2[0]._id);
          var Summer_WeekDays;
          var Summer_WeekEndDays;
          var Winter_WeekDays;
          var Winter_WeekEndDays;
          var Total_Days;

          var tmp_manage_owr_BookedDays = data4.find(x => x.Owner_Id == element._id && x.Boat_Id == element2[0]._id);
          var Summer_WeekDays_BookedDays;
          var Summer_WeekEndDays_BookedDays;
          var Winter_WeekDays_BookedDays;
          var Winter_WeekEndDays_BookedDays;
          var Total_Days_BookedDays;


         
          var tmp_PartialDaysCount = data5.find(x => x.Owner_Id == element._id && x.Boat_Id == element2[0]._id);
          
          try
          {
            if(tmp_PartialDaysCount != null)
            {

            if(typeof tmp_PartialDaysCount !== "undefined" && tmp_PartialDaysCount != null)
            {

              obj3.No_Cancellation = tmp_PartialDaysCount.No_Cancellation;
            }
            else{

              obj3.No_Cancellation = 0;

            }
          }
          else{

            obj3.No_Cancellation = 0;

          }

          }
          catch{

            obj3.No_Cancellation = 0;

          }


          

          if(tmp_manage_owr != null)
          {
            Summer_WeekDays = tmp_manage_owr.Summer_WeekDays;
            Summer_WeekEndDays = tmp_manage_owr.Summer_WeekEndDays;
            Winter_WeekDays = tmp_manage_owr.Winter_WeekDays;
            Winter_WeekEndDays = tmp_manage_owr.Winter_WeekEndDays;
            Total_Days = Summer_WeekDays + Summer_WeekEndDays + Winter_WeekDays + Winter_WeekEndDays;


            if(typeof tmp_manage_owr_BookedDays !== "undefined" && tmp_manage_owr_BookedDays != null)
             {
            Summer_WeekDays_BookedDays = tmp_manage_owr_BookedDays.Summer_WeekDays;
            Summer_WeekEndDays_BookedDays = tmp_manage_owr_BookedDays.Summer_WeekEndDays;
            Winter_WeekDays_BookedDays = tmp_manage_owr_BookedDays.Winter_WeekDays;
            Winter_WeekEndDays_BookedDays = tmp_manage_owr_BookedDays.Winter_WeekEndDays;
            Total_Days_BookedDays = Summer_WeekDays_BookedDays + Summer_WeekEndDays_BookedDays + Winter_WeekDays_BookedDays + Winter_WeekEndDays_BookedDays;
             }
             else{

              Summer_WeekDays_BookedDays = 0;
              Summer_WeekEndDays_BookedDays = 0;
              Winter_WeekDays_BookedDays = 0;
              Winter_WeekEndDays_BookedDays = 0;
              Total_Days_BookedDays = 0;

             }


          }
          else{

           Summer_WeekDays = 0;
           Summer_WeekEndDays = 0;
           Winter_WeekDays = 0;
           Winter_WeekEndDays = 0;
           Total_Days = 0;

           Summer_WeekDays_BookedDays = 0;
           Summer_WeekEndDays_BookedDays = 0;
           Winter_WeekDays_BookedDays = 0;
           Winter_WeekEndDays_BookedDays = 0;
           Total_Days_BookedDays = 0;
           obj3.No_Cancellation = 0;

          }
          
            obj3.Summer_WeekDays = Summer_WeekDays;         
            obj3.Summer_WeekEndDays = Summer_WeekEndDays;          
            obj3.Winter_WeekDays = Winter_WeekDays;          
            obj3.Winter_WeekEndDays = Winter_WeekEndDays;          
            obj3.Total_Days = Total_Days;

            obj3.Summer_WeekDays_BookedDays = Summer_WeekDays_BookedDays;         
            obj3.Summer_WeekEndDays_BookedDays = Summer_WeekEndDays_BookedDays;          
            obj3.Winter_WeekDays_BookedDays = Winter_WeekDays_BookedDays;          
            obj3.Winter_WeekEndDays_BookedDays = Winter_WeekEndDays_BookedDays;          
            obj3.Total_Days_BookedDays = Total_Days_BookedDays;
         
           
        
        
        boat_Summer_Details.push(obj3);

        }



      });


      }
      else{

       
        if(first_timeExicute == 0){
          this.visibleIndices.add(Number);
          first_timeExicute = 1;

        }  


        var obj3 = Object();
        var Summer_WeekDays = 0;
        var Summer_WeekEndDays = 0;
        var Winter_WeekDays = 0;
        var Winter_WeekEndDays = 0;
        var Total_Days = 0;

        var Summer_WeekDays_BookedDays =0;
        var Summer_WeekEndDays_BookedDays =0;
        var Winter_WeekDays_BookedDays =0;
        var Winter_WeekEndDays_BookedDays =0;
        var Total_Days_BookedDays =0;

        obj3.No_Cancellation = 0;

          obj3.OwnerBaseNumber = 1;
          obj3.dynamicNumber = Number;
          obj3.Boat_id = 0;
          obj3.Boat_Name = "";

           obj3.Summer_WeekDays = Summer_WeekDays;         
            obj3.Summer_WeekEndDays = Summer_WeekEndDays;          
            obj3.Winter_WeekDays = Winter_WeekDays;          
            obj3.Winter_WeekEndDays = Winter_WeekEndDays;          
            obj3.Total_Days = Total_Days;

            obj3.Summer_WeekDays_BookedDays = Summer_WeekDays_BookedDays;         
            obj3.Summer_WeekEndDays_BookedDays = Summer_WeekEndDays_BookedDays;          
            obj3.Winter_WeekDays_BookedDays = Winter_WeekDays_BookedDays;          
            obj3.Winter_WeekEndDays_BookedDays = Winter_WeekEndDays_BookedDays;          
            obj3.Total_Days_BookedDays = Total_Days_BookedDays;
            

            boat_Summer_Details.push(obj3);


      }

      obj.Boat_Summer_Details = boat_Summer_Details;
          
      
      this.allOwners.push(obj);
      console.log(this.allOwners);
      this.allOwners = this.allOwners.filter(x => x.Status != 2);
       console.log(this.allOwners);
      OwnerBaseNumber = OwnerBaseNumber + 1;

      tempNum = tempNum +1;

      }
      
    });

  
    
    
  }

  Boatbase_SummerDetails(owner,boat){

    var tmp1 = [];
    owner.forEach(element => {
      tmp1.push(element.dynamicNumber);      
    });

    tmp1.forEach(element => {
      this.visibleIndices.delete(element);
    });

       this.visibleIndices.add(boat.dynamicNumber);
     
  }

 

  getAllBoatdata(){
    this.http.get<any>(`${this.url}/GetAllOwnerssWithBoatDetails`).subscribe(data => {
     
  this.allboatdata = data['result'] 

  
    if(this.allOwners){
      
        this.allOwners.forEach(owner => {
          var obj2 = Object();
            this.allboatdata.forEach(boat => {
            if(owner._id == boat.Owner_Id){
              owner.boatName = boat.BoatDetails[0][0].Boat_Name
              owner.Summer_WeekDays = boat.BoatDetails[0][0].Summer_WeekDays
              owner.Summer_WeekEndDays = boat.BoatDetails[0][0].Summer_WeekEndDays
              owner.Total_Days = boat.BoatDetails[0][0].Total_Days
              owner.Winter_WeekDays = boat.BoatDetails[0][0].Winter_WeekDays
              owner.Winter_WeekEndDays = boat.BoatDetails[0][0].Winter_WeekEndDays

            }
          });
        });
  
}

  
   }, err => {
   })
  }


  deleteownerModel(owner){
    
    this.ownerId = owner.Owner_id;
    $('#removeBoat').trigger('click');

  }
  viewOwner(owner){
    sessionStorage.setItem('ownerData', JSON.stringify(owner));   // if it's object

    this.router.navigate(['view-owner/']);
  }
  editOwner(owner){
    sessionStorage.setItem('ownerData', JSON.stringify(owner));   // if it's object

    this.router.navigate(['edit-owner/']);
  }
  deleteOwner(){

    $("#shown-loader-commen").css("display", "block");
    
    var boadtId = {
      _id : this.ownerId
    }
    this.http.post<any>(`${this.url}/DeleteOwner`,  boadtId   ).subscribe(data => {
     
      $("#shown-loader-commen").css("display", "none");
        if(data.status==false){
        
        this.commenmessages = data.message;
          $('#btn-CommenMessage-save-disp-btns').trigger('click');
        }
        else if(data.status==true){
          this.commenmessages = data.message;
          $('#btn-CommenMessage-save-disp-btns').trigger('click');
        } 
        }, err => {

          $("#shown-loader-commen").css("display", "none");
         
        })
  }

  location_reload(){
    location.reload();
  }

  owner_Enable_And_Disable(owr){

   

    var OwnerId = {
      _id : owr.Owner_id
    }
    this.http.post<any>(`${this.url}/EnableAndDisableOwner`,  OwnerId   ).subscribe(data => {
     
        if(data.status==false){
       

        this.commenmessages = data.message;
          $('#btn-CommenMessage-save-disp-btns').trigger('click');

        }
        else if(data.status==true){
          this.commenmessages = data.message
          $('#btn-CommenMessage-save-disp-btns').trigger('click');  
        
        } 
        }, err => {
         
        })
   

  }

  Binding_partially_cancelled_days_currentYear(ownerId,boatId){

    debugger;

    try
    {

      var currentyear = this.CurrentYear();

          var obj =
          {
            Owner_Id: ownerId,
            Boat_Id: boatId,
            Cancellationyear:currentyear
          };
    
          this.http.post<any>(`${this.url_Suspend}PartialDaysCount`,  obj  ).subscribe(data => {            
          
          if(data.status == true){

            this.partialcancelldays = data.cancelcount;
    
          }
          else{
            this.partialcancelldays = 0;
          }
    
            
          }, err => {
              
              })

    }
    catch{

    }

   

  }

  CurrentYear(){
    var newDate = new Date();
    var sYear = newDate.getFullYear();  
    
    return sYear.toString();
  }


  Enabled_Owner(owr){
    
   
    var obj = 
    {
      _id : owr.Owner_id,
      Status: "Enable"
    }

    this.http.post<any>(`${this.url}/EnableDisableOwner`, obj).subscribe((data) => {
      
      
        if(data.status==false){
       

          this.commenmessages = data.message;
            $('#btn-CommenMessage-save-disp-btns').trigger('click');
  
          }
          else if(data.status==true){
            this.commenmessages = data.message
            $('#btn-CommenMessage-save-disp-btns').trigger('click');  
          
          } 




      },
      (err) => {}
    );

  }

  Disable_Owner(owr){
   
    var obj = 
    {
      _id : owr.Owner_id,
      Status: "Disable"
    }

    this.http.post<any>(`${this.url}/EnableDisableOwner`, obj).subscribe((data) => {
     
        if(data.status==false){
       

          this.commenmessages = data.message;
            $('#btn-CommenMessage-save-disp-btns').trigger('click');
  
          }
          else if(data.status==true){
            this.commenmessages = data.message
            $('#btn-CommenMessage-save-disp-btns').trigger('click');  
          
          } 



      },
      (err) => {}
    );

  }

  Archived_Owner(owr){
   
    var obj = 
    {
      _id : owr.Owner_id,
      Status: "Archieve"
    }

    this.http.post<any>(`${this.url}/EnableDisableOwner`, obj).subscribe((data) => {
             
        if(data.status==false){
       

          this.commenmessages = data.message;
            $('#btn-CommenMessage-save-disp-btns').trigger('click');
  
          }
          else if(data.status==true){
            this.commenmessages = data.message
            $('#btn-CommenMessage-save-disp-btns').trigger('click');  
          
          } 
      },
      (err) => {}
    );

  }



 

}
