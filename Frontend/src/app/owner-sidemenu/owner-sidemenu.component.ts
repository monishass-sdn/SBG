import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-owner-sidemenu',
  templateUrl: './owner-sidemenu.component.html',
  styleUrls: ['./owner-sidemenu.component.css']
})
// Create Component for owner sidemenu //Done By Alagesan

export class OwnerSidemenuComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {

    var session_Chek = JSON.parse(sessionStorage.getItem("userToken"));
    if(session_Chek == null){
     // this.router.navigate(['/session-Expire/']);
     this.router.navigate(['']);
    }

  }
  openSmartBoating(){
    //alert();
    $('#btn-Iframe-save-disp-btns').trigger('click');
  }

}

// Create Component for owner sidemenu //Done By Alagesan

