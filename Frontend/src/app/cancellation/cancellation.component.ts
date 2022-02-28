import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Lopupdate } from './cancellation.model';
// import environment for cancellation Done By Alagesan	on 06.07.2021
import { environment } from '../../environments/environment';
declare var $: any;
declare var jQuery: any;
@Component({
  selector: 'app-cancellation',
  templateUrl: './cancellation.component.html',
  styleUrls: ['./cancellation.component.css'],
})
// Create Component for cancellation//Done By Alagesan on 20.05.2021
export class CancellationComponent implements OnInit {
  public ApproveLopDetails: Lopupdate = {};
  public IsmodelActive: boolean = false;
  // Add Base URL for cancellation  Done By Alagesan	on 06.07.2021
  EnvironmentURL:string = environment.url;
  cancellationUrl = this.EnvironmentURL+'api/Schedule';
  imagePath = this.EnvironmentURL+'api/uploads/';
  cancellationInfo: any;
  searchLoction: any = '';
  adminlogin: any;
  searchLoctions: any = '';
  Location_Name_dropDown: any = 'Location';
  Launch_Date_DropDown: any = 'Launch Date';
  url = this.EnvironmentURL+'api/Boat';
  loctions: any = [];
  bookingPushData: any[];
  cancellationData: any = [];
  LanchTYpe: any;
  getResponce: any;
  public NotFound: string = 'NotFound';
  public LOPUpdateUrl = this.EnvironmentURL+'api/LOA_Route/LOA_Create';
  constructor(private http: HttpClient, private router: Router) {}

  // Create Component for cancellation//Done By Alagesan on 20.05.2021

  ngOnInit(): void {

    $(".mobile-menu-icon").click(function(){
      $(".side-menu").toggleClass("mobile-sidebar");
    });
    
    this.adminlogin = JSON.parse(sessionStorage.getItem('adminLogin'));
    if (this.adminlogin == false) {
      this.router.navigate(['']);
    }
    sessionStorage.setItem('relodePg_book-for-owner', '1');
    sessionStorage.setItem('Adminbooking-relodePg', '1');
    sessionStorage.setItem('boat-maintenance-reload', '1');
    sessionStorage.setItem('view-boat-reload', '1');
    this.getCancelInfo();
    this.getLoction();
   

    $(document).on("click","#btn-click-reload",function() {
      
      location.reload();
      
    
     });




  }

  // Add launch date for cancellation//Done By Alagesan on 03.07.2021
  setLanDates(obj) {
    this.LanchTYpe = obj.target.innerHTML;

    this.Launch_Date_DropDown = obj.target.innerHTML;
  }

  getLoction() {
    this.http.get<any>(`${this.url}/GetLocation`).subscribe(
      (data) => {
        this.loctions = data['response'];
        console.log(this.loctions);
      },
      (err) => {}
    );
  }
  /**
   * Boat cancelation details
   * Re-writed Ajith
   */
  public getCancelInfo(): void {
    this.http
      .get<any>(`${this.cancellationUrl}/ViewCancelledBookingNew`)
      .subscribe(
        (data) => {

                    
          this.cancellationInfo = data['response'];
          this.cancellationData = this.cancellationInfo;
          console.log('cancellationData', this.cancellationInfo);
        },
        (err) => {}
      );
  }

