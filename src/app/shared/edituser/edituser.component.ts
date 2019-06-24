import { Component, OnInit } from '@angular/core';
import { MTservice } from '../../mt-services';

@Component({
  selector: 'app-edituser',
  templateUrl: './edituser.component.html',
  styleUrls: ['./edituser.component.css']
})
export class EdituserComponent implements OnInit {
  data: any = {};
  constructor(public mtServ: MTservice) { }

  ngOnInit() {

    var apiurl = this.mtServ.apiLink+'account/users/?id=1'; 
    this.mtServ.MtGet(apiurl, '').then(data => {
      
      this.data.edt = data;
    });


  }

}
