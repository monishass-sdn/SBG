import { Component, OnInit } from '@angular/core';
declare var $: any;
declare var jQuery: any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

   
    //  $(".mobile-menu-icon").click(function(){
    //    $(".side-menu").toggleClass("mobile-sidebar");
    //  });

  }
  logout(){
    
    sessionStorage.clear();
    //sessionStorage.setItem('adminLogin', JSON.stringify(false));   // if it's object

  }

 

}