 /**
  * Writed By Ajith
  * Approve button click Function 
  * @param cancelinfo Recived From template Looping Object
  */
  public ApproveLop(cancelinfo): void {
   
    debugger;
    this.IsmodelActive = true;
    this.ApproveLopDetails.Boat_Id = cancelinfo.BoatDetails[0]._id;
    this.ApproveLopDetails.Booking_ID = cancelinfo.Booking_ID;
    this.ApproveLopDetails.LOA = cancelinfo.LOA;
    this.ApproveLopDetails.WeekDay_Count = cancelinfo.WeekDay_Count;
    this.ApproveLopDetails.WeekEnd_Count = cancelinfo.WeekEnd_Count;
    this.ApproveLopDetails.IsActive = true;
    this.ApproveLopDetails._id = cancelinfo.Scheduleid;
    this.ApproveLopDetails.partialcancelationid = cancelinfo._id;
    


    this.ApproveLopDetails.WeekDay_Count_Edit = cancelinfo.WeekDay_Count;
    this.ApproveLopDetails.WeekEnd_Count_Edit = cancelinfo.WeekEnd_Count;
    this.ApproveLopDetails.Total_Edit_Loa = cancelinfo.Total_Edit_Loa;
    this.ApproveLopDetails.PartialCancellation_Status = cancelinfo.PartialCancellation_Status;




    if (cancelinfo.OwnerDetails.length) {
      this.ApproveLopDetails.Name = cancelinfo.OwnerDetails[0].First_Name;
    } else {
      this.ApproveLopDetails.Name = this.NotFound; 
    }
  }


  public ApproveLop_PartialCancellation_Status(cancelinfo): void {
   
   
    this.IsmodelActive = true;
    this.ApproveLopDetails.Boat_Id = cancelinfo.BoatDetails[0]._id;
    this.ApproveLopDetails.Booking_ID = cancelinfo.Booking_ID;
    this.ApproveLopDetails.LOA = cancelinfo.LOA;
    this.ApproveLopDetails.WeekDay_Count = cancelinfo.WeekDay_Count;
    this.ApproveLopDetails.WeekEnd_Count = cancelinfo.WeekEnd_Count;
    this.ApproveLopDetails.IsActive = true;
    this.ApproveLopDetails._id = cancelinfo.Scheduleid;
    this.ApproveLopDetails.partialcancelationid = cancelinfo._id;
    this.ApproveLopDetails.Scheduleid = cancelinfo.Scheduleid;


    this.ApproveLopDetails.WeekDay_Count_Edit = cancelinfo.WeekDay_Count_Edit;
    this.ApproveLopDetails.WeekEnd_Count_Edit = cancelinfo.WeekEnd_Count_Edit;
    this.ApproveLopDetails.Total_Edit_Loa = cancelinfo.Total_Edit_Loa;
    this.ApproveLopDetails.PartialCancellation_Status = cancelinfo.PartialCancellation_Status;




    if (cancelinfo.OwnerDetails.length) {
      this.ApproveLopDetails.Name = cancelinfo.OwnerDetails[0].First_Name;
    } else {
      this.ApproveLopDetails.Name = this.NotFound; 
    }
  }





/**
 * Update Lop Function 
 * Writed By Ajith
 */
  public UpdateLop(): void {
    
    debugger;
    // if(this.ApproveLopDetails.LOA){
      delete this.ApproveLopDetails.Name

      /*
      WeekDay_Count
      WeekEnd_Count
      */
      
       console.log(this.ApproveLopDetails);
        this.http.post<any>(`${this.cancellationUrl}/ApproveCancellationNew`, this.ApproveLopDetails  ).subscribe(data => {  

         if(data.status == true){

          this.getResponce = data.message;
          $('#pop-up-btn_btn').trigger('click');

         }
         
        console.log('uploadsuccess', data);
      });
    //  }else{

    //   this.getResponce = "LOA is Required";
    //       $('#pop-up-btn_btn').trigger('click');

     
    // }
  }

  getLoctionTypeId(ids) {
    this.bookingPushData = [];
    console.log(ids._id);
    this.Location_Name_dropDown = ids.Boat_Location;
    this.cancellationData.forEach((boat) => {
      if (ids._id == boat.BoatDetails[0].Location_Id) {
        console.log(boat.BoatDetails[0].Location_Id);

        this.bookingPushData.push(boat);
      }
    });
    this.cancellationInfo = this.bookingPushData;
  }

  // Location dropdown clear for cancellation //Done By Alagesan on 25.06.2021
  pageRefresh() {
   
    location.reload();
  }
}
