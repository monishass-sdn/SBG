// Create Component for booking report //Done By Alagesan on 25.05.2021	
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare var $: any;
declare var jQuery: any;


@Component({
  selector: 'app-report-booking',
  templateUrl: './report-booking.component.html',
  styleUrls: ['./report-booking.component.css']
})
export class ReportBookingComponent implements OnInit {
  adminlogin: any;

  constructor(private router: Router,) { }

  ngOnInit(): void {

    $(".mobile-menu-icon").click(function(){
      $(".side-menu").toggleClass("mobile-sidebar");
    });

    this.adminlogin = JSON.parse(sessionStorage.getItem("adminLogin"));
    if(this.adminlogin==false){
      this.router.navigate(['']);
    }
    sessionStorage.setItem("relodePg_book-for-owner","1");
sessionStorage.setItem("Adminbooking-relodePg","1");
 sessionStorage.setItem("boat-maintenance-reload","1");
 sessionStorage.setItem("view-boat-reload","1");
  }

}
// Create Component for booking report //Done By Alagesan on 25.05.2021	
