import { Component, OnInit } from '@angular/core';
import { MTservice } from '../../mt-services';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  data: any = {};
  constructor(public mtServ: MTservice) {
    this.mtServ = mtServ;
    this.data.loader = false;
  }

  ngOnInit() {
    this.data.loader = true;

    const apiurl = this.mtServ.apiLink + 'profile';
    const userForm = new FormData();
    const stringifyData = JSON.stringify({'id': this.mtServ.getLoggedUser().uid});
    userForm.append('data', btoa(stringifyData));
    this.mtServ.MtPost(apiurl, userForm, '').then(data => {
      this.data.loader = false;
      if(data['profile']) {
        this.data.profData = JSON.parse(atob(data['data']))[0];
    	}
    });
  }

}
