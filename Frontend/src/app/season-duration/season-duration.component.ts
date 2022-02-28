import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormGroup, FormControl,FormBuilder, Validators} from '@angular/forms';
declare var $: any;
declare var jQuery: any;
@Component({
  selector: 'app-season-duration',
  templateUrl: './season-duration.component.html',
  styleUrls: ['./season-duration.component.css']
})
export class SeasonDurationComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    
    function selectDate(date) {
      $('.calendar-wrapper').updateCalendarOptions({
        date: date
      });
    }
    
    var defaultConfig = {
      weekDayLength: 1,
      date: new Date(),
      onClickDate: selectDate,
      showYearDropdown: true,
    };
    
    $('.calendar-wrapper').calendar(defaultConfig);
    $("input[type='number']").inputSpinner()

      $('#example').DataTable( {
          responsive: {
              details: {
                  display: $.fn.dataTable.Responsive.display.modal( {
                      header: function ( row ) {
                          var data = row.data();
                          return 'Details for '+data[0]+' '+data[1];
                      }
                  } ),
                  renderer: $.fn.dataTable.Responsive.renderer.tableAll( {
                      tableClass: 'table'
                  } )
              }
          }
      } );
  }

}
