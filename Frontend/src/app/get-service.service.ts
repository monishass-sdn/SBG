import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import environment for services Done By Alagesan	on 06.07.2021
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GetServiceService {

  constructor(private http: HttpClient) { }

   // Add Base URL for all owners  Done By Alagesan	on 06.07.2021
   EnvironmentURL:string = environment.url;

  url = this.EnvironmentURL+"api/Boat"


  getboatByLoction(id) {
   
    console.log(id)
    var hhh = id
    return this
            .http
            .get(`${this.url}/GetBoatDetailsByLocation?Location_Id=${id=hhh}`);
    }

}
